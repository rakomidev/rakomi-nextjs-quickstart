// SPDX-License-Identifier: MIT
//
// Coarse, presence-only gate for /dashboard: redirects to '/' when the session cookie is
// absent. This is DEFENSE IN DEPTH, not the security decision — Edge middleware never calls
// verifyRakomiToken here; the actual signature/tenant/expiry check happens in
// src/app/dashboard/page.tsx (Server Component) via the real @rakomi/node
// verifyRakomiToken. A forged or expired cookie VALUE still reaches the page; this file
// only saves a wasted round-trip for the common case (no cookie at all).
//
// Named `proxy.ts` (Next.js 16's rename of the `middleware.ts` file convention — same
// request-interception mechanism, new file/export name).
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { SESSION_COOKIE_NAME } from './lib/session-cookie';

export function proxy(request: NextRequest): NextResponse {
  if (!request.cookies.has(SESSION_COOKIE_NAME)) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard'],
};
