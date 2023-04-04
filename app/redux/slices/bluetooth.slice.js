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
      const {uuid} = action.payload;
      let devs = state.devices.filter(d => d.uuid !== uuid);
      devs.push(action.payload);
      state.devices = devs;
    },
  },
});

export const {updateStatus, addDevice} = bluetoothSlice.actions;
export default bluetoothSlice.reducer;
