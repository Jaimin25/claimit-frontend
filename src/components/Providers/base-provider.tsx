'use client';

import QueryProvider from './query-provider';
import { UserProvider } from './user-provider';

export default function BaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <UserProvider>{children}</UserProvider>
    </QueryProvider>
  );
}
