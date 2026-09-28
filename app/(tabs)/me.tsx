import React, { useState } from 'react';
import { Linking, Switch, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import Constants from 'expo-constants';
import { useStore } from '../../src/store';
import { MILESTONES } from '../../src/content';
import { askPermission } from '../../src/notifications';
import { restore } from '../../src/purchases';
import { Body, Btn, Card, Heading, Label, Screen, TextLink, useToast } from '../../src/components/ui';
import { TimePicker } from '../../src/components/TimePicker';
import { fonts } from '../../src/theme';

export default function Me() {
  const { c, s, set, isMember, reset } = useStore();
  const toast = useToast();
  const extra: any = Constants.expoConfig?.extra || {};
  const [name, setName] = useState(s.name);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const Row = ({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 14, paddingVertical: 6 }}>
      <Body size={14} style={{ flex: 1 }}>
        {label}
      </Body>
      <Switch value={value} onValueChange={onChange} trackColor={{ true: c.gold, false: c.raise }} thumbColor={c.ink} />
    </View>
  );

  return (
    <Screen>
      <View style={{ gap: 28 }}>
        <View style={{ gap: 6 }}>
          <Label>Your ritual</Label>
          <Heading>{s.name ? s.name + "'s evenings" : 'Your evenings'}</Heading>
        </View>

        {isMember ? (
          <Card glow>
            <Label>Member</Label>
            <Heading size={22}>The PM Ritual membership</Heading>
            <Body muted size={13.5}>
              The full library, every sound and each month's new ritual are yours.
            </Body>
          </Card>
        ) : (
          <Card>
            <Label>Free</Label>
            <Heading size={22}>The full ritual awaits</Heading>
            <Body muted size={13.5}>
              Unlock the complete rest library, every sound and a new ritual each month.
            </Body>
            <Btn title="See membership" onPress={() => router.push('/paywall')} />
          </Card>
        )}

        <View style={{ gap: 18 }}>
          <View style={{ gap: 4 }}>
            <Label color={c.muted}>Your name</Label>
            <TextInput
              value={name}
              onChangeText={setName}
              onEndEditing={() => {
                set({ name: name.trim() });
                toast('Saved');
              }}
              placeholder="Your first name"
              placeholderTextColor={c.faint}
              maxLength={30}
              style={{ fontFamily: fonts.serif, fontSize: 20, color: c.ink, borderBottomWidth: 1, borderBottomColor: c.line, paddingVertical: 10 }}
            />
          </View>
          <View style={{ gap: 12 }}>
            <Label color={c.muted}>Ritual time</Label>
            <TimePicker
              value={s.ritualTime}
              onChange={(t) => {
                set({ ritualTime: t });
                toast('Reminder time saved');
              }}
            />
          </View>
          <Row
            label="Bedtime reminder"
            value={s.reminders}
            onChange={async (v) => {
              if (v && !(await askPermission())) {
                toast('Turn on notifications in Settings to get reminders.');
                return;
              }
              set({ reminders: v });
            }}
          />
          <Row label="Candlelight mode: a dim, warm screen for bed" value={s.candle} onChange={(v) => set({ candle: v })} />
          <Row label="Turn on Candlelight automatically at my ritual time" value={s.candleAuto} onChange={(v) => set({ candleAuto: v })} />
        </View>

        <View>
          <Label style={{ marginBottom: 12 }}>Milestones</Label>
          {MILESTONES.map((m) => {
            const got = s.nightsKept >= m.n;
            return (
              <View key={m.n} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, borderTopWidth: 1, borderTopColor: c.line }}>
                <Text style={{ width: 52, textAlign: 'center', fontFamily: fonts.serif, fontSize: 26, color: c.gold }}>{m.n}</Text>
                <View style={{ flex: 1 }}>
                  <Body size={13.5}>{m.title}</Body>
                  <Body muted size={12}>
                    {m.reward}
                  </Body>
                </View>
                <Label color={got ? c.gold : c.muted} style={{ fontSize: 9 }}>
                  {got ? 'Kept' : `${m.n - s.nightsKept} to go`}
                </Label>
              </View>
            );
          })}
        </View>

        <View style={{ gap: 4, borderTopWidth: 1, borderTopColor: c.line, paddingTop: 14 }}>
          <TextLink
            title="Restore purchases"
            onPress={async () => {
              const ok = await restore();
              toast(ok ? 'Your membership has been restored.' : 'No membership found for this Apple ID.');
            }}
          />
          <TextLink title="Privacy policy" onPress={() => extra.privacyUrl && Linking.openURL(extra.privacyUrl)} />
          <TextLink title="Terms of use" onPress={() => extra.termsUrl && Linking.openURL(extra.termsUrl)} />
          {!confirmDelete ? (
            <TextLink title="Erase my data" onPress={() => setConfirmDelete(true)} />
          ) : (
            <Card style={{ marginTop: 8 }}>
              <Body size={14}>This erases your name, nights kept, journal and check-ins from this phone. It can't be undone. Your membership is kept by Apple and can be restored.</Body>
              <Btn
                title="Erase everything"
                onPress={async () => {
                  await reset();
                  router.replace('/onboarding');
                }}
              />
              <Btn title="Keep my data" ghost onPress={() => setConfirmDelete(false)} />
            </Card>
          )}
        </View>

        {__DEV__ && (
          <Card>
            <Label>Development controls</Label>
            <Body muted size={12}>
              Only visible in test builds.
            </Body>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              <Btn small ghost title="+1 night" onPress={() => set({ nightsKept: s.nightsKept + 1 })} />
              <Btn small ghost title="+7 nights" onPress={() => set({ nightsKept: s.nightsKept + 7 })} />
              <Btn small ghost title="Toggle member" onPress={() => set({ devMember: !s.devMember })} />
            </View>
          </Card>
        )}
      </View>
    </Screen>
  );
}
