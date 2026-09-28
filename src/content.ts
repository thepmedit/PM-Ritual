// All the words in the app live here, so they're easy to edit in one place.

export type Quote = { text: string; author: string };
export type ScriptLine = [number, string]; // [fraction of session 0–1, line]
export type Session = {
  id: string;
  title: string;
  subtitle: string;
  membersOnly: boolean;
  unlockAtNights?: number;
  isMonthly?: boolean;
  audio5?: string; // URL of a recorded 5-minute version (optional)
  audio10?: string; // URL of a recorded 10-minute version (optional)
  script: ScriptLine[]; // shown on screen (and used until recordings exist)
};

export const QUOTES: Quote[] = [
  { text: 'Close the day gently. It has given you enough.', author: 'The PM Edit' },
  { text: 'Sleep is the golden chain that ties health and our bodies together.', author: 'Thomas Dekker' },
  { text: 'Finish each day and be done with it.', author: 'Ralph Waldo Emerson' },
  { text: 'Rest is not idleness.', author: 'John Lubbock' },
  { text: 'Nature does not hurry, yet everything is accomplished.', author: 'Lao Tzu' },
  { text: 'What you carried today can be set down tonight.', author: 'The PM Edit' },
  { text: "O sleep, O gentle sleep, Nature's soft nurse.", author: 'William Shakespeare' },
  { text: 'The quiet hour is where tomorrow is made.', author: 'The PM Edit' },
  { text: 'You do not have to earn your rest.', author: 'The PM Edit' },
  { text: 'Softness is a strength you practise nightly.', author: 'The PM Edit' },
  { text: 'Let the last thought of the day be a kind one.', author: 'The PM Edit' },
  { text: 'Tonight, choose yourself first.', author: 'The PM Edit' },
  { text: 'Every ending is an invitation to begin again, restored.', author: 'The PM Edit' },
  { text: 'Slow breath, slow mind, slow night.', author: 'The PM Edit' },
  { text: 'Gratitude first. Breath second. Sleep third.', author: 'The nightly edit' },
  { text: 'The day was full. Now let the night be empty.', author: 'The PM Edit' },
  { text: 'Stillness is not the absence of life. It is where life returns.', author: 'The PM Edit' },
  { text: 'Be as gentle with yourself as you would be with someone you love.', author: 'The PM Edit' },
  { text: 'Nothing more is needed from you today.', author: 'The PM Edit' },
  { text: 'Silk, scent and stillness. The rest will follow.', author: 'The PM Edit' },
  { text: 'A calm evening is the first gift of a good morning.', author: 'The PM Edit' },
];

export const GOODNIGHTS = [
  'You chose yourself tonight. That is never a small thing.',
  'The day is finished, and you finished it gently.',
  'Everything you needed to do today is done. Let it be enough.',
  'You gave your evening the care it deserves. Tomorrow will feel it.',
  'Rest now. You have earned nothing less.',
  'Another night kept. Another tomorrow restored.',
  'Softly now. The world can wait until morning.',
];

export const REMINDERS = [
  'Your ritual awaits.',
  'The day is almost done. Time to close it gently.',
  'Silk, scent and stillness are waiting for you.',
  'Ten quiet minutes, just for you.',
];

export const MILESTONES: { n: number; title: string; reward: string }[] = [
  { n: 1, title: 'Your first night', reward: 'The ritual begins.' },
  { n: 7, title: 'One week kept', reward: 'Unlocks Silk and stillness, free to keep.' },
  { n: 30, title: 'A month of rest', reward: 'A handwritten note from Brooke, and 15% off your next refill.' },
  { n: 100, title: 'One hundred nights', reward: 'A gift from us to you, sent to your door.' },
];

export const MONTHS: Record<number, [string, string]> = {
  8: ['September: Spring evenings', 'Longer light, open windows, a softer kind of tired.'],
  9: ['October: Spring evenings', 'Longer light, open windows, a softer kind of tired.'],
  10: ['November: The warm night', 'Staying cool and unhurried as the nights warm up.'],
  11: ['December: The quiet between', 'A slower evening in the busiest month of the year.'],
};
export function thisMonth(d = new Date()): [string, string] {
  return MONTHS[d.getMonth()] || ['This month: The slow evening', 'A fresh wind-down, released each month.'];
}

export type StepKey = 'oil' | 'spray' | 'pillow' | 'gratitude' | 'breath' | 'mask';
export const STEPS: { key: StepKey; title: string; how?: string; why?: string }[] = [
  {
    key: 'oil',
    title: 'Pulse point oil',
    how: 'Roll Deep Sleep onto your wrists, the sides of your neck and behind your ears. Press your wrists together, then cup your hands to your face and take three slow breaths.',
    why: 'Scent is the fastest way to tell your body the day is done.',
  },
  {
    key: 'spray',
    title: 'Pillow spray',
    how: "Hold the bottle an arm's length from your pillow and mist two or three times. Let it settle for a moment before you lie down.",
    why: 'The same scent, every night, becomes your cue for sleep.',
  },
  {
    key: 'pillow',
    title: 'Silk pillowcase',
    how: 'Smooth your silk pillowcase with both hands. Turn down the lights and lie back. Notice how cool it feels against your skin.',
    why: 'Less friction for skin and hair. A little luxury to end on.',
  },
  { key: 'gratitude', title: 'Three moments' },
  { key: 'breath', title: 'Slow breath', how: 'In for four, out for six. Five rounds.' },
  {
    key: 'mask',
    title: 'Silk eye mask',
    how: 'Slip on your eye mask and let your eyes rest in the dark. Choose guided rest or a sleep sound, or simply let go.',
    why: "Darkness tells your body it's time for sleep.",
  },
];

export const SESSIONS: Session[] = [
  {
    id: 'finish',
    title: 'Let the day finish',
    subtitle: 'A gentle full-body settle',
    membersOnly: false,
    script: [
      [0, 'Settle into your bed. Let your body grow heavy.'],
      [0.05, 'Close your eyes, or let them rest behind your silk.'],
      [0.1, 'Breathe in slowly through your nose.'],
      [0.15, 'And let it fall away through your mouth. Longer on the way out.'],
      [0.21, 'Notice the weight of your head on the pillow.'],
      [0.27, 'Soften your jaw. Let your tongue rest.'],
      [0.33, 'Let your shoulders drop away from your ears.'],
      [0.4, 'Feel the rise and fall of your chest. There is nothing to change.'],
      [0.47, 'If a thought arrives, let it pass like a light across the ceiling.'],
      [0.54, 'Bring to mind one moment from today you would keep.'],
      [0.61, 'Hold it gently. Let it warm you.'],
      [0.68, 'Now let it go. The day is finished.'],
      [0.75, 'Your hands are heavy. Your legs are heavy.'],
      [0.82, 'There is nothing left to do tonight.'],
      [0.9, 'Rest now. Tomorrow will be here when you are ready.'],
      [0.97, 'Goodnight.'],
    ],
  },
  {
    id: 'silk',
    title: 'Silk and stillness',
    subtitle: 'A slow body scan · unlocks at 7 nights',
    membersOnly: true,
    unlockAtNights: 7,
    script: [
      [0, 'Lie back and feel the cool of silk beneath you.'],
      [0.06, 'Take one long breath, and let the next ones find their own pace.'],
      [0.12, 'Bring your attention to your feet. Let them soften.'],
      [0.19, 'Your calves and knees. Heavy, and warm.'],
      [0.26, 'Your hips sink a little further into the bed.'],
      [0.33, 'Your stomach rises and falls on its own.'],
      [0.4, 'Your chest. Your shoulders. Loose and unhurried.'],
      [0.48, 'Your arms, all the way down to your fingertips.'],
      [0.56, 'Your throat, your jaw, the small muscles around your eyes.'],
      [0.64, 'Your whole body, resting at once.'],
      [0.72, 'If anything holds on, breathe into it and let it go.'],
      [0.8, 'There is nowhere else to be.'],
      [0.88, 'Stay here, in the stillness, as long as you like.'],
      [0.97, 'Goodnight.'],
    ],
  },
  {
    id: 'setdown',
    title: 'Setting down the day',
    subtitle: 'For a busy mind',
    membersOnly: true,
    script: [
      [0, "Before sleep, let's set some things down."],
      [0.06, 'Breathe in for four. Out for six.'],
      [0.13, 'Picture a small table beside your bed.'],
      [0.2, 'Whatever is still on your mind, place it there. It will wait for you.'],
      [0.28, 'The unanswered message. Set it down.'],
      [0.35, "Tomorrow's list. Set it down."],
      [0.42, 'Anything that went differently than you hoped. Set it down.'],
      [0.5, 'Your hands are empty now. Notice how light they feel.'],
      [0.58, 'Breathe in for four. Out for six.'],
      [0.66, 'Nothing on that table needs you tonight.'],
      [0.74, 'Let your breath slow, and your thoughts slow with it.'],
      [0.82, 'Everything you set down will still be there in the morning, and so will you, restored.'],
      [0.92, 'Rest now.'],
      [0.98, 'Goodnight.'],
    ],
  },
  {
    id: 'month',
    title: thisMonth()[0],
    subtitle: "This month's ritual",
    membersOnly: true,
    isMonthly: true,
    script: [
      [0, 'Tonight the window is open a little, and the air is soft.'],
      [0.07, 'Breathe it in. Spring evenings smell of cut grass and warm stone.'],
      [0.15, 'Let the light that lingered today settle into your body.'],
      [0.23, 'Longer days can leave us wired. Let the extra light go.'],
      [0.31, 'Soften your forehead. Soften the space between your eyes.'],
      [0.39, 'Hear the quiet outside. A car far away. Leaves moving.'],
      [0.47, "Each sound arrives and leaves. You don't need to follow it."],
      [0.55, 'Breathe in for four. Out for six.'],
      [0.63, 'The season is changing, and so are you. Gently.'],
      [0.72, 'Let your body take the shape of the bed.'],
      [0.81, 'Nothing else is asked of you tonight.'],
      [0.91, 'Rest now, in the soft air.'],
      [0.98, 'Goodnight.'],
    ],
  },
];

export type SoundKey = 'rain' | 'hush' | 'ocean' | 'hum';
export const SOUNDS: { key: SoundKey; title: string; subtitle: string; membersOnly: boolean }[] = [
  { key: 'rain', title: 'Rain', subtitle: 'Steady rain on a window', membersOnly: false },
  { key: 'hush', title: 'Deep hush', subtitle: 'Warm brown noise', membersOnly: false },
  { key: 'ocean', title: 'Ocean', subtitle: 'Slow waves, far off', membersOnly: true },
  { key: 'hum', title: 'Night hum', subtitle: 'A low, soft drone', membersOnly: true },
];
