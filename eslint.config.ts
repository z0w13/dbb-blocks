import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import type { Linter } from "eslint";

export default [
    {
        rules: {
            // we generally have to accept `unspecified` for our input types
            // so `any` is kind of unavoidable, I suppose an alternative would be
            // `unknown`?
            "@typescript-eslint/no-explicit-any": "off",
        },
    },
    eslintPluginPrettierRecommended,
] satisfies Linter.Config[];
