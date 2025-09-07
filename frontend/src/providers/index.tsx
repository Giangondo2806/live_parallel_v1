'use client';

import QueryProvider from './QueryProvider';
import MuiProvider from './MuiProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <MuiProvider>
        {children}
      </MuiProvider>
    </QueryProvider>
  );
}
