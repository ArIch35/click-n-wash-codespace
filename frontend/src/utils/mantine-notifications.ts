import { notifications } from '@mantine/notifications';
import Notification from '../interfaces/notification';
import { autoCloseDuration } from './constants';

/**
 * Show custom notification with autoClose
 * @param notification Notification to show
 */
export const showCustomNotification = (notification: Notification) => {
  notifications.show({
    ...notification,
    autoClose: notification.autoClose ? autoCloseDuration : false,
  });
};

/**
 * Show auth required notification only once by hiding previous notification
 */
export const showAuthRequiredOnce = () => {
  notifications.hide('auth-required');
  showCustomNotification({
    id: 'auth-required',
    title: 'Authentication Required',
    message: 'You must be logged in to view this page',
    color: 'red',
    autoClose: true,
  });
};

/**
 * Show vendor required notification only once by hiding previous notification
 */
export const showVendorRequiredOnce = () => {
  notifications.hide('vendor-required');
  showCustomNotification({
    id: 'vendor-required',
    title: 'Vendor Required',
    message: 'You must be a vendor to view this page',
    color: 'red',
    autoClose: true,
  });
};
