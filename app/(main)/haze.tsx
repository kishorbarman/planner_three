import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, FlatList, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SolarBackground } from '../../components/SolarBackground';
import { HazeItem } from '../../components/HazeItem';
import { useHaze } from '../../hooks/useHaze';
import { TEXT, GLASS } from '../../constants/colors';
import { MAX_HAZE_LENGTH } from '../../constants/config';
import { lightTap } from '../../lib/haptics';
import { HazeItem as HazeItemType } from '../../types';

export default function HazeScreen() {
  const { items, loading, addItem, archiveItem } = useHaze();
  const router = useRouter();
  const [newText, setNewText] = useState('');

  const handleAdd = async () => {
    const trimmed = newText.trim();
    if (!trimmed) return;
    lightTap();
    await addItem(trimmed);
    setNewText('');
  };

  const renderItem = ({ item }: { item: HazeItemType }) => (
    <HazeItem item={item} onArchive={archiveItem} />
  );

  return (
    <SolarBackground>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>The Haze</Text>
            <Pressable onPress={() => router.back()} style={styles.closeButton}>
              <Text style={styles.closeText}>Done</Text>
            </Pressable>
          </View>

          <Text style={styles.subtitle}>
            Everything floating in your mind. Pull from here when planning tomorrow.
          </Text>

          {/* Input */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={newText}
              onChangeText={setNewText}
              placeholder="Add something to the haze..."
              placeholderTextColor={TEXT.muted}
              maxLength={MAX_HAZE_LENGTH}
              returnKeyType="done"
              onSubmitEditing={handleAdd}
              selectionColor={TEXT.secondary}
            />
            <Pressable
              onPress={handleAdd}
              disabled={!newText.trim()}
              style={[styles.addButton, !newText.trim() && styles.addButtonDisabled]}
            >
              <Text style={styles.addButtonText}>+</Text>
            </Pressable>
          </View>

          {/* List */}
          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator color="#FFFFFF" />
            </View>
          ) : (
            <FlatList
              data={items}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.list}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  The haze is clear.{'\n'}Add thoughts, ideas, and tasks for later.
                </Text>
              }
            />
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SolarBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  title: {
    color: TEXT.primary,
    fontSize: 28,
    fontWeight: '300',
  },
  closeButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  closeText: {
    color: TEXT.secondary,
    fontSize: 16,
  },
  subtitle: {
    color: TEXT.secondary,
    fontSize: 14,
    paddingHorizontal: 24,
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 20,
  },
  inputRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 20,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: GLASS.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: GLASS.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: TEXT.primary,
    fontSize: 15,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    opacity: 0.4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '300',
  },
  list: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: TEXT.muted,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 60,
  },
});
