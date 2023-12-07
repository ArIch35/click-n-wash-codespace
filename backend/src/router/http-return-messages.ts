/**
 * This module contains all the return messages that are used in the application.
 * The messages are returned as an object with two keys: success and message.
 */

interface Message {
  success: boolean;
  message: string;
}

export const customMessage = (success: boolean, message: string): Message => {
  return {
    success,
    message,
  };
};

export const MESSAGE_OK: Message = {
  success: true,
  message: 'Request Sucessfull!',
};

export const MESSAGE_SERVER_ERROR: Message = {
  success: false,
  message: 'Internal Server Error! Please Try Again!',
};

export const MESSAGE_NOT_FOUND: Message = {
  success: false,
  message: 'Entry Does Not Exist!',
};

export const MESSAGE_CONFLICT_RESOLVED: Message = {
  success: true,
  message: 'Entry Already Exist!, Updating....',
};

export const MESSAGE_CONFLICT_UNRESOLVED: Message = {
  success: false,
  message: 'Entry Already Exist!, Cancelling....',
};

export const MESSAGE_VALUE_UNDEFINED: Message = {
  success: false,
  message: 'Values are INVALID!',
};

export const MESSAGE_FORBIDDEN_NOT_OWNER: Message = {
  success: false,
  message: 'You are not the owner!',
};
