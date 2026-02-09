import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, Pressable, Modal, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SolarBackground } from '../../components/SolarBackground';
import { useAuth } from '../../hooks/useAuth';
import { TEXT, GLASS, ACCENT } from '../../constants/colors';

export default function ProfileScreen() {
  const { session, signOut, eraseAllData } = useAuth();
  const router = useRouter();
  const [eraseModalVisible, setEraseModalVisible] = useState(false);
  const [eraseInput, setEraseInput] = useState('');
  const [erasing, setErasing] = useState(false);

  const email = session?.user?.email ?? '';
  const avatarUrl = session?.user?.user_metadata?.avatar_url;
  const initial = email.charAt(0).toUpperCase();

  const handleErase = async () => {
    setErasing(true);
    try {
      await eraseAllData();
    } catch {
      setErasing(false);
    }
  };

  return (
    <SolarBackground>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <Text style={styles.closeText}>Done</Text>
          </Pressable>
        </View>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarInitial}>{initial}</Text>
            </View>
          )}
          <Text style={styles.email}>{email}</Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable onPress={signOut} style={styles.actionButton}>
            <Text style={styles.actionText}>Log Out</Text>
          </Pressable>
        </View>

        <View style={styles.spacer} />

        {/* Destructive — pinned to bottom */}
        <View style={styles.eraseSection}>
          <Pressable
            onPress={() => setEraseModalVisible(true)}
            style={styles.eraseButton}
          >
            <Text style={styles.eraseText}>Erase All Data</Text>
          </Pressable>
        </View>

        {/* Erase Confirmation Modal */}
        <Modal
          visible={eraseModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setEraseModalVisible(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setEraseModalVisible(false)}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
              <Pressable style={styles.modalContent} onPress={() => {}}>
                <Text style={styles.modalTitle}>Erase All Data</Text>
                <Text style={styles.modalMessage}>
                  This will permanently erase all your data including tasks, reflections, and backlog items. Type ERASE to confirm.
                </Text>
                <TextInput
                  style={styles.modalInput}
                  value={eraseInput}
                  onChangeText={setEraseInput}
                  placeholder="Type ERASE"
                  placeholderTextColor={TEXT.muted}
                  autoCapitalize="characters"
                  autoFocus
                  selectionColor={TEXT.secondary}
                />
                <View style={styles.modalActions}>
                  <Pressable
                    onPress={() => {
                      setEraseModalVisible(false);
                      setEraseInput('');
                    }}
                    style={styles.modalButton}
                  >
                    <Text style={styles.modalButtonCancel}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleErase}
                    style={styles.modalButton}
                    disabled={eraseInput !== 'ERASE' || erasing}
                  >
                    {erasing ? (
                      <ActivityIndicator size="small" color={ACCENT.error} />
                    ) : (
                      <Text style={[
                        styles.modalButtonConfirm,
                        eraseInput !== 'ERASE' && styles.modalButtonDisabled,
                      ]}>
                        Erase
                      </Text>
                    )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
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
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  avatarFallback: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: GLASS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarInitial: {
    color: TEXT.primary,
    fontSize: 32,
    fontWeight: '300',
  },
  email: {
    color: TEXT.secondary,
    fontSize: 16,
  },
  actions: {
    paddingHorizontal: 24,
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    backgroundColor: GLASS.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GLASS.border,
    paddingVertical: 16,
    alignItems: 'center',
  },
  actionText: {
    color: TEXT.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  spacer: {
    flex: 1,
  },
  eraseSection: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  eraseButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  eraseText: {
    color: ACCENT.error,
    fontSize: 13,
    opacity: 0.7,
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
    marginBottom: 12,
  },
  modalMessage: {
    color: TEXT.secondary,
    fontSize: 14,
    lineHeight: 20,
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
  modalButtonConfirm: {
    color: ACCENT.error,
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonDisabled: {
    opacity: 0.3,
  },
});
