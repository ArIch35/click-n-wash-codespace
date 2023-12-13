import { combineReducers } from '@reduxjs/toolkit';
import notificationReducer from './notification.reducer';

const rootReducer = combineReducers({
  notificationState: notificationReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
