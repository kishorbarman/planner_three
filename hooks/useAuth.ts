import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import { supabase } from '../lib/supabase';

interface AuthState {
  session: Session | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  eraseAllData: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  session: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
  eraseAllData: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function useAuthProvider(): AuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      import('@react-native-google-signin/google-signin')
        .then(({ GoogleSignin }) => {
          GoogleSignin.configure({
            webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
          });
        })
        .catch(() => {
          // Keep app usable even if native Google config fails.
        });
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async () => {
    if (Platform.OS === 'web') {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      return;
    }

    const { GoogleSignin } = await import('@react-native-google-signin/google-signin');
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    const idToken = response.data?.idToken;
    if (!idToken) throw new Error('No ID token from Google Sign-In');

    const { error } = await supabase.auth.signInWithIdToken({ provider: 'google', token: idToken });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();

    if (Platform.OS !== 'web') {
      const { GoogleSignin } = await import('@react-native-google-signin/google-signin');
      await GoogleSignin.signOut();
    }
  }, []);

  const eraseAllData = useCallback(async () => {
    const userId = session?.user?.id;
    if (!userId) throw new Error('No authenticated user');

    const { error: hazeError } = await supabase
      .from('haze_items')
      .delete()
      .eq('user_id', userId);
    if (hazeError) throw hazeError;

    const { error: tasksError } = await supabase
      .from('tasks')
      .delete()
      .eq('user_id', userId);
    if (tasksError) throw tasksError;

    const { error: daysError } = await supabase
      .from('days')
      .delete()
      .eq('user_id', userId);
    if (daysError) throw daysError;

    await signOut();
  }, [session, signOut]);

  return { session, loading, signIn, signOut, eraseAllData };
}

export { AuthContext };
