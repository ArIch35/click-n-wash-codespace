import { notifications } from '@mantine/notifications';
import Notification from '../interfaces/notification';
import { autoCloseDuration } from './constants';
import { IconBuildingStore } from '@tabler/icons-react';
import { ThemeIcon } from '@mantine/core';

const iconForServerNotification = (
  <ThemeIcon variant="white" color="blue">
    <IconBuildingStore />
  </ThemeIcon>
);
/**
 * Show custom notification with autoClose
 * @param notification Notification to show
 */
export const showCustomNotification = (notification: Notification) => {
  if (notification.vendor) {
    delete notification.vendor;
    notifications.show({
      ...notification,
      autoClose: notification.autoClose ? autoCloseDuration : false,
      icon: iconForServerNotification,
    });
  } else {
    notifications.show({
      ...notification,
      autoClose: notification.autoClose ? autoCloseDuration : false,
    });
  }
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
export const showSuccessNotification = (
  entityName: string,
  action: string,
  vendor: boolean = false,
) => {
  showCustomNotification({
    title: 'Success',
    message: `${entityName} successfully ${action}d`,
    color: vendor ? '' : 'green',
    autoClose: true,
    vendor,
  });
};

/**
 * Show error notification
 * @param entityName Name of the entity
 * @param action Action performed on the entity
 */
export const showErrorNotification = (
  entityName: string,
  action: string,
  message: string,
  vendor: boolean = false,
) => {
  showCustomNotification({
    title: `Failed to ${action} ${entityName}`,
    message: message,
    color: 'red',
    autoClose: true,
    vendor,
  });
};
