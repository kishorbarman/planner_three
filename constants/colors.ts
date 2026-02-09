import { TimeOfDay } from '../types';

export const SOLAR_GRADIENTS: Record<TimeOfDay, [string, string, string]> = {
  morning: ['#4A90D9', '#C8A96E', '#D4A853'],
  midday: ['#D4A853', '#CC8E3A', '#D98B2B'],
  evening: ['#CC8E3A', '#A855F7', '#4C1D95'],
  night: ['#1E1B4B', '#312E81', '#1E1B4B'],
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
