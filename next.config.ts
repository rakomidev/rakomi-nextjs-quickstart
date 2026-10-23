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
  // Next.js 16 auto-generates a couple of coding-agent instruction files on `next dev` with
  // general framework guidance (unrelated to Rakomi). Off here: this quickstart is meant to
  // be copied out and run standalone, and shipping someone else's regenerated boilerplate
  // files alongside it adds nothing a real integrator's own project wouldn't already get from
  // running `next dev` themselves.
  agentRules: false,
};

export default nextConfig;
