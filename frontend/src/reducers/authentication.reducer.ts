import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import User from '../interfaces/entities/user';

interface Auth {
  token: string;
  providerId: string;
}

interface AuthenticationState {
  firebaseData: Auth | null;
  user: User | null;
  registeredName: string;
}

const initialState: AuthenticationState = {
  firebaseData: null,
  user: null,
  registeredName: '',
};

const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<Auth | null>) {
      state.firebaseData = action.payload;
    },
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    setRegisteredName(state, action: PayloadAction<string>) {
      state.registeredName = action.payload;
    },
  },
});

export const { setAuth, setUser, setRegisteredName } = authenticationSlice.actions;

export default authenticationSlice.reducer;
