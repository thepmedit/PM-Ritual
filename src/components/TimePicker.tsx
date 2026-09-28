import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useStore } from '../store';
import { fonts } from '../theme';

export const TIMES: string[] = (() => {
  const out: string[] = [];
  for (let m = 19 * 60; m <= 23 * 60 + 30; m += 30) out.push(Math.floor(m / 60) + ':' + String(m % 60).padStart(2, '0'));
  return out;
})();

export const fmtTime = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return ((h + 11) % 12) + 1 + ':' + String(m).padStart(2, '0') + (h < 12 ? 'am' : 'pm');
};

export function TimePicker({ value, onChange }: { value: string; onChange: (t: string) => void }) {
  const { c } = useStore();
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {TIMES.map((t) => {
        const on = t === value;
        return (
          <Pressable
            key={t}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            accessibilityLabel={fmtTime(t)}
            onPress={() => onChange(t)}
            style={{
              width: '18%',
              minWidth: 58,
              flexGrow: 1,
              paddingVertical: 10,
              alignItems: 'center',
              borderWidth: 1,
              borderRadius: 2,
              borderColor: on ? c.gold : c.line,
              backgroundColor: on ? c.goldSoft : 'transparent',
            }}
          >
            <Text style={{ fontFamily: on ? fonts.serifMedium : fonts.serif, fontSize: 17, color: on ? c.ink : c.muted }}>{fmtTime(t)}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
