// SPDX-License-Identifier: MIT
//
// Client-safe configuration. Every value here is a NEXT_PUBLIC_* env var, which Next.js
// inlines into the browser bundle at build time — a LITERAL `process.env.NEXT_PUBLIC_X`
// expression written in THIS file, not a runtime lookup and not an indirected access
// (`globalThis.process?.env[...]`), which Next's compiler cannot statically detect and so
// cannot inline. This file matches the repo-wide eslint exemption glob (`**/config.ts`)
// that permits direct process.env access.
//
// Never add a non-NEXT_PUBLIC_ (secret) value to this file — it would ship to every
// visitor's browser. Secret / server-only configuration lives in ../server/config.ts, a
// separate file, so a secret can never be pulled into this one by an incautious import.

export const clientConfig = {
  clientId: process.env.NEXT_PUBLIC_RAKOMI_CLIENT_ID,
  baseUrl: process.env.NEXT_PUBLIC_RAKOMI_BASE_URL,
} as const;
