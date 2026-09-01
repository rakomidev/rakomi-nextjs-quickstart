// SPDX-License-Identifier: MIT
//
// Server-only configuration. This file matches the repo-wide eslint exemption glob
// (`**/config.ts`) that permits direct process.env access — every OTHER file in this
// quickstart imports the resolved value from here instead of touching process.env itself,
// so this file stays the single audit point for which env vars the app reads server-side.
//
// RAKOMI_REGION documents this deployment's EU-residency pin; it is read here but not
// currently branched on. The platform is EU-native by construction; the var exists so an
// operator reading .env.example sees the residency commitment stated.

export const serverConfig = {
  tenantId: process.env.RAKOMI_TENANT_ID,
  issuer: process.env.RAKOMI_ISSUER,
  jwksUrl: process.env.RAKOMI_JWKS_URL,
  region: process.env.RAKOMI_REGION,
  isProduction: process.env.NODE_ENV === 'production',
} as const;
