// SPDX-License-Identifier: MIT
//
// The two Server Actions that bridge @rakomi/react's browser-side session (tokens in
// browser storage) to a Server-Component-readable httpOnly cookie:
//
//   syncSession  — called once, right after the client-side PKCE exchange completes
//                  (src/app/oauth/callback/page.tsx). Re-verifies the access token
//                  SERVER-SIDE with @rakomi/node's verifyRakomiToken (never trusts the
//                  client's "I'm signed in" claim on its own) before setting the cookie.
//   clearSession — called from the sign-out button alongside the client SDK's own
//                  signOut(), so both halves of the session (browser storage + cookie) end
//                  together.
'use server';

import { cookies } from 'next/headers';

import { verifyRakomiToken } from '@rakomi/node';

import { serverConfig } from '../lib/server/config';
import { SESSION_COOKIE_NAME } from '../lib/session-cookie';

// RFC 7519 does not bound JWT size; this quickstart bounds it defensively before touching
// verification or cookie storage (a Set-Cookie header has its own de-facto ~4KB ceiling).
const MAX_TOKEN_LENGTH = 8192;

export interface SyncSessionResult {
  ok: boolean;
}

export async function syncSession(accessToken: string): Promise<SyncSessionResult> {
  if (typeof accessToken !== 'string' || accessToken.length === 0 || accessToken.length > MAX_TOKEN_LENGTH) {
    return { ok: false };
  }

  const tenantId = serverConfig.tenantId;
  if (!tenantId) {
    return { ok: false };
  }

  const result = await verifyRakomiToken(accessToken, {
    requiredTenantId: tenantId,
    ...(serverConfig.issuer ? { issuer: serverConfig.issuer } : {}),
    ...(serverConfig.jwksUrl ? { jwksUrl: serverConfig.jwksUrl } : {}),
  });

  if (!result.ok) {
    return { ok: false };
  }

  const jar = await cookies();
  const maxAge = Math.max(0, result.data.exp - Math.floor(Date.now() / 1000));
  jar.set(SESSION_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: serverConfig.isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge,
  });

  return { ok: true };
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE_NAME);
}
