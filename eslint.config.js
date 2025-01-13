import * as path from "node:path";
import { includeIgnoreFile } from "@eslint/compat";
import eslint from "@eslint/js";
import astroPlugin from "eslint-plugin-astro";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  includeIgnoreFile(path.join(import.meta.dirname, ".gitignore")),
  { ignores: ["**/*.config.*", ".prettierrc.mjs", "public/*"] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  ...astroPlugin.configs.recommended,
  ...astroPlugin.configs["jsx-a11y-recommended"],
  {
    plugins: {
      import: importPlugin,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
      "@typescript-eslint/no-misused-promises": [
        2,
        { checksVoidReturn: { attributes: false } },
      ],
      "@typescript-eslint/no-unnecessary-condition": [
        "error",
        {
          allowConstantLoopConditions: true,
        },
      ],
      "@typescript-eslint/no-non-null-assertion": "error",
      "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
    },
  },
  {
    files: ["**/*.astro"],
    rules: {
      "@typescript-eslint/no-unsafe-return": "off",
    },
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        project: true,
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
);
