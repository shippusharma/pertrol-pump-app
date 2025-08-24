import { apiInstance } from '@/lib/api.axios-instance';
import { IUserInput } from '@/model/types/user';
import { sessionStorage } from '@/services/session-storage';
import { useUserStore } from '@/store/user.store';
import { IPayloadWithTokensResponse } from '@/types';
import { ERoleType } from '@/types/enums';
import { EMAIL_REGEX, PASSWORD_REGEX, PHONE_REGEX } from '@/utils/regex-patterns';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { RegisterRequest } from '../../types/auth';

export default function RegisterScreen() {
  const { setUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterRequest>({
    defaultValues: { name: '', email: '', phoneNumber: '', password: '', confirmPassword: '' },
  });
  const password = watch('password'); // Watch password field to validate confirmPassword

  const onSubmit = async (data: RegisterRequest) => {
    const { confirmPassword, ...registerData } = data;
    try {
      setIsLoading(true);
      const response = await apiInstance.post<IPayloadWithTokensResponse<Omit<IUserInput, 'password'>>>(
        '/auth/register',
        { ...registerData, role: ERoleType.USER }
      );
      const { status, success, accessToken, refreshToken, payload } = response;
      if (success && status === 201) {
        setUser(payload);
        await sessionStorage.setAuth(accessToken, refreshToken); // Store tokens in secure storage
        return router.replace('/(tabs)');
      }
    } catch (error: any) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        return Alert.alert(
          'Registration Failed',
          error.response.data.message || 'An error occurred during registration'
        );
      } else if (error.request) {
        // The request was made but no response was received
        return Alert.alert('Registration Failed', 'No response from server. Please check your network.');
      } else {
        // Something happened in setting up the request that triggered an Error
        return Alert.alert('Registration Failed', error.message || 'An error occurred during registration');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Field Utility Tracker today</Text>
        </View>

        <Card style={styles.card}>
          <Controller
            control={control}
            rules={{
              required: 'Name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.name?.message}
                autoComplete="name"
              />
            )}
            name="name"
          />

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
              required: 'Phone number is required',
              pattern: {
                value: PHONE_REGEX,
                message: 'Please enter a valid phone number',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Phone Number"
                placeholder="Enter your phone number"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.phoneNumber?.message}
                keyboardType="phone-pad"
                autoComplete="tel"
              />
            )}
            name="phoneNumber"
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

          <Controller
            control={control}
            rules={{
              required: 'Please confirm your password',
              validate: value => value === password || 'Passwords do not match',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.confirmPassword?.message}
                isPassword
                autoComplete="password"
              />
            )}
            name="confirmPassword"
          />

          <Button
            title="Create Account"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            style={styles.registerButton}
          />
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?{' '}
            <Link href="/(auth)/login" style={styles.link}>
              Sign in
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
  registerButton: {
    marginTop: 8,
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
});
