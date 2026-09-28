import React from 'react';
import Svg, { Circle, G, Line, Path, Rect } from 'react-native-svg';
import { StepKey } from '../content';

export function CandleIcon({ color, size = 15 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth={1.2}>
      <Path d="M8 1.5c1.6 2 2.2 3.2 2.2 4.3A2.2 2.2 0 0 1 8 8a2.2 2.2 0 0 1-2.2-2.2c0-1.1.6-2.3 2.2-4.3z" />
      <Rect x={5.5} y={9.5} width={5} height={5.5} rx={0.5} />
    </Svg>
  );
}

export function StepGlyph({ k, color, size = 140 }: { k: StepKey | 'pen'; color: string; size?: number }) {
  const p = { width: size, height: size, viewBox: '0 0 150 150', fill: 'none', stroke: color, strokeWidth: 1.2 } as const;
  switch (k) {
    case 'oil':
      return (
        <Svg {...p}>
          <Rect x={58} y={52} width={34} height={78} rx={4} />
          <Rect x={63} y={30} width={24} height={22} rx={2} />
          <Line x1={58} y1={80} x2={92} y2={80} />
          <Circle cx={75} cy={104} r={7} />
        </Svg>
      );
    case 'spray':
      return (
        <Svg {...p}>
          <Rect x={30} y={62} width={40} height={68} rx={4} />
          <Rect x={38} y={44} width={24} height={18} rx={2} />
          <Path d="M62 50h12" />
          <G fill={color} stroke="none" opacity={0.8}>
            <Circle cx={92} cy={44} r={1.6} />
            <Circle cx={104} cy={38} r={1.3} />
            <Circle cx={102} cy={52} r={1.3} />
            <Circle cx={116} cy={44} r={1.1} />
            <Circle cx={114} cy={30} r={1} />
            <Circle cx={118} cy={58} r={1} />
          </G>
        </Svg>
      );
    case 'pillow':
      return (
        <Svg {...p}>
          <Path d="M22 58c16-10 90-10 106 0 6 12 6 28 0 40-16 10-90 10-106 0-6-12-6-28 0-40z" />
          <Path d="M40 72c20 6 50 6 70 0" opacity={0.6} />
        </Svg>
      );
    case 'mask':
      return (
        <Svg {...p}>
          <Path d="M20 72c0-14 22-22 55-22s55 8 55 22-18 26-36 26c-10 0-13-10-19-10s-9 10-19 10c-18 0-36-12-36-26z" />
          <Path d="M20 72c-8 0-12-2-14-4M130 72c8 0 12-2 14-4" opacity={0.6} />
        </Svg>
      );
    default:
      return (
        <Svg {...p}>
          <Rect x={36} y={28} width={78} height={96} rx={2} />
          <Line x1={50} y1={54} x2={100} y2={54} />
          <Line x1={50} y1={74} x2={100} y2={74} />
          <Line x1={50} y1={94} x2={84} y2={94} />
        </Svg>
      );
  }
}
