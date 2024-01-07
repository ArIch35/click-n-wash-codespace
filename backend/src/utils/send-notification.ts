import Notification from '../interfaces/notification';
import { getSocket } from '../server';
import { users } from './constants';

/**
 * Sends a notification to a user.
 * @param userId The id of the user to send the notification to.
 * @param notification The notification to send.
 * @throws Error if the socket is not initialized.
 */
const sendNotification = (userId: string, notification: Notification) => {
  const socket = getSocket();
  if (!socket) {
    throw new Error('Socket not initialized');
  }

  if (users[userId]) {
    socket.to(users[userId]).emit('notification', notification);
  }
};

export default sendNotification;
