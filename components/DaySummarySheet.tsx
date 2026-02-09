import React from 'react';
import { StyleSheet, View, Text, Pressable, Modal, ScrollView } from 'react-native';
import { TEXT, GLASS } from '../constants/colors';
import { DaySummary } from '../types';
import { formatDate } from '../lib/date';

interface Props {
  summary: DaySummary | null;
  onClose: () => void;
}

export function DaySummarySheet({ summary, onClose }: Props) {
  if (!summary) return null;

  const completedCount = summary.tasks.filter(t => t.completed).length;

  return (
    <Modal
      visible={!!summary}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.overlayTop} onPress={onClose} />
        <View style={styles.sheet}>
          <ScrollView
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.date}>{formatDate(summary.date)}</Text>
                <Text style={styles.score}>
                  {completedCount}/{summary.tasks.length} completed
                </Text>
              </View>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeText}>Done</Text>
              </Pressable>
            </View>

            <View style={styles.taskList}>
              {summary.tasks.map(task => (
                <View key={task.id} style={styles.taskRow}>
                  <View style={[styles.checkbox, task.completed && styles.checked]}>
                    {task.completed && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={[styles.taskTitle, task.completed && styles.completedTitle]}>
                    {task.title}
                  </Text>
                </View>
              ))}
            </View>

            {summary.reflection ? (
              <View style={styles.reflectionBox}>
                <Text style={styles.reflectionLabel}>Reflection</Text>
                <Text style={styles.reflectionText}>{summary.reflection}</Text>
              </View>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayTop: {
    flex: 1,
  },
  sheet: {
    backgroundColor: 'rgba(30, 27, 75, 0.95)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: GLASS.border,
    padding: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  date: {
    color: TEXT.primary,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  score: {
    color: TEXT.secondary,
    fontSize: 14,
  },
  closeButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  closeText: {
    color: TEXT.secondary,
    fontSize: 16,
  },
  taskList: {
    marginBottom: 16,
  },
  taskRow: {
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
    backgroundColor: '#34D399',
    borderColor: '#34D399',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  taskTitle: {
    flex: 1,
    color: TEXT.primary,
    fontSize: 16,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: TEXT.secondary,
  },
  reflectionBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 14,
  },
  reflectionLabel: {
    color: TEXT.muted,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  reflectionText: {
    color: TEXT.secondary,
    fontSize: 14,
    lineHeight: 20,
  },
});
