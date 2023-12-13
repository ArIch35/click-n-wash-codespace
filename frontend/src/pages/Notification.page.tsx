import React, { useEffect } from 'react';
import { io } from 'socket.io-client';

const NotificationPage = () => {
  const [notification, setNotification] = React.useState<string[]>([]);
  const [notification2, setNotification2] = React.useState<string[]>([]);

  useEffect(() => {
    const socket = io('https://didactic-doodle-r4pwgrgpw76hp59-8080.app.github.dev/');

    // Emit an event to the server
    socket.emit('my event', { data: 'Hello, server!' });

    socket.on('message', (data) => {
      console.log('Received data from server:', data);
      setNotification((prevNotification) => [...prevNotification, data]);
    });

    socket.on('message2', (data) => {
      console.log('Received data from server:', data);
      setNotification2((prevNotification) => [...prevNotification, data]);
    });

    // To be replaced with actual user id
    const userId = Math.floor(Math.random() * 1000000);
    socket.emit("registerUser", userId);

    function endConnection() : void {
      socket.disconnect();
    }
    console.log('socket', socket);

    return () => endConnection();
  }, []);

  return <div>Notification Page
    {notification.map((item, index) => {
      return <div key={index}>{item}</div>;
    })}
    {notification2.map((item, index) => {
      return <div key={index}>{item}</div>;
    })}
  </div>;
};

export default NotificationPage;
