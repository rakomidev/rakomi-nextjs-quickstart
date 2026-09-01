<!-- SPDX-License-Identifier: MIT -->

# Ship Next.js auth in 5 minutes

A minimal, real Next.js 16 App Router app wired to Rakomi: PKCE sign-in on the client with
`@rakomi/react`, and server-side access-token verification with `@rakomi/node` — no
hand-rolled OAuth, no hand-rolled JWT verification.

Deploy to Vercel by importing this repository in the Vercel dashboard, then set the
environment variables from `.env.example` (see "Run it" below) as project environment
variables.

## What this demonstrates

1. A `/` sign-in page using `@rakomi/react`'s `useAuth()` hook — `signIn({ mode: 'redirect' })`
   starts a PKCE authorization-code flow (RFC 6749 §4.1 + RFC 7636) against your Rakomi
   tenant. No verifier/challenge/state handling in app code — the SDK owns it.
2. A `/oauth/callback` route — the default redirect target. `<RakomiProvider>` (mounted at
   the root layout) validates `state`, exchanges the `code` for tokens, and stores them
   client-side. This page's own job is the **bridge**: once signed in, it hands the access
   token to a Server Action (`syncSession`) that re-verifies it server-side and copies it
   into an httpOnly cookie.
3. A protected `/dashboard` **Server Component** that reads that cookie and calls
   `verifyRakomiToken` (`@rakomi/node`) directly — the real signature/issuer/audience/tenant
   check, not a decoded-and-trusted read. `src/proxy.ts` adds a cheap, presence-only
   redirect in front of it (defense in depth; the page still does the real check).
4. Sign-out that clears **both halves** of the session: the client SDK's own
   `signOut()` (browser storage + best-effort revoke) and the Server Action that deletes the
   cookie.

## Why two SDKs, and why the httpOnly-cookie bridge

`@rakomi/react` manages the browser-side session (PKCE, token storage, refresh) — but it has
no way to hand a Server Component a token, because Server Components render with no access
to browser storage. `@rakomi/node`'s `verifyRakomiToken` is a standalone, dependency-light
resource-server helper (no API key required) built for exactly this: verifying a token you
received from somewhere else. The `syncSession` Server Action is the "somewhere else" —
it is the ONE place a client-obtained token is re-checked before this app trusts it
server-side. **Never render server content based on the client SDK's `isSignedIn` alone** —
that is a claim from the browser, not a verified fact.

## Run it

Copy `.env.example` to `.env.local` and fill in your tenant's client ID / tenant ID (from
your Rakomi dashboard). Then:

```sh
npm install
npm run dev
```

Then:

```sh
npm run build       # next build
npm run typecheck   # tsc --noEmit
```

`@rakomi/node` and `@rakomi/react` resolve as `^0.2.0` on npm.

## Troubleshooting

If an OAuth error interrupts sign-in against a real tenant, note the approximate timestamp and
the error code from the callback — every OAuth error response is recorded server-side with its
error code and a request identifier, which support can use to locate the exact request when
diagnosing an integration issue.

## Standards this quickstart honors

- **RFC 6749** §4.1 (authorization code grant) + **RFC 7636** (PKCE) — the sign-in flow.
- **RFC 9068** — the access token is verified as a JWT profile access token (`typ: at+jwt`).
- **RFC 7517** (JWKS) — server-side verification fetches the platform's published key set.
- **RFC 6265** §4.1.2.6 (`HttpOnly`) / §8.5 — the bridged session cookie is `HttpOnly`,
  `Secure` in production, and `SameSite=Lax`.

## Data & privacy

This quickstart persists nothing of its own beyond the httpOnly session cookie (the access
token, for the token's own lifetime) — no database, no logging of the token or its claims.
The access token itself carries personal data (email, user id) once decoded; this app never
logs a decoded token or its raw value. GDPR data-subject rights for the underlying account
are your Rakomi tenant's concern, not this quickstart's.

## Caveats

- This quickstart demonstrates a real authentication flow (PKCE + server-side token
  verification + session-cookie issuance) — treat any change you make to
  `src/app/actions.ts`, `src/app/dashboard/page.tsx`, or `src/proxy.ts` in your own fork
  with the same care as your own auth code.
- It is not a UI kit, a multi-tenant admin console, or a demonstration of every Rakomi
  feature (MFA, passkeys, organizations, …) — the smallest real path from "nothing" to
  "a protected page that knows who signed in."
