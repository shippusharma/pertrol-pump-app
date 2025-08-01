import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native';
import { EyeOff, Eye } from 'lucide-react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  variant?: 'default' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  variant = 'default',
  size = 'md',
  isPassword = false,
  style,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const getInputStyle = () => {
    const baseStyle = [styles.input, styles[size]];
    
    if (variant === 'filled') {
      baseStyle.push(styles.filled);
    } else {
      baseStyle.push(styles.bordered);
    }
    
    if (error) {
      baseStyle.push(styles.error);
    }
    
    return baseStyle;
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          style={[...getInputStyle(), style]}
          secureTextEntry={isPassword && !isPasswordVisible}
          placeholderTextColor="#94A3B8"
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            {isPasswordVisible ? (
              <EyeOff size={20} color="#94A3B8" />
            ) : (
              <Eye size={20} color="#94A3B8" />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    fontSize: 16,
    color: '#1F2937',
    paddingHorizontal: 12,
  },
  // Sizes
  sm: {
    paddingVertical: 8,
    minHeight: 36,
  },
  md: {
    paddingVertical: 12,
    minHeight: 44,
  },
  lg: {
    paddingVertical: 16,
    minHeight: 52,
  },
  // Variants
  bordered: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  filled: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    borderWidth: 0,
  },
  error: {
    borderColor: '#EF4444',
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
});