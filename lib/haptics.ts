import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

function runHaptic(action: () => Promise<void>) {
  if (Platform.OS === 'web') return;
  action().catch(() => {
    // Ignore unsupported-device haptic failures.
  });
}

export function lightTap() {
  runHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
}

export function mediumTap() {
  runHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));
}

export function heavyTap() {
  runHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy));
}

export function successNotification() {
  runHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
}

export function errorNotification() {
  runHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
}
