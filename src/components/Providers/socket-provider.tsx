'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

import { Config } from '@/lib/config';

interface SocketContextProps {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextProps>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const toastId = toast.loading('Connecting to server...', {
      description: 'It may take a while, please wait!',
    });
    const newSocket = io(Config.BACKEND_URL);

    newSocket.on('connect', () => {
      setIsConnected(true);
      toast.success('Connected to server!', {
        id: toastId,
        description: '',
      });
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });
    setSocket(newSocket);

    () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
