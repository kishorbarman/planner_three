import React from 'react';
import { StyleSheet, View, Platform, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { GLASS } from '../constants/colors';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function GlassCard({ children, style }: Props) {
  if (Platform.OS === 'android') {
    return (
      <View style={[styles.fallback, style]}>
        {children}
      </View>
    );
  }

  return (
    <BlurView intensity={GLASS.blurIntensity} style={[styles.blur, style]}>
      <View style={styles.inner}>
        {children}
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  blur: {
    borderRadius: GLASS.borderRadius,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: GLASS.border,
  },
  inner: {
    padding: 20,
  },
  fallback: {
    backgroundColor: GLASS.background,
    borderRadius: GLASS.borderRadius,
    borderWidth: 1,
    borderColor: GLASS.border,
    padding: 20,
  },
});
