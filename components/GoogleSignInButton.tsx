import React from 'react';
import { StyleSheet, Pressable, Text, View } from 'react-native';

interface Props {
  onPress: () => void;
}

export function GoogleSignInButton({ onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.button}
      accessibilityRole="button"
      accessibilityLabel="Sign in with Google"
    >
      <View style={styles.inner}>
        <Text style={styles.googleLogo}>G</Text>
        <Text style={styles.text}>Sign in with Google</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  googleLogo: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
