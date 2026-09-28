import React, { useEffect, useRef, useState } from 'react';
import { Animated, Switch, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as Speech from 'expo-speech';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useStore } from '../../src/store';
import * as Audio from '../../src/audio';
import { Body, Btn, Heading, Label, Screen, Seg, TextLink } from '../../src/components/ui';
import { fonts } from '../../src/theme';

const fmt = (sec: number) => Math.floor(sec / 60) + ':' + String(Math.floor(sec % 60)).padStart(2, '0');
const IDLE = 'Lie down, get comfortable, and press begin.';

export default function Player() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { c, sessions, canUse, keptToday } = useStore();
  const session = sessions.find((x) => x.id === id) || sessions[0];
  const [len, setLen] = useState<5 | 10>(5);
  const [state, setState] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [t, setT] = useState(0);
  const [line, setLine] = useState(IDLE);
  const [voice, setVoice] = useState(false);
  const voiceRef = useRef(false);
  voiceRef.current = voice;
  const lineO = useRef(new Animated.Value(1)).current;
  const clock = useRef<{ iv?: any; t: number; last: number; next: number; paused: boolean }>({ t: 0, last: 0, next: 0, paused: false });
  const dur = len * 60;
  const recorded = len === 5 ? session.audio5 : session.audio10;

  useEffect(() => {
    if (!canUse(session)) router.replace('/paywall');
    return () => stopAll(true);
  }, []);

  const showLine = (txt: string) => {
    Animated.timing(lineO, { toValue: 0, duration: 800, useNativeDriver: true }).start(() => {
      setLine(txt);
      Animated.timing(lineO, { toValue: 1, duration: 1200, useNativeDriver: true }).start();
    });
    if (voiceRef.current && !recorded) Speech.speak(txt, { rate: 0.8, pitch: 0.95, language: 'en-AU' });
  };

  function stopAll(silent: boolean) {
    clearInterval(clock.current.iv);
    Speech.stop();
    Audio.stop('voice', 1);
    Audio.stop('ambient', 2);
    Promise.resolve(deactivateKeepAwake()).catch(() => {});
    if (!silent) {
      setState('idle');
      setT(0);
      setLine(IDLE);
    }
  }

  const end = (natural: boolean) => {
    stopAll(true);
    setState('idle');
    setT(0);
    if (keptToday) {
      setTimeout(() => router.replace('/goodnight'), natural ? 2500 : 0);
    } else {
      setLine(IDLE);
    }
  };

  const start = async () => {
    Promise.resolve(activateKeepAwakeAsync()).catch(() => {});
    if (recorded) await Audio.play('voice', recorded, { volume: 1, loop: false, fadeIn: 0.5, title: session.title });
    await Audio.play('ambient', 'hum', { volume: recorded ? 0.12 : 0.28, loop: true, fadeIn: 4, title: session.title });
    clock.current = { t: 0, last: Date.now(), next: 0, paused: false };
    setState('playing');
    clock.current.iv = setInterval(() => {
      const k = clock.current;
      const now = Date.now();
      if (!k.paused) k.t += (now - k.last) / 1000;
      k.last = now;
      setT(Math.min(k.t, dur));
      const f = k.t / dur;
      while (k.next < session.script.length && f >= session.script[k.next][0]) {
        showLine(session.script[k.next][1]);
        k.next++;
      }
      if (k.t >= dur) end(true);
    }, 250);
  };

  const togglePause = () => {
    const k = clock.current;
    k.paused = !k.paused;
    k.last = Date.now();
    setState(k.paused ? 'paused' : 'playing');
    Audio.pause('ambient', k.paused, recorded ? 0.12 : 0.28);
    Audio.pause('voice', k.paused, 1);
    if (k.paused) Speech.stop();
  };

  return (
    <Screen>
      <View style={{ gap: 22 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Label>{session.isMonthly ? "This month's ritual" : 'Guided rest'}</Label>
          <TextLink
            title="Library"
            onPress={() => {
              stopAll(true);
              router.back();
            }}
          />
        </View>
        <Heading>{session.title}</Heading>
        <Seg
          options={[
            { label: '5 minutes', value: 5 },
            { label: '10 minutes', value: 10 },
          ]}
          value={len}
          onChange={(v) => state === 'idle' && setLen(v as 5 | 10)}
        />
        <View style={{ minHeight: 220, alignItems: 'center', justifyContent: 'center', borderTopWidth: 1, borderBottomWidth: 1, borderColor: c.line, paddingVertical: 26, paddingHorizontal: 10 }}>
          <Animated.Text
            accessibilityLiveRegion="polite"
            style={{ fontFamily: fonts.serifItalic, fontSize: 25, lineHeight: 33, color: c.ink, textAlign: 'center', maxWidth: 300, opacity: lineO }}
          >
            {line}
          </Animated.Text>
        </View>
        <View style={{ gap: 8 }}>
          <View style={{ height: 2, backgroundColor: c.line }}>
            <View style={{ height: 2, width: `${Math.min(100, (t / dur) * 100)}%`, backgroundColor: c.gold }} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: fonts.sansRegular, fontSize: 11, color: c.muted, fontVariant: ['tabular-nums'] }}>{fmt(t)}</Text>
            <Text style={{ fontFamily: fonts.sansRegular, fontSize: 11, color: c.muted, fontVariant: ['tabular-nums'] }}>{fmt(dur)}</Text>
          </View>
        </View>
        {!recorded && (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <Body muted size={13} style={{ flex: 1 }}>
              Read the guidance aloud (device voice)
            </Body>
            <Switch value={voice} onValueChange={setVoice} trackColor={{ true: c.gold, false: c.raise }} thumbColor={c.ink} />
          </View>
        )}
        <View style={{ gap: 10 }}>
          <Btn title={state === 'idle' ? 'Begin' : state === 'playing' ? 'Pause' : 'Resume'} onPress={state === 'idle' ? start : togglePause} />
          {state !== 'idle' && <Btn title="End session" ghost onPress={() => end(false)} />}
        </View>
      </View>
    </Screen>
  );
}
