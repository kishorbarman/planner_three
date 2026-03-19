import { TimeOfDay } from '../types';

export const SOLAR_GRADIENTS: Record<TimeOfDay, [string, string, string]> = {
  morning: ['#B8D4F0', '#F0D8C8', '#F0C8A0'],
  midday: ['#7BBCE8', '#A8D4C8', '#E8D4A0'],
  evening: ['#E8B870', '#D87890', '#906898'],
  night: ['#384878', '#506090', '#384878'],
};

export const GLASS = {
  background: 'rgba(255, 255, 255, 0.15)',
  border: 'rgba(255, 255, 255, 0.3)',
  blurIntensity: 40,
  borderRadius: 20,
};

export const TEXT = {
  primary: '#FFFFFF',
  secondary: 'rgba(255, 255, 255, 0.7)',
  muted: 'rgba(255, 255, 255, 0.4)',
};

export const ACCENT = {
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
};
