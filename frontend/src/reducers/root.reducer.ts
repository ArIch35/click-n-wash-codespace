import { combineReducers } from '@reduxjs/toolkit';
import authenticationReducer from './authentication.reducer';

const rootReducer = combineReducers({
  authenticationState: authenticationReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
