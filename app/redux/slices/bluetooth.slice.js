import {createSlice} from '@reduxjs/toolkit';

const bluetoothSlice = createSlice({
  name: 'bluetooth',
  initialState: {
    status: null,
    devices: [],
    currentDevice: null,
  },
  reducers: {
    updateStatus(state, action) {
      state.status = action.payload;
    },
    clearDevices(state, action) {
      state.devices = [];
    },
    addDevice(state, action) {
      const {uuid} = action.payload;
      let devs = state.devices.filter(d => d.uuid !== uuid);
      devs.push(action.payload);
      state.devices = devs;
    },
    addCurrentDevice(state, action) {
      state.currentDevice = {uuid: action.payload};
    },
    removeCurrentDevice(state, action) {
      state.currentDevice = null;
    },
  },
});

export const {
  updateStatus,
  clearDevices,
  addDevice,
  addCurrentDevice,
  removeCurrentDevice,
} = bluetoothSlice.actions;
export default bluetoothSlice.reducer;
