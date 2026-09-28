// One gentle audio engine for sleep sounds and the tone under guided rest.
import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from 'expo-audio';
import { SoundKey } from './content';

const FILES: Record<SoundKey, any> = {
  rain: require('../assets/sounds/rain.m4a'),
  hush: require('../assets/sounds/hush.m4a'),
  ocean: require('../assets/sounds/ocean.m4a'),
  hum: require('../assets/sounds/hum.m4a'),
};

let modeSet = false;
async function ensureMode() {
  if (modeSet) return;
  try {
    await setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: true } as any);
    modeSet = true;
  } catch {}
}

type Track = { player: AudioPlayer; fadeTimer?: any };
const tracks: Record<string, Track> = {};

function fade(t: Track, to: number, seconds: number, done?: () => void) {
  clearInterval(t.fadeTimer);
  const from = t.player.volume ?? 0;
  const steps = Math.max(1, Math.round(seconds * 20));
  let i = 0;
  t.fadeTimer = setInterval(() => {
    i++;
    try {
      t.player.volume = from + (to - from) * (i / steps);
    } catch {}
    if (i >= steps) {
      clearInterval(t.fadeTimer);
      done?.();
    }
  }, 50);
}

// channel: 'ambient' (sleep sounds / tone) or 'voice' (recorded meditation)
export async function play(
  channel: string,
  source: SoundKey | string,
  opts: { volume: number; loop: boolean; fadeIn?: number; title?: string }
) {
  await ensureMode();
  stop(channel, 0.3);
  const src = typeof source === 'string' && source.startsWith('http') ? { uri: source } : FILES[source as SoundKey];
  const player = createAudioPlayer(src);
  player.loop = opts.loop;
  player.volume = 0;
  const t: Track = { player };
  tracks[channel] = t;
  try {
    (player as any).setActiveForLockScreen?.(true, { title: opts.title || 'The PM Ritual', artist: 'The PM Edit' });
  } catch {}
  player.play();
  fade(t, opts.volume, opts.fadeIn ?? 2.5);
  return player;
}

export function setVolume(channel: string, v: number) {
  const t = tracks[channel];
  if (t) fade(t, v, 0.2);
}

export function pause(channel: string, paused: boolean, volume: number) {
  const t = tracks[channel];
  if (!t) return;
  if (paused) fade(t, 0, 1, () => t.player.pause());
  else {
    t.player.play();
    fade(t, volume, 1.2);
  }
}

export function stop(channel: string, seconds = 0.8) {
  const t = tracks[channel];
  if (!t) return;
  delete tracks[channel];
  fade(t, 0, seconds, () => {
    try {
      t.player.pause();
      t.player.remove();
    } catch {}
  });
}

export function stopAll(seconds = 0.8) {
  Object.keys(tracks).forEach((k) => stop(k, seconds));
}

export function isPlaying(channel: string) {
  return !!tracks[channel];
}
