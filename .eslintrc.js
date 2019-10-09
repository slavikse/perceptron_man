module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    "prettier",
    "airbnb-base",
  ],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": ["error"],
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    cc: 'readonly',
    CC_DEV: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      node: {
        paths: [
          'assets/scripts/utils',
        ],
      },
    },
  },
  rules: {
    'no-plusplus': 'off',
    'no-param-reassign': 'off',
  },
};
