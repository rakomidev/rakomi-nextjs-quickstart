// SPDX-License-Identifier: MIT
//
// `AuthError` (@rakomi/react, re-exported from @rakomi/sdk-core) is a discriminated union
// with NO common `.message` field — `OAUTH_CALLBACK_ERROR` carries `description`,
// `TENANT_SUSPENDED` carries `reason`. This is the one place that switches on `.code` to
// produce a display string, so no call site has to re-derive the per-variant field name.

import type { AuthError } from '@rakomi/react';

export function describeAuthError(error: AuthError): string {
  switch (error.code) {
    case 'REFRESH_FAILED':
      return `Session refresh failed (${error.reason}).`;
    case 'OAUTH_CALLBACK_ERROR':
      return error.description || error.oauthError;
    case 'TENANT_SUSPENDED':
      return `This tenant is suspended: ${error.reason}`;
    case 'CSRF_MISMATCH':
    case 'CODE_EXCHANGE_FAILED':
    case 'SIGN_IN_FAILED':
    case 'INVALID_CONFIG':
    case 'NETWORK_ERROR':
    case 'PROVIDER_ERROR':
      return error.message;
    default: {
      const exhaustive: never = error;
      return String(exhaustive);
    }
  }
}
