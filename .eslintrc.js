module.exports = {
  root: true,
  extends: [
    '@react-native-community',
    'airbnb-typescript',
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/react',
  ],
  plugins: [
    'react-hooks',
    '@typescript-eslint/eslint-plugin',
    'import',
    'react',
    'react-hooks',
    'react-native',
  ],
  settings: {
    'import/resolver': {
      node: {
        paths: ['./'],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
      },
    },
  },
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/no-use-before-define': ['off'],
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'after-used',
        argsIgnorePattern: '^_$',
        ignoreRestSiblings: true,
      },
    ],
    '@typescript-eslint/restrict-plus-operands': 'error',
    'react/prop-types': ['off'],
    'react/destructuring-assignment': ['off'],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': ['off'],
    'jsx-quotes': ['error', 'prefer-double'],
    quotes: [2, 'single'],
    'max-len': [
      'error',
      {
        code: 80,
        tabWidth: 2,
      },
    ],
  },
};
