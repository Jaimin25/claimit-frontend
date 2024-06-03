'use client';

import QueryProvider from './query-provider';
import { SocketProvider } from './socket-provider';
import { UserProvider } from './user-provider';

export default function BaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <UserProvider>
        <SocketProvider>{children}</SocketProvider>
      </UserProvider>
    </QueryProvider>
  );
}
