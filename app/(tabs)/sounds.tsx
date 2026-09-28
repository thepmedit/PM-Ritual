import React, { useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { useStore } from '../../src/store';
import { SOUNDS, SoundKey } from '../../src/content';
import * as Audio from '../../src/audio';
import { Body, Heading, Label, Pill, Screen, Seg } from '../../src/components/ui';

const VOLS = [
  { label: 'Soft', value: 0.35 },
  { label: 'Medium', value: 0.6 },
  { label: 'Full', value: 0.9 },
];

export default function Sounds() {
  const { c, isMember } = useStore();
  const [playing, setPlaying] = useState<SoundKey | null>(null);
  const [vol, setVol] = useState(0.6);
  const [timer, setTimer] = useState(30);
  const [endsAt, setEndsAt] = useState<Date | null>(null);
  const fadeTimer = useRef<any>(null);

  useEffect(() => () => clearTimeout(fadeTimer.current), []);

  const arm = (on: boolean, minutes: number) => {
    clearTimeout(fadeTimer.current);
    setEndsAt(null);
    if (!on || !minutes) return;
    const at = new Date(Date.now() + minutes * 60000);
    setEndsAt(at);
    fadeTimer.current = setTimeout(() => {
      Audio.stop('ambient', 45);
      setPlaying(null);
      setEndsAt(null);
    }, minutes * 60000);
  };

  const tap = async (key: SoundKey, membersOnly: boolean, title: string) => {
    if (membersOnly && !isMember) return router.push('/paywall');
    if (playing === key) {
      Audio.stop('ambient', 1.2);
      setPlaying(null);
      arm(false, 0);
      return;
    }
    Audio.stop('voice', 0.5);
    await Audio.play('ambient', key, { volume: vol, loop: true, fadeIn: 2.5, title });
    setPlaying(key);
    arm(true, timer);
  };

  const note = !playing
    ? 'Tap a sound to begin. It will fade gently when the timer ends.'
    : endsAt
    ? 'Fading out around ' + endsAt.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit' }) + '.'
    : 'Playing until you stop it.';

  return (
    <Screen>
      <View style={{ gap: 22 }}>
        <View style={{ gap: 6 }}>
          <Label>Sleep sounds</Label>
          <Heading>Something to drift to</Heading>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {SOUNDS.map((snd) => {
            const on = playing === snd.key;
            const locked = snd.membersOnly && !isMember;
            return (
              <Pressable
                key={snd.key}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                accessibilityLabel={snd.title + (on ? ', playing' : locked ? ', members only' : '')}
                onPress={() => tap(snd.key, snd.membersOnly, snd.title)}
                style={{
                  width: '47.5%',
                  flexGrow: 1,
                  minHeight: 116,
                  padding: 16,
                  gap: 4,
                  borderRadius: 3,
                  borderWidth: 1,
                  borderColor: on ? c.gold : c.line,
                  backgroundColor: on ? c.goldSoft : c.surface,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6 }}>
                  <Heading size={21} style={{ flex: 1 }}>
                    {snd.title}
                  </Heading>
                  {on ? <Label style={{ fontSize: 9 }}>Playing</Label> : locked ? <Pill>Members</Pill> : null}
                </View>
                <Body muted size={12}>
                  {snd.subtitle}
                </Body>
              </Pressable>
            );
          })}
        </View>

        <View style={{ gap: 10 }}>
          <Label>Volume</Label>
          <Seg
            options={VOLS}
            value={vol}
            onChange={(v) => {
              setVol(v);
              Audio.setVolume('ambient', v);
            }}
          />
        </View>

        <View style={{ gap: 10 }}>
          <Label>Fade out after</Label>
          <Seg
            options={[
              { label: '15 min', value: 15 },
              { label: '30 min', value: 30 },
              { label: '1 hour', value: 60 },
              { label: 'Off', value: 0 },
            ]}
            value={timer}
            onChange={(v) => {
              setTimer(v);
              arm(!!playing, v);
            }}
          />
          <Body muted size={12}>
            {note}
          </Body>
        </View>
      </View>
    </Screen>
  );
}
