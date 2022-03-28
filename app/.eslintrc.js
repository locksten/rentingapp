// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react", "react-native"],
  rules: {
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "typescript-eslint/no-explicit-any",
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react/recommended",
    "prettier",
  ],
}
