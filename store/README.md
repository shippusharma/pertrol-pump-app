# User Store - Zustand State Management

A comprehensive, secure, and optimized Zustand store for managing user state in the Petrol Pump App. This store provides robust user authentication, profile management, preferences, and secure data persistence.

## 🚀 Features

- **🔐 Secure Authentication**: Complete login/logout flow with token management
- **💾 Persistent Storage**: Cross-platform secure storage with encryption
- **⚡ Performance Optimized**: Shallow comparison selectors to prevent unnecessary re-renders
- **🛡️ Type Safe**: Full TypeScript support with comprehensive type definitions
- **🔄 Token Management**: Automatic token refresh and validation
- **👤 Profile Management**: User profile CRUD operations
- **⚙️ Preferences**: User settings and preferences management
- **📱 Cross-Platform**: Works on iOS, Android, and Web
- **🔍 DevTools**: Redux DevTools integration for debugging
- **📊 Health Monitoring**: Store health checks and diagnostics

## 📦 Installation

The store is already included in the project. Make sure you have the required dependencies:

```bash
# Core dependencies (already installed)
zustand
expo-secure-store
@react-native-async-storage/async-storage

# Development dependencies (already installed)
@types/react
typescript
```

## 🏗️ Architecture

```
store/
├── types/
│   └── user-store.types.ts      # TypeScript type definitions
├── middleware/
│   └── persistence.middleware.ts # Secure storage middleware
├── examples/
│   └── usage-examples.tsx       # Comprehensive usage examples
├── user.store.ts                 # Main store implementation
├── index.ts                      # Public API exports
└── README.md                     # This file
```

## 🎯 Quick Start

### 1. Initialize the Store

```tsx
import { initializeUserStore } from '@/store';

// In your App.tsx or main component
useEffect(() => {
  initializeUserStore();
}, []);
```

### 2. Basic Usage

```tsx
import { useUserStore } from '@/store';

const MyComponent = () => {
  const { login, logout, profile, isLoading } = useUserStore();

  const handleLogin = async () => {
    try {
      await login({
        profile: userProfile,
        tokens: authTokens,
      });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <View>{profile ? <Text>Welcome, {profile.name}!</Text> : <Button onPress={handleLogin} title="Login" />}</View>
  );
};
```

### 3. Optimized Selectors

```tsx
import { useUserSelectors } from '@/store';

const ProfileComponent = () => {
  // These only re-render when their specific values change
  const userName = useUserSelectors.useUserName();
  const userEmail = useUserSelectors.useUserEmail();
  const isLoggedIn = useUserSelectors.useIsLoggedIn();

  return (
    <View>
      <Text>Name: {userName}</Text>
      <Text>Email: {userEmail}</Text>
      <Text>Status: {isLoggedIn ? 'Logged In' : 'Not Logged In'}</Text>
    </View>
  );
};
```

### 4. Custom Hooks

```tsx
import { useUserHooks } from '@/store';

const RoleBasedComponent = () => {
  const hasAdminRole = useUserHooks.useHasRole('admin');
  const displayName = useUserHooks.useDisplayName();
  const isProfileComplete = useUserHooks.useIsProfileComplete();

  return (
    <View>
      {hasAdminRole && <AdminPanel />}
      <Text>Hello, {displayName}!</Text>
      {!isProfileComplete && <CompleteProfilePrompt />}
    </View>
  );
};
```

## 🔧 API Reference

### Main Store Hook

```tsx
const {
  // State
  profile,
  tokens,
  session,
  preferences,
  isLoading,
  isInitialized,
  error,
  isLoggedIn,
  hasValidTokens,
  userRole,

  // Actions
  login,
  logout,
  refreshTokens,
  updateProfile,
  updateAvatar,
  updateSession,
  clearSession,
  updatePreferences,
  clearStore,
  setError,
  setLoading,
  initialize,
} = useUserStore();
```

### Optimized Selectors

```tsx
// Profile selectors
const profile = useUserSelectors.useProfile();
const userName = useUserSelectors.useUserName();
const userEmail = useUserSelectors.useUserEmail();
const userRole = useUserSelectors.useUserRole();
const userAvatar = useUserSelectors.useUserAvatar();

// Authentication selectors
const isLoggedIn = useUserSelectors.useIsLoggedIn();
const hasValidTokens = useUserSelectors.useHasValidTokens();
const authTokens = useUserSelectors.useAuthTokens();

// Session selectors
const session = useUserSelectors.useSession();
const isAuthenticated = useUserSelectors.useIsAuthenticated();

// Preferences selectors
const preferences = useUserSelectors.usePreferences();
const theme = useUserSelectors.useTheme();
const language = useUserSelectors.useLanguage();

// Store state selectors
const isLoading = useUserSelectors.useIsLoading();
const isInitialized = useUserSelectors.useIsInitialized();
const error = useUserSelectors.useError();
```

### Custom Hooks

```tsx
// Role-based hooks
const hasRole = useUserHooks.useHasRole('admin');
const hasAnyRole = useUserHooks.useHasAnyRole(['admin', 'manager']);

// Utility hooks
const displayName = useUserHooks.useDisplayName();
const isProfileComplete = useUserHooks.useIsProfileComplete();
```

### Utility Functions

```tsx
import {
  initializeUserStore,
  cleanupUserStore,
  checkUserStoreHealth,
  migrateUserStore,
  debugUserStore,
  monitorUserStorePerformance,
} from '@/store';

// Initialize store on app start
await initializeUserStore();

// Check store health
const health = checkUserStoreHealth();

// Cleanup on app close
await cleanupUserStore();

// Debug in development
debugUserStore();

// Monitor performance
const monitor = monitorUserStorePerformance();
const duration = monitor.measure(() => {
  // Your code here
});
```

## 🔐 Security Features

### Data Encryption

- **Sensitive Data**: User profile and tokens are encrypted before storage
- **Secure Storage**: Uses `expo-secure-store` on mobile platforms
- **Fallback Storage**: Gracefully falls back to `AsyncStorage` on web
- **Cross-Platform**: Consistent security across all platforms

### Token Management

- **Automatic Validation**: Tokens are validated on every access
- **Refresh Logic**: Automatic token refresh before expiration
- **Secure Storage**: Tokens are encrypted and securely stored
- **Expiration Handling**: Graceful handling of expired tokens

## 📱 Platform Support

| Platform | Storage Method    | Security Level        |
| -------- | ----------------- | --------------------- |
| iOS      | expo-secure-store | High (Keychain)       |
| Android  | expo-secure-store | High (Keystore)       |
| Web      | AsyncStorage      | Medium (LocalStorage) |

## 🚨 Error Handling

The store provides comprehensive error handling:

```tsx
const { error, setError } = useUserStore();

// Errors are automatically set for failed operations
if (error) {
  // Display error to user
  Alert.alert('Error', error);
}

// Manually set errors
setError('Custom error message');

// Clear errors
setError(null);
```

## 🔄 State Persistence

### Automatic Persistence

- **Profile Data**: Automatically persisted and restored
- **Authentication**: Tokens and session data are preserved
- **Preferences**: User settings are maintained across app sessions
- **Version Control**: Store version tracking for migrations

### Manual Control

```tsx
// Clear all persisted data
await logout();

// Check persistence status
const health = checkUserStoreHealth();
```

## 📊 Performance Optimization

### Shallow Comparison

```tsx
// ✅ Good: Only re-renders when specific value changes
const userName = useUserSelectors.useUserName();

// ❌ Bad: Re-renders on any state change
const { profile } = useUserStore();
const userName = profile?.name;
```

### Selective Updates

```tsx
// Update only specific fields
await updateProfile({ name: 'New Name' });

// Update preferences
await updatePreferences({ theme: 'dark' });
```

## 🧪 Testing

### Store Testing

```tsx
import { renderHook, act } from '@testing-library/react-hooks';
import { useUserStore } from '@/store';

test('should login user successfully', async () => {
  const { result } = renderHook(() => useUserStore());

  await act(async () => {
    await result.current.login(mockUserData);
  });

  expect(result.current.isLoggedIn).toBe(true);
  expect(result.current.profile).toEqual(mockUserData.profile);
});
```

### Mock Data

```tsx
const mockUserData = {
  profile: {
    _id: 'test_user_123',
    name: 'Test User',
    email: 'test@example.com',
    // ... other required fields
  },
  tokens: {
    accessToken: 'test_access_token',
    refreshToken: 'test_refresh_token',
    accessTokenExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
};
```

## 🔧 Configuration

### Environment Variables

```typescript
// configs/env/env.v.ts
export const ENV = {
  STORE_VERSION: '1.0.0',
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || 'default_key',
  STORAGE_PREFIX: 'petrol_pump_user_store_',
} as const;
```

### Store Options

```typescript
// Customize store behavior
export const useUserStore = create<UserStore>()(
  devtools(
    subscribeWithSelector(
      createPersistenceMiddleware()((set, get, api) => ({
        // ... store implementation
      }))
    ),
    {
      name: 'user-store',
      enabled: __DEV__, // Only in development
    }
  )
);
```

## 📚 Examples

See the `examples/usage-examples.tsx` file for comprehensive usage examples covering:

- Basic store usage
- Optimized selectors
- Custom hooks
- Store initialization
- Profile management
- Token management
- Error handling

## 🚀 Best Practices

### 1. Use Optimized Selectors

```tsx
// ✅ Good
const userName = useUserSelectors.useUserName();

// ❌ Bad
const { profile } = useUserStore();
const userName = profile?.name;
```

### 2. Handle Loading States

```tsx
const { isLoading, profile } = useUserStore();

if (isLoading) {
  return <LoadingSpinner />;
}

if (!profile) {
  return <LoginPrompt />;
}
```

### 3. Error Boundaries

```tsx
const { error } = useUserStore();

useEffect(() => {
  if (error) {
    // Log error, show notification, etc.
    console.error('Store error:', error);
  }
}, [error]);
```

### 4. Initialize Early

```tsx
// In your App.tsx
useEffect(() => {
  initializeUserStore();
}, []);
```

### 5. Cleanup on Unmount

```tsx
useEffect(() => {
  return () => {
    // Cleanup if needed
  };
}, []);
```

## 🐛 Troubleshooting

### Common Issues

1. **Store not initializing**
   - Check if `initializeUserStore()` is called
   - Verify storage permissions on mobile

2. **Data not persisting**
   - Check storage implementation for your platform
   - Verify encryption/decryption is working

3. **Performance issues**
   - Use optimized selectors instead of full store
   - Check for unnecessary re-renders

4. **Type errors**
   - Ensure all required fields are provided
   - Check type definitions match your data

### Debug Mode

```tsx
// Enable debug logging
if (__DEV__) {
  debugUserStore();
}
```

## 🤝 Contributing

When contributing to the store:

1. **Follow TypeScript**: Maintain strict type safety
2. **Add Tests**: Include tests for new functionality
3. **Update Types**: Keep type definitions current
4. **Document**: Add JSDoc comments for new features
5. **Performance**: Consider performance implications

## 📄 License

This store is part of the Petrol Pump App project.

## 🆘 Support

For issues or questions:

1. Check the examples in `examples/usage-examples.tsx`
2. Review the type definitions in `types/user-store.types.ts`
3. Check the store implementation in `user.store.ts`
4. Review this README for usage patterns

---

**Happy coding! 🎉**
