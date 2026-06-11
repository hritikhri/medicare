import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export const useSocket = (userId) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!userId) return;
    const socketInstance = io(import.meta.env.VITE_SOCKET_URL);
    socketInstance.emit('join_notifications', userId);
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [userId]);

  return socket;
};