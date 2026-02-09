import React from 'react';
import { StyleSheet, TextInput, View, Text } from 'react-native';
import { TEXT, GLASS } from '../constants/colors';
import { MAX_TASK_LENGTH } from '../constants/config';

interface Props {
  position: number;
  value: string;
  onChangeText: (text: string) => void;
  autoFocus?: boolean;
}

export function TaskInput({ position, value, onChangeText, autoFocus }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.number}>{position}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="What needs to happen today?"
        placeholderTextColor={TEXT.muted}
        maxLength={MAX_TASK_LENGTH}
        autoFocus={autoFocus}
        returnKeyType="next"
        selectionColor={TEXT.secondary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: GLASS.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GLASS.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  number: {
    color: TEXT.secondary,
    fontSize: 20,
    fontWeight: '700',
    marginRight: 14,
    width: 24,
    textAlign: 'center',
  },
  input: {
    flex: 1,
    color: TEXT.primary,
    fontSize: 16,
    padding: 0,
  },
});
