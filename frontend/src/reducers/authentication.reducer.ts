import { createSlice } from '@reduxjs/toolkit';

const authenticationSlice = createSlice({
  name: 'authentication',

  initialState: {
    authToken: '',
  },

  reducers: {
    setAuthToken(state, action) {
      state.authToken = action.payload as string;
    },
  },
});

export const { setAuthToken } = authenticationSlice.actions;

export default authenticationSlice.reducer;
