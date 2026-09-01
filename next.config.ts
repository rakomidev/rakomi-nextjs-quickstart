// SPDX-License-Identifier: MIT
//
// Minimal Next.js 16 config for the quickstart. reactStrictMode surfaces the OAuth
// callback exchange's StrictMode double-invoke guard (@rakomi/react's own
// codeExchangeStarted ref, see src/app/oauth/callback/page.tsx) under local dev exactly as
// it will run for any integrator copying this quickstart — leaving it off here would teach
// a config that hides a class of bug the quickstart otherwise exists to demonstrate is
// already handled.
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
