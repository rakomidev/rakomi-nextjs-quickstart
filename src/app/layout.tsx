// SPDX-License-Identifier: MIT
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Rakomi Next.js quickstart',
  description: 'PKCE sign-in with @rakomi/react + @rakomi/node in a Next.js 16 App Router app.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
