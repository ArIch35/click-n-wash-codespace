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

/**
 * Show success notification
 * @param entityName Name of the entity
 * @param action Action performed on the entity
 */
export const showSuccessNotification = (entityName: string, action: string) => {
  showCustomNotification({
    title: 'Success',
    message: `${entityName} successfully ${action}d`,
    color: 'green',
    autoClose: true,
  });
};

/**
 * Show error notification
 * @param entityName Name of the entity
 * @param action Action performed on the entity
 */
export const showErrorNotification = (entityName: string, action: string, message: string) => {
  showCustomNotification({
    title: `Failed to ${action} ${entityName}`,
    message: message,
    color: 'red',
    autoClose: true,
  });
};
