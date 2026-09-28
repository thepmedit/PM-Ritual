import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { candlelight, evening, Palette } from './theme';
import { QUOTES, Quote, Session, SESSIONS, MILESTONES } from './content';
import { initPurchases, onMembershipChange } from './purchases';

export const dayKey = (d: Date = new Date()) =>
  d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

export const dayIndex = (d: Date = new Date()) =>
  Math.floor((new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() - new Date(2026, 0, 1).getTime()) / 864e5);

export const pickByDay = <T,>(arr: T[], d: Date = new Date()): T => arr[((dayIndex(d) % arr.length) + arr.length) % arr.length];

export type JournalEntry = { date: string; items: string[] };

export type AppState = {
  onboarded: boolean;
  name: string;
  ritualTime: string; // "21:30"
  nightsKept: number;
  lastRitual: string;
  log: string[];
  journal: JournalEntry[];
  checkins: Record<string, number>;
  candle: boolean;
  candleAuto: boolean;
  reminders: boolean;
  seenMilestone: number;
  draft: { date: string; items: string[] };
  devMember: boolean; // only used in development builds
};

const initial: AppState = {
  onboarded: false,
  name: '',
  ritualTime: '21:30',
  nightsKept: 0,
  lastRitual: '',
  log: [],
  journal: [],
  checkins: {},
  candle: false,
  candleAuto: false,
  reminders: true,
  seenMilestone: 0,
  draft: { date: '', items: ['', '', ''] },
  devMember: false,
};

type Ctx = {
  ready: boolean;
  s: AppState;
  set: (patch: Partial<AppState>) => void;
  reset: () => Promise<void>;
  c: Palette;
  isMember: boolean;
  keptToday: boolean;
  completeRitual: () => void;
  canUse: (sess: Session) => boolean;
  quotes: Quote[];
  sessions: Session[];
  nextMilestone: typeof MILESTONES[number] | undefined;
};

const StoreCtx = createContext<Ctx>(null as any);
const KEY = 'pm.state.v1';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [s, setS] = useState<AppState>(initial);
  const [ready, setReady] = useState(false);
  const [member, setMember] = useState(false);
  const [quotes, setQuotes] = useState<Quote[]>(QUOTES);
  const [sessions, setSessions] = useState<Session[]>(SESSIONS);
  const saveTimer = useRef<any>(null);

  // load saved state
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) setS({ ...initial, ...JSON.parse(raw) });
      } catch {}
      setReady(true);
    })();
  }, []);

  // save (debounced)
  useEffect(() => {
    if (!ready) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      AsyncStorage.setItem(KEY, JSON.stringify(s)).catch(() => {});
    }, 250);
  }, [s, ready]);

  // purchases
  useEffect(() => {
    initPurchases();
    return onMembershipChange(setMember);
  }, []);

  // optional remote content (quotes + sessions) so new monthly rituals need no app update
  useEffect(() => {
    const url = (Constants.expoConfig?.extra as any)?.contentUrl;
    if (!url) return;
    fetch(url)
      .then((r) => r.json())
      .then((j) => {
        if (Array.isArray(j.quotes) && j.quotes.length) setQuotes(j.quotes);
        if (Array.isArray(j.sessions) && j.sessions.length) setSessions(j.sessions);
      })
      .catch(() => {});
  }, []);

  const set = useCallback((patch: Partial<AppState>) => setS((p) => ({ ...p, ...patch })), []);
  const reset = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(KEY);
    } catch {}
    setS(initial);
  }, []);

  const today = dayKey();
  const keptToday = s.lastRitual === today;
  const isMember = member || (__DEV__ && s.devMember);

  // Candlelight: manual switch, or automatic from ritual time until 6am
  const autoCandle = useMemo(() => {
    if (!s.candleAuto) return false;
    const now = new Date();
    const [h, m] = s.ritualTime.split(':').map(Number);
    const mins = now.getHours() * 60 + now.getMinutes();
    return mins >= h * 60 + m || mins < 6 * 60;
  }, [s.candleAuto, s.ritualTime]);
  const c = s.candle || autoCandle ? candlelight : evening;

  const completeRitual = useCallback(() => {
    setS((p) => {
      const t = dayKey();
      if (p.lastRitual === t) {
        // already counted tonight; still save any journal entries
        return withJournal(p, t);
      }
      return withJournal({ ...p, nightsKept: p.nightsKept + 1, lastRitual: t, log: [...p.log, t].slice(-400) }, t);
    });
  }, []);

  const canUse = useCallback(
    (sess: Session) => !sess.membersOnly || isMember || (!!sess.unlockAtNights && s.nightsKept >= sess.unlockAtNights),
    [isMember, s.nightsKept]
  );

  const nextMilestone = MILESTONES.find((m) => m.n > s.nightsKept);

  const value: Ctx = {
    ready,
    s,
    set,
    reset,
    c,
    isMember,
    keptToday,
    completeRitual,
    canUse,
    quotes,
    sessions,
    nextMilestone,
  };
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

function withJournal(p: AppState, t: string): AppState {
  if (p.draft.date !== t) return p;
  const items = p.draft.items.map((x) => x.trim()).filter(Boolean);
  if (!items.length) return p;
  const journal = [{ date: t, items }, ...p.journal.filter((e) => e.date !== t)].slice(0, 60);
  return { ...p, journal };
}

export const useStore = () => useContext(StoreCtx);
