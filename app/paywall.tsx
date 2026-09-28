import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Platform, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import Constants from 'expo-constants';
import { useStore } from '../src/store';
import { buy, getPlans, Plan, purchasesReady, redeemCode, restore } from '../src/purchases';
import { Body, Btn, Card, Heading, Label, Screen, TextLink, useToast } from '../src/components/ui';
import { fonts } from '../src/theme';

const PERKS = [
  'The complete guided rest library, voiced by Brooke',
  'A new ritual every month, released like a drop',
  'Every sleep sound, with a fade-out timer',
  'Milestone gifts at 30 and 100 nights',
];

export default function Paywall() {
  const { c, isMember } = useStore();
  const toast = useToast();
  const extra: any = Constants.expoConfig?.extra || {};
  const [plans, setPlans] = useState<Plan[] | null>(null);
  const [sel, setSel] = useState<'year' | 'month'>('year');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getPlans().then(setPlans);
  }, []);
  useEffect(() => {
    if (isMember) {
      toast('Welcome. Your membership has begun.');
      router.back();
    }
  }, [isMember]);

  const chosen = plans?.find((p) => p.id === sel);
  const close = () => (router.canGoBack() ? router.back() : router.replace('/(tabs)/tonight'));

  const purchase = async () => {
    if (!chosen) return;
    setBusy(true);
    const r = await buy(chosen.pkg);
    setBusy(false);
    if (r === 'failed') toast("Something interrupted your purchase. You haven't been charged. Please try again.");
  };

  const PlanCard = ({ id, tag, price, note }: { id: 'year' | 'month'; tag: string; price: string; note: string }) => {
    const on = sel === id;
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: on }}
        onPress={() => setSel(id)}
        style={{ flex: 1, padding: 16, gap: 4, borderRadius: 3, borderWidth: 1, borderColor: on ? c.gold : c.line, backgroundColor: on ? c.goldSoft : c.surface }}
      >
        <Label style={{ fontSize: 10 }}>{tag}</Label>
        <Text style={{ fontFamily: fonts.serif, fontSize: 28, color: c.ink }}>{price}</Text>
        <Body muted size={12}>
          {note}
        </Body>
      </Pressable>
    );
  };

  const year = plans?.find((p) => p.id === 'year');
  const month = plans?.find((p) => p.id === 'month');

  return (
    <Screen header={false}>
      <View style={{ gap: 22, paddingTop: 14 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Label>Membership</Label>
          <TextLink title="Not now" onPress={close} />
        </View>
        <Heading size={34}>The PM Ritual, in full</Heading>
        <View style={{ gap: 10 }}>
          {PERKS.map((p) => (
            <View key={p} style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
              <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: c.gold, marginTop: 9 }} />
              <Body size={14} style={{ flex: 1 }}>
                {p}
              </Body>
            </View>
          ))}
        </View>

        {plans === null ? (
          <ActivityIndicator color={c.gold} />
        ) : plans.length ? (
          <>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {year && <PlanCard id="year" tag="Best value" price={year.price} note="per year, after a 7-day free trial" />}
              {month && <PlanCard id="month" tag="Monthly" price={month.price} note="per month, cancel any time" />}
            </View>
            <Btn title={busy ? 'One moment' : sel === 'year' ? 'Start 7-day free trial' : 'Start monthly membership'} onPress={purchase} disabled={busy} />
          </>
        ) : (
          <Card>
            <Body>Membership opens with Edition 01. We'll let you know the moment it's ready.</Body>
          </Card>
        )}

        {Platform.OS === 'ios' && purchasesReady() && (
          <Card>
            <Label>Own Edition 01?</Label>
            <Body muted size={13.5}>
              Your box includes 12 months of membership. Redeem the code printed on the card inside your lid.
            </Body>
            <Btn title="Redeem my code" ghost onPress={() => redeemCode()} />
          </Card>
        )}

        <Body muted size={11} style={{ lineHeight: 17 }}>
          Payment is charged to your Apple ID at confirmation of purchase. Membership renews automatically unless cancelled at least 24 hours before the end of the current
          period. Manage or cancel any time in your App Store account settings.
        </Body>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 18 }}>
          <TextLink
            title="Restore purchases"
            onPress={async () => {
              const ok = await restore();
              if (!ok) toast('No membership found for this Apple ID.');
            }}
          />
          <TextLink title="Terms of use" onPress={() => Linking.openURL(extra.termsUrl)} />
          <TextLink title="Privacy policy" onPress={() => Linking.openURL(extra.privacyUrl)} />
        </View>
      </View>
    </Screen>
  );
}
