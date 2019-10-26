module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ['airbnb-base'],
  rules: {
    'no-plusplus': 'off',
    'no-param-reassign': 'off',
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    cc: 'readonly',
    CC_DEV: 'readonly',
    CC_BUILD: 'readonly',
    Global: 'writable',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      node: {
        paths: [
          'assets/scripts/utils/',
          'assets/scripts/character/utils/',
          'assets/scripts/perceptron/utils/',
        ],
      },
    },
  },
};
