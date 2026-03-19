import React, { useState } from 'react';
import { StyleSheet, View, Text, Alert, Platform, Pressable } from 'react-native';
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

  React.useEffect(() => {
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

  if (Platform.OS === 'web') {
    return (
      <SolarBackground>
        <SafeAreaView style={styles.container}>
          <View style={styles.hero}>
            <Text style={styles.wordmark}>Three</Text>
            <Text style={styles.tagline}>Three tasks. One day.{'\n'}That's all you need.</Text>
            <Text style={styles.description}>
              Most days get lost to long lists and scattered focus.
              Three gives you a simple ritual — pick your three most important tasks each morning,
              work through them, reflect at the end.
              Nothing else.
            </Text>
          </View>

          <View style={styles.features}>
            <FeatureRow label="AM" text="Choose your three tasks for the day" />
            <FeatureRow label="Day" text="Track progress, stay focused" />
            <FeatureRow label="PM" text="Reflect on what you accomplished" />
          </View>

          <View style={styles.bottom}>
            <Pressable
              onPress={handleSignIn}
              style={({ pressed }) => [styles.signInButton, pressed && styles.signInButtonPressed]}
              accessibilityRole="button"
              accessibilityLabel="Log in to start planning"
            >
              <Text style={styles.googleG}>G</Text>
              <Text style={styles.signInText}>
                {signingIn ? 'Signing in…' : 'Log in to start planning'}
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </SolarBackground>
    );
  }

  return (
    <SolarBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.nativeContent}>
          <Text style={styles.wordmark}>Three</Text>
          <Text style={styles.subtitle}>
            Three tasks. One day.{'\n'}That's all you need.
          </Text>
        </View>
        <View style={styles.nativeBottom}>
          <GoogleSignInButton onPress={handleSignIn} />
        </View>
      </SafeAreaView>
    </SolarBackground>
  );
}

function FeatureRow({ label, text }: { label: string; text: string }) {
  return (
    <View style={styles.featureRow}>
      <Text style={styles.featureLabel}>{label}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
  },
  // Web
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  wordmark: {
    color: TEXT.primary,
    fontSize: 64,
    fontWeight: '200',
    letterSpacing: 10,
    marginBottom: 20,
  },
  tagline: {
    color: TEXT.primary,
    fontSize: 22,
    fontWeight: '300',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 28,
  },
  description: {
    color: TEXT.secondary,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 420,
  },
  features: {
    gap: 16,
    paddingVertical: 32,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  featureLabel: {
    color: TEXT.primary,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    width: 32,
    textAlign: 'center',
    opacity: 0.6,
  },
  featureText: {
    color: TEXT.secondary,
    fontSize: 15,
    flex: 1,
  },
  bottom: {
    paddingBottom: 48,
    alignItems: 'center',
  },
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 16,
    paddingHorizontal: 28,
    width: '100%',
    maxWidth: 360,
    justifyContent: 'center',
  },
  signInButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  googleG: {
    color: TEXT.primary,
    fontSize: 20,
    fontWeight: '700',
  },
  signInText: {
    color: TEXT.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  // Native
  nativeContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    color: TEXT.secondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  nativeBottom: {
    paddingBottom: 40,
  },
});
