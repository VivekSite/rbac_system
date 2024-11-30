import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginSecurity from "eslint-plugin-security";
import pluginPrettier from "eslint-plugin-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
	pluginSecurity.configs.recommended,
	...tseslint.configs.recommended,
	{
		ignores: ["node_modules", "dist", "yarn.lock"]
	},
	{
		languageOptions: { globals: globals.node },
		files: ["src/**/*.{js,mjs,cjs,ts}"],
		plugins: {
			prettier: pluginPrettier,
			security: pluginSecurity
		},
		rules: {
			"no-console": "warn",
			"@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "off",
			"prefer-const": "error",
			quotes: ["error", "double"],
			"prettier/prettier": "error"
		}
	}
];
