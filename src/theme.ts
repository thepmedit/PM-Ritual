export type Palette = {
  night: string;
  surface: string;
  raise: string;
  ink: string;
  muted: string;
  faint: string;
  gold: string;
  goldInk: string;
  goldSoft: string;
  goldLine: string;
  line: string;
};

export const evening: Palette = {
  night: '#141211',
  surface: '#1D1A17',
  raise: '#26221E',
  ink: '#EFE7DA',
  muted: '#9D9285',
  faint: '#5F574E',
  gold: '#C9A45C',
  goldInk: '#17130E',
  goldSoft: 'rgba(201,164,92,0.16)',
  goldLine: 'rgba(201,164,92,0.35)',
  line: 'rgba(239,231,218,0.10)',
};

// Candlelight: ultra-dim warm red for use in a dark bedroom
export const candlelight: Palette = {
  night: '#080403',
  surface: '#110806',
  raise: '#180B08',
  ink: '#C2583F',
  muted: '#7E3A2A',
  faint: '#4F241A',
  gold: '#B04A2F',
  goldInk: '#0A0403',
  goldSoft: 'rgba(176,74,47,0.12)',
  goldLine: 'rgba(176,74,47,0.30)',
  line: 'rgba(194,88,63,0.14)',
};

export const fonts = {
  serif: 'CormorantGaramond_400Regular',
  serifItalic: 'CormorantGaramond_400Regular_Italic',
  serifMedium: 'CormorantGaramond_500Medium',
  sans: 'Montserrat_300Light',
  sansRegular: 'Montserrat_400Regular',
  sansMedium: 'Montserrat_500Medium',
};
