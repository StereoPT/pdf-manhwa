module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'no-console': 'off',
    'newline-per-chained-call': 'off',
    'no-await-in-loop': 'off',
    'keyword-spacing': 'off',
    'no-use-before-define': 'off',
  },
};
