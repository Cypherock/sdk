module.exports = {
  root: true,
  extends: ['@cypherock/eslint-config'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.eslint.json'],
  },
  overrides: [
    {
      // Allow bitwise operations in crypto utilities (totally normal for address/crypto code)
      files: ['src/utils/address.ts'],
      rules: {
        'no-bitwise': 'off',
        'no-plusplus': 'off',
        '@typescript-eslint/prefer-for-of': 'off',
      },
    },
    {
      // Relax some rules for utility files
      files: ['src/utils/**/*.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'warn',
      },
    },
    {
      // Mock files can be more relaxed
      files: ['src/__mocks__/**/*.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'warn',
      },
    },
  ],
};