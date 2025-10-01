// eslint.config.js

import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import reactNative from 'eslint-plugin-react-native';
import globals from "globals";

export default [
  js.configs.recommended,
  {
    ignores: ['node_modules/', 'app-example/', '.expo/', 'dist/', 'babel.config.js'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,   // fetch, window, document, etc.
        ...globals.node,      // process, __dirname, etc.
      },
    },
    plugins: {
      'react-native': reactNative,
      '@typescript-eslint': tseslint,
      react,
      'react-hooks': reactHooks,
      import: importPlugin,
    },
    rules: {
      // ✅ Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // ✅ React
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',

      // TS unused vars instead of base rule
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [
            { pattern: '@/**', group: 'internal', position: 'after' },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: { order: 'asc', caseInsensitive: true },
          'newlines-between': 'always',
        },
      ],
    },
  },
];
