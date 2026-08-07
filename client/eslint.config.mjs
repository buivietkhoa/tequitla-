import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    rules: {
      // This project fetches client-side data (auth-gated dashboards, cart) with plain
      // useEffect + setState rather than Suspense/`use()`, so the React Compiler's
      // stricter effect rule would flag most of the admin/account pages. Keep it as a
      // warning instead of a hard build-blocking error.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
