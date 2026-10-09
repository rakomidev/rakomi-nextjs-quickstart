// SPDX-License-Identifier: MIT
//
// The single name of the httpOnly session cookie this quickstart's server actions,
// dashboard page, and middleware read/write. One file, so a rename never drifts between
// src/app/actions.ts, src/app/dashboard/page.tsx, and src/proxy.ts.
//
// Not exported from src/app/actions.ts itself — a "use server" file may export only async
// functions (Next.js Server Actions constraint), so this constant lives here instead.

export const SESSION_COOKIE_NAME = 'rakomi_session';
