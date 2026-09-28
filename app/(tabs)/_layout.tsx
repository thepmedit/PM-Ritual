import React from 'react';
import { Tabs } from 'expo-router';
import { useStore } from '../../src/store';
import { fonts } from '../../src/theme';

export default function TabsLayout() {
  const { c } = useStore();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarIcon: () => null,
        tabBarIconStyle: { display: 'none' },
        tabBarActiveTintColor: c.gold,
        tabBarInactiveTintColor: c.muted,
        tabBarStyle: { backgroundColor: c.night, borderTopColor: c.line, borderTopWidth: 1, height: 64, paddingTop: 10 },
        tabBarLabelStyle: { fontFamily: fonts.sansRegular, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' },
        sceneStyle: { backgroundColor: c.night },
      }}
    >
      <Tabs.Screen name="tonight" options={{ title: 'Tonight' }} />
      <Tabs.Screen name="rest" options={{ title: 'Rest' }} />
      <Tabs.Screen name="sounds" options={{ title: 'Sounds' }} />
      <Tabs.Screen name="me" options={{ title: 'Me' }} />
    </Tabs>
  );
}
