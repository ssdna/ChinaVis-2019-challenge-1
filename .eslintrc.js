module.exports = {
  env: {
    "browser": true,
    "es6": true
  },
  parserOptions: {
    "parser": "babel-eslint"
  },
  extends: [
    // add more generic rulesets here, such as:
    // 'eslint:recommended',
    'standard',
    'plugin:vue/recommended',
  ],
  globals: {
    'THREE': true
  },
  rules: {
    // "no-new": 0
    // "indent": ["error", 4]
  }
}
