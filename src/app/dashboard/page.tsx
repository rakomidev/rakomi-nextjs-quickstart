// SPDX-License-Identifier: MIT
//
// The protected page. A Server Component: it reads the httpOnly session cookie and
// re-verifies it SERVER-SIDE with @rakomi/node's verifyRakomiToken (Mode B — platform
// audience + mandatory tenant pin) before rendering anything. src/proxy.ts also
// redirects here on a MISSING cookie (defense in depth, presence-only, cheap); this page
// is the one place that performs the actual signature/tenant/expiry decision.
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { verifyRakomiToken } from '@rakomi/node';

import { SignOutButton } from '../../components/sign-out-button';
import { serverConfig } from '../../lib/server/config';
import { SESSION_COOKIE_NAME } from '../../lib/session-cookie';

export default async function DashboardPage() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE_NAME)?.value;
  const tenantId = serverConfig.tenantId;

  if (!token || !tenantId) {
    redirect('/');
  }

  const result = await verifyRakomiToken(token, {
    requiredTenantId: tenantId,
    ...(serverConfig.issuer ? { issuer: serverConfig.issuer } : {}),
    ...(serverConfig.jwksUrl ? { jwksUrl: serverConfig.jwksUrl } : {}),
  });

  if (!result.ok) {
    redirect('/');
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <p>Signed in as {result.data.email ?? result.data.userId}.</p>
      <p>Tenant: {result.data.tenantId}</p>
      <SignOutButton />
    </main>
  );
}
