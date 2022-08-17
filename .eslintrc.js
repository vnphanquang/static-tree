module.exports = {
  root: true,
  extends: '@vnphanquang/eslint-config',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [],
  rules: {},
};
