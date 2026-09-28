import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, KeyboardAvoidingView, Platform, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { dayKey, useStore } from '../src/store';
import { STEPS } from '../src/content';
import { Body, Btn, FadeIn, Heading, Label, Screen, TextLink, Why } from '../src/components/ui';
import { StepGlyph } from '../src/components/glyphs';
import { fonts } from '../src/theme';

const PLACEHOLDERS = ['The first sip of coffee in the sun', 'A message from someone I love', 'Finishing what I started'];

export default function Ritual() {
  const { c, s, set, completeRitual } = useStore();
  const [i, setI] = useState(0);
  const [writeHere, setWriteHere] = useState(false);
  const step = STEPS[i];
  const today = dayKey();
  const items = s.draft.date === today ? s.draft.items : ['', '', ''];

  const next = () => {
    setWriteHere(false);
    setI((x) => Math.min(x + 1, STEPS.length - 1));
  };
  const back = () => {
    setWriteHere(false);
    setI((x) => Math.max(0, x - 1));
  };
  const finish = (to: 'rest' | 'sounds' | 'goodnight') => {
    completeRitual();
    if (to === 'goodnight') router.replace('/goodnight');
    else router.replace(to === 'rest' ? '/(tabs)/rest' : '/(tabs)/sounds');
  };
  const setItem = (k: number, v: string) => {
    const nextItems = [...items];
    nextItems[k] = v;
    set({ draft: { date: today, items: nextItems } });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: c.night }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen header={false}>
        {/* progress + close */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, paddingBottom: 16 }}>
          <View style={{ flexDirection: 'row', gap: 6 }} accessibilityLabel={`Step ${i + 1} of ${STEPS.length}`}>
            {STEPS.map((_, k) => (
              <View key={k} style={{ width: 18, height: 2, backgroundColor: k <= i ? c.gold : c.line }} />
            ))}
          </View>
          <TextLink title="Close" onPress={() => router.back()} />
        </View>

        <FadeIn key={i + (writeHere ? 'w' : '')} style={{ flex: 1, gap: 18, paddingTop: 14 }}>
          <Label>{`Step ${i + 1} of ${STEPS.length}`}</Label>
          <Heading size={36}>{step.title}</Heading>

          {step.key === 'gratitude' ? (
            writeHere ? (
              <View style={{ gap: 18 }}>
                <Body>Write your three moments here instead.</Body>
                {[0, 1, 2].map((k) => (
                  <View key={k} style={{ gap: 4 }}>
                    <Label color={c.muted}>{`Moment ${k + 1}`}</Label>
                    <TextInput
                      value={items[k]}
                      onChangeText={(v) => setItem(k, v)}
                      placeholder={PLACEHOLDERS[k]}
                      placeholderTextColor={c.faint}
                      maxLength={140}
                      autoFocus={k === 0}
                      style={{ fontFamily: fonts.serif, fontSize: 20, color: c.ink, borderBottomWidth: 1, borderBottomColor: c.line, paddingVertical: 10 }}
                    />
                  </View>
                ))}
              </View>
            ) : (
              <>
                <View style={{ alignItems: 'center', paddingVertical: 10 }}>
                  <StepGlyph k="pen" color={c.gold} />
                </View>
                <Body>Open your PM Guide to tonight's page. Write three moments from today worth keeping. Small is perfect.</Body>
                <Why>Pen to paper slows the mind in a way a screen never can.</Why>
              </>
            )
          ) : step.key === 'breath' ? (
            <Breath onDone={() => {}} key="breath" next={next} />
          ) : (
            <>
              <View style={{ alignItems: 'center', paddingVertical: 10 }}>
                <StepGlyph k={step.key} color={c.gold} />
              </View>
              <Body>{step.how}</Body>
              {!!step.why && <Why>{step.why}</Why>}
            </>
          )}
        </FadeIn>

        {/* buttons */}
        <View style={{ gap: 10, paddingTop: 24 }}>
          {step.key === 'gratitude' &&
            (writeHere ? (
              <Btn title="Keep these moments" onPress={next} />
            ) : (
              <>
                <Btn title="I've written in my PM Guide" onPress={next} />
                <Btn title="No guide with me? Write here" ghost onPress={() => setWriteHere(true)} />
              </>
            ))}
          {step.key === 'mask' && (
            <>
              <Btn title="Guided rest" onPress={() => finish('rest')} />
              <Btn title="Sleep sounds" ghost onPress={() => finish('sounds')} />
              <Btn title="Goodnight" ghost onPress={() => finish('goodnight')} />
            </>
          )}
          {!['gratitude', 'breath', 'mask'].includes(step.key) && <Btn title={i === 0 ? 'Done, next step' : 'Next step'} onPress={next} />}
          {i > 0 && <TextLink title="Back" onPress={back} style={{ alignSelf: 'center' }} />}
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}

/* ---------- the breathing circle ---------- */
function Breath({ next }: { next: () => void; onDone: () => void }) {
  const { c } = useStore();
  const scale = useRef(new Animated.Value(0.55)).current;
  const fadeTxt = useRef(new Animated.Value(1)).current;
  const [phase, setPhase] = useState<'ready' | 'in' | 'out' | 'done'>('ready');
  const [count, setCount] = useState(0);
  const [reduce, setReduce] = useState(false);
  const timers = useRef<any[]>([]);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduce).catch(() => {});
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const later = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, ms));

  const run = (round: number, inhale: boolean) => {
    const secs = inhale ? 4 : 6;
    setPhase(inhale ? 'in' : 'out');
    setCount(secs);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (!reduce) {
      Animated.timing(scale, { toValue: inhale ? 1 : 0.55, duration: secs * 1000, easing: Easing.bezier(0.45, 0, 0.4, 1), useNativeDriver: true }).start();
    } else {
      fadeTxt.setValue(0);
      Animated.timing(fadeTxt, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    }
    for (let t = 1; t < secs; t++) later(() => setCount(secs - t), t * 1000);
    later(() => {
      if (inhale) run(round, false);
      else if (round < 4) run(round + 1, true);
      else {
        setPhase('done');
        Animated.timing(scale, { toValue: 0.7, duration: 1200, useNativeDriver: true }).start();
      }
    }, secs * 1000);
  };

  const word = phase === 'ready' ? 'Ready' : phase === 'in' ? 'Breathe in' : phase === 'out' ? 'Breathe out' : 'Beautifully done';
  const sub = phase === 'ready' ? '5 ROUNDS' : phase === 'done' ? '5 ROUNDS KEPT' : String(count);

  return (
    <View style={{ gap: 18 }}>
      <Body>In for four, out for six. Five rounds.</Body>
      <View style={{ height: 260, alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View
          style={{
            position: 'absolute',
            width: 210,
            height: 210,
            borderRadius: 105,
            borderWidth: 1,
            borderColor: c.goldLine,
            backgroundColor: c.goldSoft,
            transform: [{ scale }],
            shadowColor: c.gold,
            shadowOpacity: 0.45,
            shadowRadius: 40,
            shadowOffset: { width: 0, height: 0 },
          }}
        />
        <Animated.View style={{ alignItems: 'center', opacity: fadeTxt }} accessibilityLiveRegion="polite">
          <Text style={{ fontFamily: 'CormorantGaramond_400Regular', fontSize: 26, color: c.ink }}>{word}</Text>
          <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: 11, letterSpacing: 2, color: c.muted }}>{sub}</Text>
        </Animated.View>
      </View>
      {phase === 'ready' && (
        <View style={{ gap: 10 }}>
          <Btn title="Begin breathing" onPress={() => run(0, true)} />
          <Btn title="Skip" ghost onPress={next} />
        </View>
      )}
      {phase === 'done' && <Btn title="Next step" onPress={next} />}
    </View>
  );
}
