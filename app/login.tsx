import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SolarBackground } from '../components/SolarBackground';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import { useAuth } from '../hooks/useAuth';
import { TEXT } from '../constants/colors';

export default function LoginScreen() {
  const { signIn, session } = useAuth();
  const router = useRouter();
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    if (session) {
      router.replace('/(main)');
    }
  }, [session]);

  const handleSignIn = async () => {
    if (signingIn) return;
    setSigningIn(true);
    try {
      await signIn();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Sign in failed';
      Alert.alert('Sign In Error', message);
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <SolarBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Three</Text>
          <Text style={styles.subtitle}>
            Three tasks. One day.{'\n'}That's all you need.
          </Text>
        </View>
        <View style={styles.bottom}>
          <GoogleSignInButton onPress={handleSignIn} />
        </View>
      </SafeAreaView>
    </SolarBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  title: {
    color: TEXT.primary,
    fontSize: 56,
    fontWeight: '200',
    letterSpacing: 8,
    marginBottom: 16,
  },
  subtitle: {
    color: TEXT.secondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  bottom: {
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
});
