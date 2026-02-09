import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, ActivityIndicator, AppState, KeyboardAvoidingView, Platform, ScrollView, Alert, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { SolarBackground } from '../../components/SolarBackground';
import { TaskInput } from '../../components/TaskInput';
import { TaskCard } from '../../components/TaskCard';
import { CommitButton } from '../../components/CommitButton';
import { ReflectionPrompt } from '../../components/ReflectionPrompt';
import { useDay } from '../../hooks/useDay';
import { useAuth } from '../../hooks/useAuth';
import { formatDate, getTodayString } from '../../lib/date';
import { TEXT, GLASS } from '../../constants/colors';
import { Day, Task } from '../../types';

function DoneMode({ tasks, day, onToggleTask, onSaveReflection, onLongPressTask, onEditTask }: {
  tasks: Task[];
  day: Day | null;
  onToggleTask: (id: string) => void;
  onSaveReflection: (text: string) => void;
  onLongPressTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
}) {
  const [editingReflection, setEditingReflection] = useState(false);
  const [reflectionText, setReflectionText] = useState(day?.reflection ?? '');

  const handleSaveReflection = () => {
    onSaveReflection(reflectionText);
    setEditingReflection(false);
  };

  return (
    <View style={styles.doneContainer}>
      <Text style={styles.doneTitle}>Today's 3s</Text>
      <Text style={styles.doneScore}>
        {tasks.filter(t => t.completed).length}/{tasks.length} completed
      </Text>
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} onToggle={onToggleTask} onLongPress={onLongPressTask} onEdit={onEditTask} />
      ))}
      <View style={styles.doneReflection}>
        <View style={styles.reflectionHeader}>
          <Text style={styles.doneReflectionLabel}>Your reflection</Text>
          <Pressable onPress={() => {
            if (editingReflection) {
              handleSaveReflection();
            } else {
              setEditingReflection(true);
            }
          }}>
            <Text style={styles.editButton}>{editingReflection ? 'Save' : 'Edit'}</Text>
          </Pressable>
        </View>
        {editingReflection ? (
          <TextInput
            style={styles.reflectionInput}
            value={reflectionText}
            onChangeText={setReflectionText}
            multiline
            textAlignVertical="top"
            autoFocus
            selectionColor={TEXT.secondary}
          />
        ) : (
          <Text style={styles.doneReflectionText}>
            {day?.reflection || 'No reflection yet. Tap Edit to add one.'}
          </Text>
        )}
      </View>
    </View>
  );
}

export default function DailyPlannerScreen() {
  const { session } = useAuth();
  const { day, tasks, mode, loading, commitTasks, toggleTaskComplete, editTask, resetTask, beginReflection, saveReflection, finalizeDay, refetch } = useDay();
  const router = useRouter();

  const avatarUrl = session?.user?.user_metadata?.avatar_url;
  const email = session?.user?.email ?? '';
  const avatarInitial = email.charAt(0).toUpperCase();

  const [inputs, setInputs] = useState(['', '', '']);
  const allFilled = inputs.every(t => t.trim().length > 0);

  // Edit modal state
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editText, setEditText] = useState('');

  // Refetch when screen gains focus
  useFocusEffect(useCallback(() => {
    refetch();
  }, [refetch]));

  // Re-check on app foreground for midnight rollover
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        refetch();
      }
    });
    return () => subscription.remove();
  }, [refetch]);

  const handleInputChange = (index: number, text: string) => {
    setInputs(prev => {
      const next = [...prev];
      next[index] = text;
      return next;
    });
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setEditText(task.title);
    setEditModalVisible(true);
  };

  const handleTaskLongPress = (task: Task) => {
    Alert.alert(task.title || 'Empty task', undefined, [
      {
        text: 'Edit',
        onPress: () => openEditModal(task),
      },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => resetTask(task.id),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleEditSave = () => {
    if (editingTask && editText.trim()) {
      editTask(editingTask.id, editText.trim());
    }
    setEditModalVisible(false);
    setEditingTask(null);
  };

  const handleCommit = async () => {
    try {
      await commitTasks(inputs.map(t => t.trim()));
    } catch {
      // Error handled silently
    }
  };

  if (loading) {
    return (
      <SolarBackground>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      </SolarBackground>
    );
  }

  return (
    <SolarBackground>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.date}>{formatDate(getTodayString())}</Text>
          <View style={styles.headerActions}>
            <Pressable
              onPress={() => router.push('/(main)/history')}
              style={styles.headerButton}
              accessibilityLabel="View history"
            >
              <Text style={styles.headerButtonText}>History</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push('/(main)/profile')}
              accessibilityLabel="Open profile"
            >
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.headerAvatar} />
              ) : (
                <View style={styles.headerAvatarFallback}>
                  <Text style={styles.headerAvatarInitial}>{avatarInitial}</Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
          {/* AM Mode */}
          {mode === 'am' && (
            <>
              <Text style={styles.modeTitle}>What are your three?</Text>
              {[0, 1, 2].map(i => (
                <TaskInput
                  key={i}
                  position={i + 1}
                  value={inputs[i]}
                  onChangeText={(text) => handleInputChange(i, text)}
                  autoFocus={i === 0}
                />
              ))}
              <CommitButton onCommit={handleCommit} disabled={!allFilled} />
            </>
          )}

          {/* Day Mode */}
          {mode === 'day' && (
            <>
              <Text style={styles.modeTitle}>Today's Three</Text>
              {tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={toggleTaskComplete}
                  onLongPress={handleTaskLongPress}
                  onEdit={openEditModal}
                />
              ))}
              <Pressable onPress={beginReflection} style={styles.reflectButton}>
                <Text style={styles.reflectButtonText}>BEGIN REFLECTION</Text>
              </Pressable>
            </>
          )}

          {/* PM Mode */}
          {mode === 'pm' && (
            <>
              <Text style={styles.modeTitle}>Reflect on Today</Text>
              <ReflectionPrompt
                initialValue={day?.reflection ?? ''}
                onSave={saveReflection}
                onFinalize={finalizeDay}
              />
            </>
          )}

          {/* Done Mode */}
          {mode === 'done' && (
            <DoneMode
              tasks={tasks}
              day={day}
              onToggleTask={toggleTaskComplete}
              onSaveReflection={saveReflection}
              onLongPressTask={handleTaskLongPress}
              onEditTask={openEditModal}
            />
          )}
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Haze FAB — visible in Day and AM modes */}
        {(mode === 'am' || mode === 'day') && (
          <Pressable
            onPress={() => router.push('/(main)/haze')}
            style={styles.fab}
            accessibilityLabel="Open The Haze backlog"
          >
            <Text style={styles.fabText}>☁</Text>
          </Pressable>
        )}

        {/* Edit Task Modal */}
        <Modal
          visible={editModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setEditModalVisible(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setEditModalVisible(false)}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
              <Pressable style={styles.modalContent} onPress={() => {}}>
                <Text style={styles.modalTitle}>Edit Task</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editText}
                  onChangeText={setEditText}
                  autoFocus
                  selectionColor={TEXT.secondary}
                  placeholderTextColor={TEXT.muted}
                />
                <View style={styles.modalActions}>
                  <Pressable onPress={() => setEditModalVisible(false)} style={styles.modalButton}>
                    <Text style={styles.modalButtonCancel}>Cancel</Text>
                  </Pressable>
                  <Pressable onPress={handleEditSave} style={styles.modalButton}>
                    <Text style={styles.modalButtonSave}>Save</Text>
                  </Pressable>
                </View>
              </Pressable>
            </KeyboardAvoidingView>
          </Pressable>
        </Modal>
      </SafeAreaView>
    </SolarBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  date: {
    color: TEXT.secondary,
    fontSize: 14,
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  headerButtonText: {
    color: TEXT.secondary,
    fontSize: 14,
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  headerAvatarFallback: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: GLASS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarInitial: {
    color: TEXT.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scrollContent: {
    flexGrow: 1,
  },
  modeTitle: {
    color: TEXT.primary,
    fontSize: 28,
    fontWeight: '300',
    marginBottom: 28,
  },
  reflectButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 24,
  },
  reflectButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
  },
  doneContainer: {
    flex: 1,
  },
  doneTitle: {
    color: TEXT.primary,
    fontSize: 28,
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 8,
  },
  doneScore: {
    color: TEXT.secondary,
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  doneReflection: {
    marginTop: 16,
    backgroundColor: GLASS.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GLASS.border,
    padding: 16,
  },
  reflectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  doneReflectionLabel: {
    color: TEXT.muted,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  editButton: {
    color: TEXT.secondary,
    fontSize: 14,
  },
  reflectionInput: {
    color: TEXT.primary,
    fontSize: 14,
    lineHeight: 20,
    minHeight: 80,
    padding: 0,
  },
  doneReflectionText: {
    color: TEXT.secondary,
    fontSize: 14,
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 40,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: {
    fontSize: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  modalContent: {
    backgroundColor: 'rgba(30, 27, 75, 0.95)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GLASS.border,
    padding: 20,
  },
  modalTitle: {
    color: TEXT.primary,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  modalInput: {
    color: TEXT.primary,
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  modalButtonCancel: {
    color: TEXT.secondary,
    fontSize: 16,
  },
  modalButtonSave: {
    color: '#34D399',
    fontSize: 16,
    fontWeight: '600',
  },
});
