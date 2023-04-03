import {createSlice} from '@reduxjs/toolkit';

const bluetoothSlice = createSlice({
  name: 'bluetooth',
  initialState: {
    status: null,
    devices: [],
  },
  reducers: {
    updateStatus(state, action) {
      state.status = action.payload;
    },
    addDevice(state, action) {
      // const {name, rssi} = action.payload;
      state.devices = [...state.devices, action.payload];
    },
  },
});

export const {updateStatus, addDevice} = bluetoothSlice.actions;
export default bluetoothSlice.reducer;
