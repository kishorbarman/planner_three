import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, View, Text, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { TEXT, GLASS } from '../constants/colors';
import { REFLECTION_PROMPTS } from '../constants/config';
import { mediumTap } from '../lib/haptics';

interface Props {
  initialValue: string;
  onSave: (text: string) => void;
  onFinalize: (text: string) => void;
}

function getRandomPrompt(): string {
  return REFLECTION_PROMPTS[Math.floor(Math.random() * REFLECTION_PROMPTS.length)];
}

export function ReflectionPrompt({ initialValue, onSave, onFinalize }: Props) {
  const [text, setText] = useState(initialValue);
  const [prompt] = useState(getRandomPrompt);

  useEffect(() => {
    if (text !== initialValue && text.length > 0) {
      const timer = setTimeout(() => onSave(text), 1000);
      return () => clearTimeout(timer);
    }
  }, [text]);

  const handleFinalize = () => {
    mediumTap();
    onFinalize(text);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.wrapper}
    >
      <Text style={styles.prompt}>{prompt}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Write your reflection..."
          placeholderTextColor={TEXT.muted}
          multiline
          textAlignVertical="top"
          selectionColor={TEXT.secondary}
          autoFocus
        />
      </View>
      <Pressable
        onPress={handleFinalize}
        style={styles.button}
        accessibilityRole="button"
        accessibilityLabel="Finalize day"
      >
        <Text style={styles.buttonText}>FINALIZE DAY</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  prompt: {
    color: TEXT.secondary,
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: GLASS.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GLASS.border,
    padding: 16,
    marginBottom: 20,
    minHeight: 160,
  },
  input: {
    flex: 1,
    color: TEXT.primary,
    fontSize: 16,
    lineHeight: 24,
    padding: 0,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
  },
});
