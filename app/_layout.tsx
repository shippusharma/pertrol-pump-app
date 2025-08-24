import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useUserStore } from '@/store/user.store';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

function AppLayout() {
  const { isLoggedIn } = useUserStore();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#000',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {!isLoggedIn() ? (
        // Auth stack
        <Stack.Screen name="(auth)" />
      ) : (
        // App stack
        <>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="notifications" />
          <Stack.Screen name="about" />
        </>
      )}
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <SafeAreaView style={styles.safeArea}>
      <SafeAreaProvider>
        <AppLayout />
        {/* <StatusBar style="auto" /> */}
        <StatusBar style="dark" translucent={false} backgroundColor="#fff" />
      </SafeAreaProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
});
