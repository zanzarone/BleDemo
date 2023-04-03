import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const testSlice = createSlice({
  name: 'message',
  initialState: {
    message: 'Initial message',
  },
  reducers: {
    setMessage(state, action) {
      state.message = action.payload;
    },
  },
});

export const {setMessage} = testSlice.actions;
export default testSlice.reducer;
