import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { TEXT, GLASS } from '../constants/colors';
import { lightTap } from '../lib/haptics';
import { HazeItem as HazeItemType } from '../types';

interface Props {
  item: HazeItemType;
  onArchive: (id: string) => void;
}

export function HazeItem({ item, onArchive }: Props) {
  const handleArchive = () => {
    lightTap();
    onArchive(item.id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{item.text}</Text>
      <Pressable
        onPress={handleArchive}
        style={styles.archiveButton}
        accessibilityRole="button"
        accessibilityLabel={`Archive: ${item.text}`}
      >
        <Text style={styles.archiveText}>×</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: GLASS.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: GLASS.border,
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 14,
    marginBottom: 10,
  },
  text: {
    flex: 1,
    color: TEXT.primary,
    fontSize: 15,
  },
  archiveButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  archiveText: {
    color: TEXT.secondary,
    fontSize: 22,
    fontWeight: '300',
  },
});
