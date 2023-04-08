import {createSlice} from '@reduxjs/toolkit';
const initialState = {
  status: null,
  devices: [],
  currentDevice: {
    uuid: null,
    chars: {},
  },
};

const bluetoothSlice = createSlice({
  name: 'bluetooth',
  initialState,
  reducers: {
    updateStatus(state, action) {
      state.status = action.payload;
    },
    clearDevices(state, action) {
      state.devices = initialState.devices;
    },
    addDevice(state, action) {
      const {uuid} = action.payload;
      let devs = state.devices.filter(d => d.uuid !== uuid);
      devs.push(action.payload);
      state.devices = devs;
    },
    addCurrentDevice(state, action) {
      state.currentDevice.uuid = action.payload;
    },
    removeCurrentDevice(state, action) {
      state.currentDevice = initialState.currentDevice;
    },
    characteristicDiscovered(state, action) {
      const {uuid, charUUID} = action.payload;
      console.log(' PIPPO ', uuid, charUUID, state.currentDevice);
      state.currentDevice.chars[uuid] = {notification: false};
    },
    characteristicRead(state, action) {
      const {uuid, charUUID, value} = action.payload;
      state.currentDevice.chars[charUUID] = {value, notification: false};
    },
    characteristicReadFailed(state, action) {
      const {uuid, charUUID} = action.payload;
      state.currentDevice.chars[charUUID] = null;
    },
    characteristicUpdates(state, action) {
      const {uuid, charUUID, enable, value} = action.payload;
      state.currentDevice.chars[charUUID] = {value, notification: enable};
    },
    characteristicChangeNotification(state, action) {
      const {uuid, charUUID, enable} = action.payload;
      state.currentDevice.chars[charUUID].notification = enable;
    },
  },
});

export const {
  updateStatus,
  clearDevices,
  addDevice,
  addCurrentDevice,
  removeCurrentDevice,
  characteristicDiscovered,
  characteristicRead,
  characteristicReadFailed,
  characteristicChangeNotification,
  characteristicUpdates,
} = bluetoothSlice.actions;
export default bluetoothSlice.reducer;
