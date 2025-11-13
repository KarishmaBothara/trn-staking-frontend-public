module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@next/next/recommended',
    'plugin:@typescript-eslint/recommended', // TypeScript rules
    'plugin:react/recommended', // React rules
    'plugin:react-hooks/recommended', // React hooks rules
    'plugin:jsx-a11y/recommended', // Accessibility rules
    'prettier',
    'plugin:prettier/recommended', // Prettier recommended rules
    'plugin:@next/next/recommended',
  ],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      // files: ['**/*.ts', '**/*.tsx', '**/*.stories.@(ts|tsx|js|jsx|mjs|cjs)'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        sourceType: 'module',
        tsconfigRootDir: __dirname,
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 8,
        project: ['./tsconfig.json'],
      },
      // "env": {
      //   "browser": true,
      //   "node": true,
      //   "es6": true
      // },
      // "ignorePatterns": ["node_modules/*", ".next/*", "!.prettierrc.js"],

      rules: {
        'prettier/prettier': [
          'error',
          {
            usePrettierrc: true,
          },
        ],
        // We will use TypeScript"s types for component props instead
        'react/prop-types': 'off',
        // No need to import React when using Next.js
        'react/react-in-jsx-scope': 'off',
        'react/no-unescaped-entities': 'off',
        'react-hooks/rules-of-hooks': 'warn',
        'jsx-a11y/click-events-have-key-events': 'warn',
        'jsx-a11y/no-static-element-interactions': 'warn',
        'no-empty-pattern': 'warn',
        'jsx-a11y/iframe-has-title': 'warn',
        // This rule is not compatible with Next.js"s <Link /> components
        'jsx-a11y/anchor-is-valid': 'off',
        // Why would you want unused vars?
        '@typescript-eslint/no-unused-vars': ['off'],
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/ban-types': ['warn'],
        '@typescript-eslint/no-explicit-any': ['off'],
        '@typescript-eslint/ban-ts-ignore': 'off',
      },
    },
  ],
};
