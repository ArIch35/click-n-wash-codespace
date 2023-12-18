import { combineReducers } from '@reduxjs/toolkit';
import notificationReducer from './notification.reducer';
import authenticationReducer from './authentication.reducer';

const rootReducer = combineReducers({
  notificationState: notificationReducer,
  authenticationState: authenticationReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
