import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSolarTheme } from '../hooks/useSolarTheme';

interface Props {
  children: React.ReactNode;
}

export function SolarBackground({ children }: Props) {
  const { gradientColors } = useSolarTheme();

  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.gradient}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
