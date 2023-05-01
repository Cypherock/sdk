module.exports = {
  root: true,
  extends: ["@cypherock/eslint-config"],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json']
  },
  rules: {
    "no-bitwise": 0
  }
};
