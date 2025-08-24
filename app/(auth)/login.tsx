import { IUserInput } from '@/model/types/user';
import { sessionStorage } from '@/services/session-storage';
import { useUserStore } from '@/store/user.store';
import { IPayloadWithTokensResponse } from '@/types';
import { EMAIL_REGEX, PASSWORD_REGEX } from '@/utils/regex-patterns';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { apiInstance } from '../../lib/api.axios-instance';
import { LoginRequest } from '../../types/auth';

export default function LoginScreen() {
  const { setUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({ defaultValues: { email: '', phoneNumber: '', password: '' } });

  const onSubmit = async (data: LoginRequest) => {
    try {
      setIsLoading(true);
      const response = await apiInstance.post<IPayloadWithTokensResponse<Omit<IUserInput, 'password'>>>(
        '/auth/login',
        data
      );
      const { status, success, accessToken, refreshToken, payload } = response;

      if (success && status === 200) {
        setUser(payload);
        await sessionStorage.setAuth(accessToken, refreshToken); // Store tokens in secure storage
        return router.replace('/(tabs)');
      }
    } catch (error: any) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        return Alert.alert('Login Failed', error.response.data.message || 'An error occurred during login');
      } else if (error.request) {
        // The request was made but no response was received
        return Alert.alert('Login Failed', 'No response from server. Please check your network.');
      } else {
        // Something happened in setting up the request that triggered an Error
        return Alert.alert('Login Failed', error.message || 'An error occurred during login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue to Field Utility Tracker</Text>
        </View>

        <Card style={styles.card}>
          <Controller
            control={control}
            rules={{
              required: 'Email is required',
              pattern: {
                value: EMAIL_REGEX,
                message: 'Please enter a valid email address',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email"
                placeholder="Enter your email"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.email?.message}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            )}
            name="email"
          />

          <Controller
            control={control}
            rules={{
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
              pattern: {
                value: PASSWORD_REGEX,
                message: 'Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Password"
                placeholder="Enter your password"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.password?.message}
                isPassword
                autoComplete="password"
              />
            )}
            name="password"
          />

          <Link href="/forgot-password" style={styles.forgotPassword}>
            forgot password
          </Link>

          <Button title="Sign In" onPress={handleSubmit(onSubmit)} loading={isLoading} style={styles.loginButton} />
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Don&apos;t have an account?{' '}
            <Link href="/(auth)/register" style={styles.link}>
              Sign up
            </Link>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  card: {
    marginBottom: 24,
  },
  loginButton: {
    marginTop: 15,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#64748B',
  },
  link: {
    color: '#2563EB',
    fontWeight: '600',
  },
  forgotPassword: {
    padding: 'auto',
    textAlign: 'right',
    color: '#007bff',
    fontWeight: '600',
  },
});
