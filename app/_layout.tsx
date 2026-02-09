import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthContext, useAuthProvider } from '../hooks/useAuth';

export default function RootLayout() {
  const auth = useAuthProvider();

  return (
    <AuthContext.Provider value={auth}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(main)" />
      </Stack>
    </AuthContext.Provider>
  );
}
