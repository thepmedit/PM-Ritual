import React from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import Constants from 'expo-constants';
import { dayKey, pickByDay, useStore } from '../../src/store';
import { MILESTONES, thisMonth } from '../../src/content';
import { Body, Btn, Card, Divider, Heading, Label, Pill, Screen, TextLink, Why, useToast } from '../../src/components/ui';
import { fonts } from '../../src/theme';

const FEEL = ['', 'restless', 'light', 'okay', 'deep', 'restored'];
const CHECK = ['Restless', 'Light', 'Okay', 'Deep', 'Restored'];

export default function Tonight() {
  const { c, s, set, keptToday, isMember, quotes, nextMilestone } = useStore();
  const toast = useToast();
  const now = new Date();
  const h = now.getHours();
  const greet = (h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening') + (s.name ? ', ' + s.name : '') + '.';
  const q = pickByDay(quotes);
  const n = s.nightsKept;
  const today = dayKey();

  const showCheckin = h < 12 && n > 0 && !s.checkins[today];
  const reached = [...MILESTONES].reverse().find((m) => m.n <= n);
  const showReward = reached && reached.n > 1 && reached.n > s.seenMilestone;
  const month = thisMonth();
  const shopUrl = (Constants.expoConfig?.extra as any)?.shopUrl;

  // week of rest
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    const k = dayKey(d);
    return { k, day: d.toLocaleDateString('en-AU', { weekday: 'narrow' }), kept: s.log.includes(k), score: s.checkins[k] };
  });
  const keptWeek = week.filter((w) => w.kept).length;
  const scores = week.map((w) => w.score).filter(Boolean) as number[];
  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  return (
    <Screen>
      <Text style={{ fontFamily: fonts.serifItalic, fontSize: 19, color: c.muted }}>{greet}</Text>

      {showCheckin && (
        <Card style={{ marginTop: 18 }}>
          <Label>Good morning</Label>
          <Heading size={22}>How did you sleep?</Heading>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {CHECK.map((label, i) => (
              <Pressable
                key={label}
                accessibilityRole="button"
                onPress={() => {
                  set({ checkins: { ...s.checkins, [today]: i + 1 } });
                  toast('Noted. Thank you.');
                }}
                style={{ flex: 1, borderWidth: 1, borderColor: c.line, borderRadius: 2, paddingVertical: 12, alignItems: 'center' }}
              >
                <Text numberOfLines={1} adjustsFontSizeToFit style={{ fontFamily: fonts.sansRegular, fontSize: 9.5, letterSpacing: 0.4, textTransform: 'uppercase', color: c.muted }}>
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Card>
      )}

      {/* tonight's quote */}
      <View style={{ paddingVertical: 30, alignItems: 'center', gap: 14, borderBottomWidth: 1, borderBottomColor: c.line }}>
        <Label>Tonight's words</Label>
        <Heading size={28} italic center>
          {q.text}
        </Heading>
        <Label color={c.muted} style={{ fontSize: 10 }}>
          {q.author}
        </Label>
      </View>

      <View style={{ gap: 14, paddingTop: 28 }}>
        {showReward && reached && (
          <Card glow>
            <Label>Milestone reached</Label>
            <Heading size={24}>{reached.title}</Heading>
            <Body muted size={14}>
              {reached.reward}
            </Body>
            <TextLink title="Thank you" onPress={() => set({ seenMilestone: reached.n })} />
          </Card>
        )}

        <Card glow style={{ padding: 22, gap: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10 }}>
            <Text style={{ fontFamily: fonts.serif, fontSize: 40, color: c.gold, lineHeight: 44 }}>{n}</Text>
            <Label color={c.muted} style={{ fontSize: 11 }}>
              {n === 1 ? 'Night kept' : 'Nights kept'}
            </Label>
          </View>
          <Heading size={22}>Your nightly ritual</Heading>
          <Body muted size={14}>
            Pulse oil, pillow spray, silk, three moments in your PM Guide and a slow breath. About ten minutes.
          </Body>
          <Btn title={keptToday ? "Revisit tonight's ritual" : "Begin tonight's ritual"} onPress={() => router.push('/ritual')} />
          {nextMilestone && (
            <Body muted size={12}>
              {nextMilestone.n - n} more {nextMilestone.n - n === 1 ? 'night' : 'nights'} to "{nextMilestone.title}".
            </Body>
          )}
        </Card>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Card style={{ flex: 1, gap: 6 }} onPress={() => router.push('/(tabs)/rest')}>
            <Heading size={20}>Guided rest</Heading>
            <Body muted size={12}>
              Wind-downs of 5 or 10 minutes
            </Body>
          </Card>
          <Card style={{ flex: 1, gap: 6 }} onPress={() => router.push('/(tabs)/sounds')}>
            <Heading size={20}>Sleep sounds</Heading>
            <Body muted size={12}>
              Rain, ocean, deep hush
            </Body>
          </Card>
        </View>

        <Card onPress={() => router.push(isMember ? '/player/month' : '/paywall')}>
          <Label>This month's ritual</Label>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <Heading size={22} style={{ flex: 1 }}>
              {month[0]}
            </Heading>
            {!isMember && <Pill>Members</Pill>}
          </View>
          <Body muted size={13}>
            {month[1]}
          </Body>
        </Card>

        {n >= 42 && n % 42 < 7 && (
          <Card>
            <Label>Replenish</Label>
            <Body>You've kept {n} nights. Your Deep Sleep oil and pillow spray may be running low.</Body>
            {!!shopUrl && <TextLink title="Reorder refills" onPress={() => Linking.openURL(shopUrl)} />}
          </Card>
        )}
      </View>

      {/* week of rest */}
      <View style={{ paddingTop: 30, gap: 12 }}>
        <Label>Your week of rest</Label>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {week.map((w) => (
            <View key={w.k} style={{ flex: 1, alignItems: 'center', gap: 6 }}>
              <Text style={{ fontFamily: fonts.sansRegular, fontSize: 10, color: c.muted }}>{w.day}</Text>
              <View
                style={{
                  alignSelf: 'stretch',
                  height: 34,
                  borderRadius: 2,
                  borderWidth: 1,
                  borderColor: w.kept ? c.goldLine : c.line,
                  backgroundColor: w.kept ? c.goldSoft : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {w.kept && <Text style={{ color: c.gold, fontSize: 13 }}>✦</Text>}
              </View>
            </View>
          ))}
        </View>
        <Body muted size={12}>
          {keptWeek
            ? `${keptWeek} of the last 7 nights kept.` + (avg ? ` Most mornings you felt ${FEEL[avg]}.` : '')
            : 'Each night you keep your ritual is marked here.'}
        </Body>
      </View>

      {/* journal kept on the phone */}
      {s.journal.length > 0 && (
        <View style={{ paddingTop: 30 }}>
          <Label style={{ marginBottom: 12 }}>Moments kept here</Label>
          {s.journal.slice(0, 5).map((e) => (
            <View key={e.date} style={{ borderTopWidth: 1, borderTopColor: c.line, paddingVertical: 14, gap: 6 }}>
              <Label color={c.muted} style={{ fontSize: 10 }}>
                {new Date(e.date + 'T12:00:00').toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })}
              </Label>
              {e.items.map((it, i) => (
                <Text key={i} style={{ fontFamily: fonts.serif, fontSize: 17, lineHeight: 24, color: c.ink }}>
                  {i + 1}. {it}
                </Text>
              ))}
            </View>
          ))}
          <Divider />
        </View>
      )}
    </Screen>
  );
}
