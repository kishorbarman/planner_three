import { TimeOfDay } from '../types';
import { TIME_BOUNDARIES } from '../constants/config';

export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= TIME_BOUNDARIES.night || hour < TIME_BOUNDARIES.morning) return 'night';
  if (hour >= TIME_BOUNDARIES.evening) return 'evening';
  if (hour >= TIME_BOUNDARIES.midday) return 'midday';
  return 'morning';
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString + 'T12:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}
