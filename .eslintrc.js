module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: ['@antfu'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  overrides: [{
    "files": ["*"],
    "rules": {
      "curly": [2, "all"],
      "no-console": "off",
      "brace-style": [2, "1tbs", { "allowSingleLine": true }],
      "no-useless-return": "off",
      "prefer-const": "off",
      "no-unused-expressions": "off",
      "@typescript-eslint/no-unused-vars": "off", // If open this, it will create some unexcepted errors
      "no-unused-vars": "error", // best choice
      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/consistent-type-imports": "off",
      "@typescript-eslint/brace-style": "off",
      "@typescript-eslint/no-unnecessary-type-constraint": "off",
      "import/no-mutable-exports": "off",
      "no-cond-assign": "off",
      "spaced-comment": "off",
    }
  }]
};
