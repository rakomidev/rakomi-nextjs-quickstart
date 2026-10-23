// SPDX-License-Identifier: MIT
//
// Next.js renders THIS file in place of its own built-in fallback whenever the root layout
// (or anything it renders) throws. Per Next's docs, a global-error boundary REPLACES the root
// layout entirely and therefore supplies its own <html>/<body> — it must NOT import
// `./layout` or `./providers`. That is deliberate, not an oversight: the whole point of a
// global error boundary is to still render something when the root layout ITSELF is broken,
// so it cannot depend on anything the root layout provides (including the `<Providers>` /
// `RakomiProvider` context tree in ./providers.tsx).
//
// Before this file existed, Next had no custom global-error to use and fell back to its own
// built-in one — which the build still renders through a full page-shell prerender pass that
// includes the root layout (see Next's `_global-error` export handling). That pass is what
// `./providers.tsx`'s own comment already flags as a build-time hazard for anything the root
// layout renders. Shipping this file removes that code path outright: `next build` now always
// uses THIS self-contained boundary for `/_global-error`, so the root layout's client tree is
// never part of it.
'use client'; // error boundaries must be Client Components

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <h2>Something went wrong.</h2>
        <p>Reload the page to try again.</p>
        {error.digest ? <p>Reference: {error.digest}</p> : null}
      </body>
    </html>
  );
}
