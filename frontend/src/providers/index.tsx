'use client';

import QueryProvider from './QueryProvider';
import MuiProvider from './MuiProvider';
import { ErrorBoundary } from '../components/ErrorBoundary';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <MuiProvider>
          {children}
        </MuiProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}
