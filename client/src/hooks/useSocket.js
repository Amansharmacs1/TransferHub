import { useEffect, useState } from 'react';
import { socket } from '../socket';

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [socketId, setSocketId] = useState(null);

  useEffect(() => {
    socket.connect();

    function onConnect() {
      setIsConnected(true);
      setSocketId(socket.id);
      console.log(`Connected: ${socket.id}`);
    }

    function onDisconnect() {
      setIsConnected(false);
      setSocketId(null);
      console.log('Disconnected');
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.disconnect();
    };
  }, []);

  return { isConnected, socketId };
};
