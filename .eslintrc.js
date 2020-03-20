module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    "semi": "off",
    "@typescript-eslint/semi": ["error"],
    "quotes": "off",
    "@typescript-eslint/quotes": ["error", "single"],
  },
  globals: {
    "window": true,
    "requirejs": true,
  }
};
