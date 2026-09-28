// Bedtime reminders: we schedule the next 14 nights individually, so we can
// skip tonight if the ritual is already done and rotate the wording.
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { REMINDERS } from './content';
import { dayIndex } from './store';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function askPermission(): Promise<boolean> {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('ritual', {
        name: 'Bedtime reminder',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
    const cur = await Notifications.getPermissionsAsync();
    if (cur.granted) return true;
    const req = await Notifications.requestPermissionsAsync();
    return req.granted;
  } catch {
    return false;
  }
}

export async function scheduleReminders(opts: { enabled: boolean; time: string; keptToday: boolean }) {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    if (!opts.enabled) return;
    const perm = await Notifications.getPermissionsAsync();
    if (!perm.granted) return;
    const [h, m] = opts.time.split(':').map(Number);
    const now = new Date();
    for (let i = 0; i < 14; i++) {
      const at = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, h, m, 0);
      if (at <= now) continue;
      if (i === 0 && opts.keptToday) continue;
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'The PM Ritual',
          body: REMINDERS[((dayIndex(at) % REMINDERS.length) + REMINDERS.length) % REMINDERS.length],
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: at,
          channelId: Platform.OS === 'android' ? 'ritual' : undefined,
        } as any,
      });
    }
  } catch {}
}
