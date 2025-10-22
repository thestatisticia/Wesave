module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    '@eslint/js',
  ],
  ignorePatterns: [
    'dist',
    'node_modules',
    'contracts/',
    'scripts/',
    'hardhat.config.cjs',
    'artifacts/',
    'cache/',
    'typechain/',
    '.eslintrc.js',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    'react-refresh',
  ],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      ignoreRestSiblings: true 
    }],
    'no-undef': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  overrides: [
    {
      files: ['src/contexts/**/*.jsx'],
      rules: {
        'react-refresh/only-export-components': 'off',
      },
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
};
