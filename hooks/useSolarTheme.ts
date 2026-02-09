import { useState, useEffect } from 'react';
import { getTimeOfDay } from '../lib/date';
import { SOLAR_GRADIENTS } from '../constants/colors';
import { TimeOfDay } from '../types';

export function useSolarTheme() {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(getTimeOfDay());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOfDay(getTimeOfDay());
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  return {
    timeOfDay,
    gradientColors: SOLAR_GRADIENTS[timeOfDay],
  };
}
