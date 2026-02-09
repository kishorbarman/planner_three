import React from 'react';
import { StyleSheet, Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { TEXT, GLASS, ACCENT } from '../constants/colors';
import { lightTap, successNotification } from '../lib/haptics';
import { Task } from '../types';

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onLongPress?: (task: Task) => void;
  onEdit?: (task: Task) => void;
}

export function TaskCard({ task, onToggle, onLongPress, onEdit }: Props) {
  const isEmpty = task.title === '';

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isEmpty ? 0.4 : task.completed ? 0.6 : 1, { duration: 300 }),
  }));

  const handlePress = () => {
    if (isEmpty) {
      onEdit?.(task);
      return;
    }
    if (task.completed) {
      lightTap();
    } else {
      successNotification();
    }
    onToggle(task.id);
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        onLongPress={() => onLongPress?.(task)}
        delayLongPress={500}
        style={styles.container}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.completed }}
        accessibilityLabel={isEmpty ? `Task ${task.position}: empty` : `Task ${task.position}: ${task.title}`}
      >
        <View style={[styles.checkbox, task.completed && styles.checked]}>
          {task.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={[styles.title, isEmpty ? styles.emptyTitle : task.completed && styles.completedTitle]}>
          {isEmpty ? 'Empty task' : task.title}
        </Text>
      </Pressable>
    </Animated.View>
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
    paddingVertical: 18,
    marginBottom: 12,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: TEXT.secondary,
    marginRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: ACCENT.success,
    borderColor: ACCENT.success,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  title: {
    flex: 1,
    color: TEXT.primary,
    fontSize: 16,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: TEXT.secondary,
  },
  emptyTitle: {
    color: TEXT.muted,
    fontStyle: 'italic',
  },
});
