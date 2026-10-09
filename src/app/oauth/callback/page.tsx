// SPDX-License-Identifier: MIT
//
// The route @rakomi/react's default redirectUri points at
// (`${window.location.origin}/oauth/callback`). RakomiProvider (mounted at the root layout)
// already validates `state`, exchanges the authorization `code` for tokens
// (`POST /oauth/token`), and stores them client-side — this page's OWN job starts only
// AFTER that: once `useAuth()` reports `isSignedIn`, hand the access token to the
// `syncSession` Server Action so it can be re-verified server-side (@rakomi/node) and
// copied into an httpOnly cookie the Server Component at /dashboard can read. Without
// this bridge, the dashboard (a Server Component, with no access to browser storage) would
// have no way to know the visitor is signed in.
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { useAuth } from '@rakomi/react';

import { describeAuthError } from '../../../lib/auth-error-message';
import { syncSession } from '../../actions';

export default function OAuthCallbackPage() {
  const auth = useAuth();
  const router = useRouter();
  const syncStarted = useRef(false);

  useEffect(() => {
    if (!auth.isLoaded || !auth.isSignedIn || syncStarted.current) {
      return;
    }
    syncStarted.current = true;
    void (async () => {
      const token = await auth.getToken();
      if (token.ok) {
        await syncSession(token.token);
      }
      router.replace('/dashboard');
    })();
  }, [auth, router]);

  if (auth.isLoaded && !auth.isSignedIn && auth.error) {
    return <p role="alert">Sign-in failed: {describeAuthError(auth.error)}</p>;
  }

  return <p>Completing sign-in…</p>;
}
