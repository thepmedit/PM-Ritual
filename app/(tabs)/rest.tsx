import React from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { useStore } from '../../src/store';
import { Body, Heading, Label, Pill, Screen } from '../../src/components/ui';

export default function Rest() {
  const { c, sessions, canUse } = useStore();
  return (
    <Screen>
      <View style={{ gap: 6, paddingBottom: 18 }}>
        <Label>Guided rest</Label>
        <Heading>Choose tonight's wind-down</Heading>
      </View>
      {sessions.map((s, i) => {
        const ok = canUse(s);
        return (
          <Pressable
            key={s.id}
            accessibilityRole="button"
            accessibilityLabel={s.title + (ok ? '' : ', members only')}
            onPress={() => router.push(ok ? `/player/${s.id}` : '/paywall')}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 14,
              paddingVertical: 18,
              borderTopWidth: 1,
              borderBottomWidth: i === sessions.length - 1 ? 1 : 0,
              borderColor: c.line,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <View style={{ flex: 1, gap: 2 }}>
              <Heading size={21}>{s.title}</Heading>
              <Body muted size={12}>
                {s.subtitle}
              </Body>
            </View>
            {ok ? <Pill muted>5 · 10 min</Pill> : <Pill>Members</Pill>}
          </Pressable>
        );
      })}
    </Screen>
  );
}
