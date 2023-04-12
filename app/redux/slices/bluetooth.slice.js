import {createSlice} from '@reduxjs/toolkit';
const initialState = {
  status: null,
  devices: [],
  currentDevices: [],
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
    updateRSSI(state, action) {
      const {uuid, rssi} = action.payload;
      state.devices.map(d => {
        if (d.uuid !== uuid) {
          d.rssi = rssi;
        }
        return d;
      });
    },
    addCurrentDevice(state, action) {
      const {uuid} = action.payload;
      if (state.currentDevices.some(d => d.uuid === uuid)) {
        console.log('sssssssssss');
        return;
      }
      state.currentDevices.push({uuid, chars: []});
      console.log('sssssssssss', action.payload, uuid, state.currentDevices);
    },
    removeCurrentDevice(state, action) {
      const {uuid} = action.payload;
      state.currentDevices = state.currentDevices.filter(d => d.uuid !== uuid);
    },
    characteristicDiscovered(state, action) {
      const {uuid, charUUID} = action.payload;
      state.currentDevices.map(d => {
        if (d.uuid === uuid) {
          d.chars = [...d.chars, {uuid: charUUID}];
        }
        return d;
      });
    },
    characteristicRead(state, action) {
      const {uuid, charUUID, value} = action.payload;
      state.currentDevices.map(d => {
        if (d.uuid === uuid) {
          d.chars.map(c => {
            if (c.uuid === charUUID) {
              c.value = value;
            }
            return c;
          });
        }
        return d;
      });
    },
    characteristicReadFailed(state, action) {
      const {uuid, charUUID} = action.payload;
      state.currentDevices.map(d => {
        if (d.uuid === uuid) {
          d.chars.map(c => {
            if (c.uuid === charUUID) {
              c.value = undefined;
            }
            return c;
          });
        }
        return d;
      });
    },
    characteristicUpdates(state, action) {
      const {uuid, charUUID, enable, value} = action.payload;
      state.currentDevices.map(d => {
        if (d.uuid === uuid) {
          d.chars.map(c => {
            if (c.uuid === charUUID) {
              c.value = value;
              c.notification = enable;
            }
            return c;
          });
        }
        return d;
      });
    },
    characteristicChangeNotification(state, action) {
      const {uuid, charUUID, enable} = action.payload;
      state.currentDevices.map(d => {
        if (d.uuid === uuid) {
          d.chars.map(c => {
            if (c.uuid === charUUID) {
              c.notification = enable;
            }
            return c;
          });
        }
        return d;
      });
    },
  },
});

export const {
  updateStatus,
  clearDevices,
  addDevice,
  updateRSSI,
  addCurrentDevice,
  removeCurrentDevice,
  characteristicDiscovered,
  characteristicRead,
  characteristicReadFailed,
  characteristicChangeNotification,
  characteristicUpdates,
} = bluetoothSlice.actions;
export default bluetoothSlice.reducer;
