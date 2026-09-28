import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { fonts } from '../theme';
import { useStore } from '../store';
import { CandleIcon } from './glyphs';

/* ---------- text ---------- */
export function Label({ children, style, color }: { children: React.ReactNode; style?: StyleProp<TextStyle>; color?: string }) {
  const { c } = useStore();
  return (
    <Text style={[{ fontFamily: fonts.sansRegular, fontSize: 10.5, letterSpacing: 2.5, textTransform: 'uppercase', color: color || c.gold }, style]}>
      {children}
    </Text>
  );
}

export function Heading({ children, size = 30, italic, style, center }: { children: React.ReactNode; size?: number; italic?: boolean; style?: StyleProp<TextStyle>; center?: boolean }) {
  const { c } = useStore();
  return (
    <Text
      style={[
        { fontFamily: italic ? fonts.serifItalic : fonts.serif, fontSize: size, lineHeight: size * 1.18, color: c.ink, textAlign: center ? 'center' : 'left' },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export function Body({ children, muted, size = 15, style, center }: { children: React.ReactNode; muted?: boolean; size?: number; style?: StyleProp<TextStyle>; center?: boolean }) {
  const { c } = useStore();
  return (
    <Text style={[{ fontFamily: fonts.sans, fontSize: size, lineHeight: size * 1.6, color: muted ? c.muted : c.ink, textAlign: center ? 'center' : 'left' }, style]}>
      {children}
    </Text>
  );
}

export function Why({ children, style, center }: { children: React.ReactNode; style?: StyleProp<TextStyle>; center?: boolean }) {
  const { c } = useStore();
  return <Text style={[{ fontFamily: fonts.serifItalic, fontSize: 18, lineHeight: 26, color: c.muted, textAlign: center ? 'center' : 'left' }, style]}>{children}</Text>;
}

/* ---------- controls ---------- */
export function Btn({ title, onPress, ghost, style, small, disabled }: { title: string; onPress: () => void; ghost?: boolean; style?: StyleProp<ViewStyle>; small?: boolean; disabled?: boolean }) {
  const { c } = useStore();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      disabled={disabled}
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      style={({ pressed }) => [
        {
          minHeight: small ? 40 : 50,
          paddingHorizontal: small ? 14 : 22,
          borderRadius: 2,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: ghost ? 'transparent' : c.gold,
          borderWidth: ghost ? StyleSheet.hairlineWidth * 2 : 0,
          borderColor: c.line,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      <Text style={{ fontFamily: fonts.sansMedium, fontSize: small ? 10 : 11.5, letterSpacing: 2.4, textTransform: 'uppercase', color: ghost ? c.ink : c.goldInk }}>{title}</Text>
    </Pressable>
  );
}

export function TextLink({ title, onPress, style }: { title: string; onPress: () => void; style?: StyleProp<ViewStyle> }) {
  const { c } = useStore();
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[{ paddingVertical: 8 }, style]} hitSlop={8}>
      <Text style={{ fontFamily: fonts.sansRegular, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: c.muted }}>{title}</Text>
    </Pressable>
  );
}

export function Card({ children, style, glow, onPress }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; glow?: boolean; onPress?: () => void }) {
  const { c } = useStore();
  const base: ViewStyle = {
    padding: 20,
    gap: 12,
    backgroundColor: glow ? c.goldSoft : c.surface,
    borderWidth: 1,
    borderColor: glow ? c.goldLine : c.line,
    borderRadius: 3,
  };
  if (onPress)
    return (
      <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [base, { opacity: pressed ? 0.85 : 1 }, style]}>
        {children}
      </Pressable>
    );
  return <View style={[base, style]}>{children}</View>;
}

export function Pill({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  const { c } = useStore();
  return (
    <View style={{ borderWidth: 1, borderColor: muted ? c.line : c.goldLine, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 }}>
      <Text style={{ fontFamily: fonts.sansRegular, fontSize: 9.5, letterSpacing: 2, textTransform: 'uppercase', color: muted ? c.muted : c.gold }}>{children}</Text>
    </View>
  );
}

export function Seg<T extends string | number>({ options, value, onChange }: { options: { label: string; value: T }[]; value: T; onChange: (v: T) => void }) {
  const { c } = useStore();
  return (
    <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: c.line, borderRadius: 2, overflow: 'hidden' }}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable
            key={String(o.value)}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            onPress={() => onChange(o.value)}
            style={{ flex: 1, paddingVertical: 12, alignItems: 'center', backgroundColor: on ? c.raise : 'transparent' }}
          >
            <Text style={{ fontFamily: fonts.sansRegular, fontSize: 10.5, letterSpacing: 1.8, textTransform: 'uppercase', color: on ? c.ink : c.muted }}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Divider() {
  const { c } = useStore();
  return <View style={{ height: 1, backgroundColor: c.line }} />;
}

/* ---------- header + screen ---------- */
export function Header() {
  const { c, s, set } = useStore();
  const date = new Date().toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 6, paddingBottom: 20 }}>
      <Text style={{ fontFamily: fonts.serifMedium, fontSize: 13, letterSpacing: 5.5, color: c.ink }}>THE PM EDIT</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <Text style={{ fontFamily: fonts.sansRegular, fontSize: 10.5, letterSpacing: 1.5, color: c.muted }}>{date}</Text>
        <Pressable
          accessibilityRole="switch"
          accessibilityLabel="Candlelight mode"
          accessibilityState={{ checked: s.candle }}
          onPress={() => {
            Haptics.selectionAsync().catch(() => {});
            set({ candle: !s.candle });
          }}
          style={{ width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: s.candle ? c.goldLine : c.line, alignItems: 'center', justifyContent: 'center' }}
        >
          <CandleIcon color={s.candle ? c.gold : c.muted} />
        </Pressable>
      </View>
    </View>
  );
}

export function Screen({ children, scroll = true, header = true, contentStyle }: { children: React.ReactNode; scroll?: boolean; header?: boolean; contentStyle?: StyleProp<ViewStyle> }) {
  const { c } = useStore();
  const inner = (
    <View style={[{ paddingHorizontal: 20, paddingBottom: 40, flexGrow: 1 }, contentStyle]}>
      {header && <Header />}
      {children}
    </View>
  );
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.night }}>
      {scroll ? (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {inner}
        </ScrollView>
      ) : (
        inner
      )}
    </SafeAreaView>
  );
}

/* ---------- fade-in wrapper ---------- */
export function FadeIn({ children, duration = 600, style }: { children: React.ReactNode; duration?: number; style?: StyleProp<ViewStyle> }) {
  const o = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(o, { toValue: 1, duration, useNativeDriver: true }).start();
  }, []);
  return <Animated.View style={[{ opacity: o }, style]}>{children}</Animated.View>;
}

/* ---------- toast ---------- */
const ToastCtx = createContext<(msg: string) => void>(() => {});
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { c } = useStore();
  const [msg, setMsg] = useState('');
  const o = useRef(new Animated.Value(0)).current;
  const timer = useRef<any>(null);
  const show = useCallback((m: string) => {
    setMsg(m);
    clearTimeout(timer.current);
    Animated.timing(o, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    timer.current = setTimeout(() => Animated.timing(o, { toValue: 0, duration: 400, useNativeDriver: true }).start(), 2400);
  }, []);
  return (
    <ToastCtx.Provider value={show}>
      {children}
      <Animated.View
        pointerEvents="none"
        style={{ position: 'absolute', left: 20, right: 20, bottom: 110, alignItems: 'center', opacity: o }}
        accessibilityLiveRegion="polite"
      >
        <View style={{ backgroundColor: c.raise, borderColor: c.goldLine, borderWidth: 1, borderRadius: 2, paddingHorizontal: 18, paddingVertical: 12 }}>
          <Text style={{ fontFamily: fonts.sans, fontSize: 13, color: c.ink }}>{msg}</Text>
        </View>
      </Animated.View>
    </ToastCtx.Provider>
  );
}
export const useToast = () => useContext(ToastCtx);
