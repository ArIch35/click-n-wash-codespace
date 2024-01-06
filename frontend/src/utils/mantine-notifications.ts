import { notifications } from '@mantine/notifications';
import { autoCloseDuration } from './constants';

/**
 * Show auth required notification only once by hiding previous notification
 */
export const showAuthRequiredOnce = () => {
  notifications.hide('auth-required');
  notifications.show({
    id: 'auth-required',
    title: 'Authentication Required',
    message: 'You must be logged in to view this page',
    color: 'red',
    autoClose: autoCloseDuration,
  });
};

/**
 * Show vendor required notification only once by hiding previous notification
 */
export const showVendorRequiredOnce = () => {
  notifications.hide('vendor-required');
  notifications.show({
    id: 'vendor-required',
    title: 'Vendor Required',
    message: 'You must be a vendor to view this page',
    color: 'red',
    autoClose: autoCloseDuration,
  });
};
