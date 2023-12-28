import { Notifications } from '@mantine/notifications';
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
  const user = useSelector((state: RootState) => state.authenticationState.user);
  const socket: Socket = io(loadEnv().VITE_SERVER_ADDRESS.replace('/api', ''), {
    autoConnect: false,
  });

  // Handle socket connection here
  socket.on('notification', (data) => {
    console.log('Message from server:', data);
  });

  socket.on('connect', () => {
    socket.emit('registerUserToSocket', user?.id);
    console.log('Connected to server');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });

  useEffect(() => {
    if (!user) {
      return;
    }
    socket.connect();

    return () => {
      socket.emit('deleteUserFromSocket', user?.id);
      socket.disconnect();
    };
  }, [user, socket]);

  return (
    <NotificationContext.Provider value={null}>
      <div>
        <Notifications position="top-right" mt="xl" />
        {children}
      </div>
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
