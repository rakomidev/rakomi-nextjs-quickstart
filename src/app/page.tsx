// SPDX-License-Identifier: MIT
//
// Sign-in page. `signIn({ mode: 'redirect' })` starts the PKCE flow: @rakomi/react
// generates the code_verifier/code_challenge and `state`, stores them, resolves the real
// hosted-login `authorization_endpoint` via OIDC discovery, and navigates the browser there.
'use client';

import Link from 'next/link';

import { useAuth } from '@rakomi/react';

import { describeAuthError } from '../lib/auth-error-message';

export default function HomePage() {
  const auth = useAuth();

  if (!auth.isLoaded) {
    return <p>Loading…</p>;
  }

  if (auth.isSignedIn) {
    return (
      <main>
        <h1>Rakomi Next.js quickstart</h1>
        <p>Signed in as {auth.user.email}.</p>
        <Link href="/dashboard">Go to the dashboard</Link>
      </main>
    );
  }

  return (
    <main>
      <h1>Rakomi Next.js quickstart</h1>
      <p>Ship Next.js auth in 5 minutes with @rakomi/react + @rakomi/node.</p>
      <button type="button" onClick={() => void auth.signIn({ mode: 'redirect' })}>
        Sign in with Rakomi
      </button>
      {auth.error ? <p role="alert">{describeAuthError(auth.error)}</p> : null}
    </main>
  );
}
