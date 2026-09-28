import React, { useEffect } from 'react';
import { AppState as RNAppState } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import {
  CormorantGaramond_400Regular,
  CormorantGaramond_400Regular_Italic,
  CormorantGaramond_500Medium,
} from '@expo-google-fonts/cormorant-garamond';
import { Montserrat_300Light, Montserrat_400Regular, Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import { StoreProvider, useStore } from '../src/store';
import { ToastProvider } from '../src/components/ui';
import { scheduleReminders } from '../src/notifications';

SplashScreen.preventAutoHideAsync().catch(() => {});

function Inner() {
  const { ready, c, s, keptToday } = useStore();

  // keep bedtime reminders up to date
  useEffect(() => {
    if (!ready || !s.onboarded) return;
    const run = () => scheduleReminders({ enabled: s.reminders, time: s.ritualTime, keptToday });
    run();
    const sub = RNAppState.addEventListener('change', (st) => st === 'active' && run());
    return () => sub.remove();
  }, [ready, s.onboarded, s.reminders, s.ritualTime, keptToday]);

  if (!ready) return null;
  return (
    <ToastProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.night }, animation: 'fade' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="ritual" options={{ gestureEnabled: false }} />
        <Stack.Screen name="player/[id]" />
        <Stack.Screen name="paywall" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="goodnight" options={{ gestureEnabled: false }} />
      </Stack>
    </ToastProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    CormorantGaramond_400Regular,
    CormorantGaramond_400Regular_Italic,
    CormorantGaramond_500Medium,
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
  });
  useEffect(() => {
    if (loaded) SplashScreen.hideAsync().catch(() => {});
  }, [loaded]);
  if (!loaded) return null;
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <Inner />
      </StoreProvider>
    </SafeAreaProvider>
  );
}
