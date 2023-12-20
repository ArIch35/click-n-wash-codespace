import React, { createContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Socket, io } from 'socket.io-client';
import { RootState } from '../reducers/root.reducer';
import loadEnv from '../utils/load-env';

const NotificationContext = createContext<null>(null);

interface NotificationProviderProps {
  children: React.ReactNode;
}

const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const userIdFromReducer = useSelector((state: RootState) => state.notificationState.userId);
  const socket: Socket = io(loadEnv().VITE_SERVER_ADDRESS);

  useEffect(() => {
    if (userIdFromReducer) {
      socket.emit('registerUserToSocket', userIdFromReducer);
    }

    function endConnection(): void {
      socket.emit('deleteUserFromSocket', userIdFromReducer);
      socket.disconnect();
    }

    // Handle socket connection here
    socket.on('notification', (data) => {
      console.log('hallo', data);
    });

    return () => endConnection();
  }, [userIdFromReducer, socket]);

  return <NotificationContext.Provider value={null}>{children}</NotificationContext.Provider>;
};

export default NotificationProvider;
