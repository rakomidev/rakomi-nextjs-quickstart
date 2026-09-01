// SPDX-License-Identifier: MIT
//
// Wraps the whole app in <RakomiProvider>. clientId/baseUrl are passed explicitly from
// ../lib/client/config (rather than relying on the SDK's own env auto-detection) so
// Next.js's compiler sees the LITERAL `process.env.NEXT_PUBLIC_X` expression it needs to
// inline the value into the browser bundle.
//
// RakomiProvider throws synchronously if `clientId` is missing (its own required-field
// check — see @rakomi/react's constructor). Left unguarded, that throw fires during
// `next build`'s static prerender of every page nested under this layout — including
// Next's own internal error-boundary page — so a `.env.local` with no client ID configured
// would make `next build` itself fail with a confusing, unrelated-looking error. Guard it
// here instead: render a clear "copy .env.example" message rather than letting the SDK's
// throw propagate into the render tree.
//
// RakomiProvider handles the OAuth `?code&state` callback itself, on whichever page
// happens to be mounted when the browser lands back on redirectUri (default:
// `${origin}/oauth/callback`) — see src/app/oauth/callback/page.tsx, which is the actual
// route the OAuth redirect_uri points at.
'use client';

import type { ReactNode } from 'react';

import { RakomiProvider } from '@rakomi/react';

import { clientConfig } from '../lib/client/config';

export function Providers({ children }: { children: ReactNode }) {
  if (!clientConfig.clientId) {
    return (
      <p role="alert">
        Missing <code>NEXT_PUBLIC_RAKOMI_CLIENT_ID</code>. Copy <code>.env.example</code> to{' '}
        <code>.env.local</code> and fill in your tenant&apos;s OAuth client ID.
      </p>
    );
  }

  return (
    <RakomiProvider clientId={clientConfig.clientId} baseUrl={clientConfig.baseUrl}>
      {children}
    </RakomiProvider>
  );
}
