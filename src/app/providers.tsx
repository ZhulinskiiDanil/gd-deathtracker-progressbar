'use client';

import ReactQueryProvider from '@/shared/providers/ReactQueryProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return <ReactQueryProvider>{children}</ReactQueryProvider>;
}
