import React from 'react';
import { StyleSheet, Pressable, Text } from 'react-native';
import { heavyTap } from '../lib/haptics';

interface Props {
  onCommit: () => void;
  disabled?: boolean;
}

export function CommitButton({ onCommit, disabled }: Props) {
  const handlePress = () => {
    if (!disabled) {
      heavyTap();
      onCommit();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={[styles.button, disabled && styles.disabled]}
      accessibilityRole="button"
      accessibilityLabel="Commit tasks for today"
    >
      <Text style={[styles.text, disabled && styles.disabledText]}>
        COMMIT FOR TODAY
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 24,
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
  },
  disabledText: {
    opacity: 0.6,
  },
});
