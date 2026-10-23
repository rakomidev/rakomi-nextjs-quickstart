// SPDX-License-Identifier: MIT
//
// Sign-out is symmetric with sign-in: the client SDK clears ITS half of the session
// (browser storage + best-effort POST /oauth/revoke), and the Server Action clears the
// OTHER half (the httpOnly cookie the Server Component at /dashboard reads). Either half
// alone would leave the visitor "signed in" on one side and not the other.
'use client';

import { useRouter } from 'next/navigation';

import { useAuth } from '@rakomi/react';

import { clearSession } from '../app/actions';

export function SignOutButton() {
  const auth = useAuth();
  const router = useRouter();

  async function handleSignOut(): Promise<void> {
    await auth.signOut();
    await clearSession();
    router.replace('/');
  }

  return (
    <button type="button" onClick={() => void handleSignOut()}>
      Sign out
    </button>
  );
}
