import 'react-native-url-polyfill/auto';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { Session } from '@supabase/supabase-js';
import { supabase } from './src/config/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';

import HeaderBar from './src/components/HeaderBar';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import VerifyEmailScreen from './src/screens/VerifyEmailScreen';
import AppNavigator from './src/navigation/AppNavigator';

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  VerifyEmail: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);

  useEffect(() => {
    // 🔹 Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUserEmail(session?.user?.email);
      setLoading(false);
    });

    // 🔹 Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUserEmail(session?.user?.email);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          setSession(null); // 🔹 This will re-render to show Login stack
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <NavigationContainer>
        {session && session.user ? (
          <>
            {/* 🔹 HeaderBar is now shown globally for all logged-in screens */}
            <HeaderBar email={userEmail} onLogout={handleLogout} />
            <AppNavigator />
          </>
        ) : (
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#E5E7EB' },
            }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E5E7EB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
  },
});
