import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

import { formatNumber } from './formatters';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const OIL_CHANGE_KM_INTERVAL = 10000;

async function ensureNotificationPermissions() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('maintenance', {
      name: 'Mantenimiento',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  if (existingStatus === 'granted') {
    return true;
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export function addOneYear(date) {
  const nextDate = new Date(date);
  nextDate.setFullYear(nextDate.getFullYear() + 1);
  return nextDate;
}

export function formatDate(date) {
  return date.toLocaleDateString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export async function scheduleOilChangeReminder({ autoName, dueDate }) {
  const canNotify = await ensureNotificationPermissions();

  if (!canNotify) {
    return null;
  }

  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Cambio de aceite pendiente',
      body: `Recuerda cambiar el aceite de ${autoName}.`,
      data: { type: 'oil-change' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: dueDate,
      channelId: 'maintenance',
    },
  });
}

export async function cancelOilChangeReminder(notificationId) {
  if (!notificationId) {
    return;
  }

  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

export async function notifyOilChangeByKm({ autoName, currentKm, dueKm }) {
  const canNotify = await ensureNotificationPermissions();

  if (!canNotify) {
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Cambio de aceite por kilometraje',
      body: `${autoName} llegó a ${formatNumber(
        currentKm
      )} km. Revisa el aceite, objetivo ${formatNumber(dueKm)} km.`,
      data: { type: 'oil-change-km' },
    },
    trigger: null,
  });
}
