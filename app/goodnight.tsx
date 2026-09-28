import React from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { pickByDay, useStore } from '../src/store';
import { GOODNIGHTS } from '../src/content';
import { Btn, FadeIn, Heading, Label, Screen } from '../src/components/ui';
import { fonts } from '../src/theme';

export default function Goodnight() {
  const { c, s } = useStore();
  const n = s.nightsKept;
  return (
    <Screen header={false} contentStyle={{ justifyContent: 'center' }}>
      <FadeIn duration={1500} style={{ alignItems: 'center', gap: 18, paddingVertical: 60 }}>
        <Label>{n < 1 ? 'Ritual kept' : n === 1 ? 'Your first night kept' : `${n} nights kept`}</Label>
        <Text style={{ fontFamily: fonts.serifItalic, fontSize: 23, lineHeight: 31, color: c.ink, textAlign: 'center', maxWidth: 320, marginVertical: 8 }}>
          {pickByDay(GOODNIGHTS)}
        </Text>
        <Heading size={42} italic center>
          {'Goodnight' + (s.name ? ', ' + s.name : '')}
        </Heading>
        <Text style={{ fontFamily: fonts.sans, fontSize: 13, color: c.muted, textAlign: 'center' }}>Sleep well. We'll be here tomorrow evening.</Text>
      </FadeIn>
      <View style={{ marginTop: 'auto' }}>
        <Btn title="Return" ghost onPress={() => router.replace('/(tabs)/tonight')} />
      </View>
    </Screen>
  );
}
