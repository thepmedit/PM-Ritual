import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { useStore } from '../src/store';
import { Body, Btn, FadeIn, Heading, Label, Screen, Why } from '../src/components/ui';
import { TimePicker } from '../src/components/TimePicker';
import { fonts } from '../src/theme';
import { askPermission } from '../src/notifications';
import { redeemCode } from '../src/purchases';

export default function Onboarding() {
  const { c, s, set } = useStore();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(s.name);
  const [time, setTime] = useState(s.ritualTime);

  const finish = () => {
    set({ onboarded: true });
    router.replace('/(tabs)/tonight');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: c.night }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen header={false} contentStyle={{ justifyContent: 'center', paddingTop: 40 }}>
        {step === 0 && (
          <FadeIn key="0" style={{ gap: 26 }}>
            <Label>Welcome to The PM Ritual</Label>
            <Heading size={40}>Your evenings, made gentle.</Heading>
            <Why>A nightly ritual in ten quiet minutes.</Why>
            <Btn title="Begin" onPress={() => setStep(1)} style={{ marginTop: 20 }} />
          </FadeIn>
        )}

        {step === 1 && (
          <FadeIn key="1" style={{ gap: 26 }}>
            <Label>About you</Label>
            <View style={{ gap: 6 }}>
              <Label color={c.muted}>What should we call you?</Label>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Your first name"
                placeholderTextColor={c.faint}
                autoComplete="given-name"
                textContentType="givenName"
                maxLength={30}
                returnKeyType="done"
                style={{ fontFamily: fonts.serif, fontSize: 22, color: c.ink, borderBottomWidth: 1, borderBottomColor: c.line, paddingVertical: 10 }}
              />
            </View>
            <View style={{ gap: 12 }}>
              <Label color={c.muted}>When would you like your ritual?</Label>
              <TimePicker value={time} onChange={setTime} />
            </View>
            <Btn
              title="Continue"
              onPress={() => {
                set({ name: name.trim(), ritualTime: time });
                setStep(2);
              }}
            />
          </FadeIn>
        )}

        {step === 2 && (
          <FadeIn key="2" style={{ gap: 26 }}>
            <Label>A gentle reminder</Label>
            <Heading size={36}>We'll let you know when it's time.</Heading>
            <Body muted>Once a day, at your ritual time. Nothing more.</Body>
            <View style={{ gap: 10 }}>
              <Btn
                title="Allow reminders"
                onPress={async () => {
                  const ok = await askPermission();
                  set({ reminders: ok });
                  setStep(3);
                }}
              />
              <Btn
                title="Not now"
                ghost
                onPress={() => {
                  set({ reminders: false });
                  setStep(3);
                }}
              />
            </View>
          </FadeIn>
        )}

        {step === 3 && (
          <FadeIn key="3" style={{ gap: 26 }}>
            <Label>Almost there</Label>
            <Heading size={36}>Do you own Edition 01?</Heading>
            <Body muted>The card inside your box lid has a code for 12 months of membership.</Body>
            <View style={{ gap: 10 }}>
              {Platform.OS === 'ios' && (
                <Btn
                  title="Redeem my code"
                  onPress={() => {
                    redeemCode();
                    finish();
                  }}
                />
              )}
              <Btn title="Continue without a code" ghost onPress={finish} />
            </View>
          </FadeIn>
        )}
      </Screen>
    </KeyboardAvoidingView>
  );
}
