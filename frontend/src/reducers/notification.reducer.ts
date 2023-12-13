import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',

  initialState: {
    userId: '',
  },

  reducers: {
    setUserId(state, action) {
      state.userId = action.payload;
    },
  },
});

export const { setUserId } = notificationSlice.actions;

export default notificationSlice.reducer;
