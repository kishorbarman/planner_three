import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
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
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    console.log('Google Sign-In response:', JSON.stringify(response, null, 2));
    const idToken = response.data?.idToken;
    if (!idToken) throw new Error('No ID token from Google Sign-In');

    const { error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    await GoogleSignin.signOut();
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
