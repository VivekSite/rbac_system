import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginSecurity from "eslint-plugin-security";
import pluginPrettier from "eslint-plugin-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [
      "node_modules",
      "dist",
      ".eslintignore",
      "yarn.lock",
      "package.json",
      ".env.example"
    ]
  },
  {
    languageOptions: { globals: globals.node },
    files: ["**/*.{js,mjs,cjs,ts}"],
    plugins: {
      prettier: pluginPrettier,
      security: pluginSecurity
    },
    rules: {
      "no-console": "warn",
      "no-unused-vars": ["error"],
      "no-unused-expressions": ["error"],
      "prefer-const": ["error"],
      quotes: ["error", "double"],
      "indent-style": ["error", "tab"],

      "prettier/prettier": ["error"]
    }
  },
  pluginJs.configs.recommended,
  pluginSecurity.configs.recommended,
  ...tseslint.configs.recommended,
];
