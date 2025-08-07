import js from '@eslint/js';
import expoConfig from 'eslint-config-expo/flat';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

/** @type {import("eslint").Linter.Config} */
export default defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  pluginReact.configs.flat.recommended,

  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    settings: {
      'import/resolver': { typescript: true, node: true },
      'node': { version: 'detect' },
    },

    rules: {
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      'complexity': ['warn', { max: 15 }],
      'semi': ['error', 'always'],
      'no-duplicate-imports': 'error',
      'no-console': 'error',
      'no-debugger': 'error',
      'no-undef': 'error',
      'no-var': 'warn',
      'no-empty-function': 'warn',
      'no-useless-escape': 'off',
      'no-unused-vars': 'error',
      'prefer-const': 'warn',
      'array-bracket-spacing': 'warn',
      'object-curly-spacing': ['warn', 'always'],
      'react/react-in-jsx-scope': 'off',
    },
  },

  {
    ignores: [
      'expo-env.d.ts',
      'dist/*', // Build output directory
      'android/', // Android native project files
      'ios/', // iOS native project files
      'web-build/', // Web build output
      '.expo/', // Expo development artifacts
      '.expo-shared/', // Shared Expo development files
      '.git/', // Git repository files
      'node_modules/', // Node.js dependencies (often implicitly ignored but good to be explicit)
      'coverage/', // Test coverage reports
      'assets/generated/', // Generated assets, if any
      'app.config.js', // Expo app configuration file, often treated as a Node.js file
      'metro.config.js', // Metro bundler configuration
      'babel.config.js', // Babel configuration
    ],
  },
]);
