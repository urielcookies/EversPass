module.exports = {
  root: true,
  extends: '@react-native-community',
  // "linebreak-style": ["error", "unix", "windows"]
  rules: {
    // whitespace: [true, 'check-module'],
    'object-curly-spacing': ['error', 'always'],
    'react/react-in-jsx-scope': 0,
    'max-len': ['error', { code: 100 }],
    'react/no-unstable-nested-components': 0,
  },
};
