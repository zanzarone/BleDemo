import {createSlice} from '@reduxjs/toolkit';
const initialState = {
  status: null,
  devices: [],
  connectedDevices: [],
};

const bluetoothSlice = createSlice({
  name: 'bluetooth',
  initialState,
  reducers: {
    updateStatus(state, action) {
      const {status} = action.payload;
      state.status = status;
    },
    clearDevices(state, action) {
      state.devices = initialState.devices;
    },
    addDevice(state, action) {
      const {uuid} = action.payload;
      let devs = state.devices.filter(d => d.uuid !== uuid);
      devs.push(action.payload);
      devs.sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));
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
    connectingDevice(state, action) {
      const {uuid} = action.payload;
      // if (state.connectedDevices.some(d => d.uuid === uuid)) {
      //   console.log('sssssssssss');
      //   return;
      // }
      state.connectedDevices.push({uuid, chars: [], ready: null});
      console.log('sssssssssss', action.payload, uuid, state.connectedDevices);
    },
    addCurrentDevice(state, action) {
      const {uuid} = action.payload;
      // if (state.connectedDevices.some(d => d.uuid === uuid)) {
      //   console.log('sssssssssss');
      //   return;
      // }
      state.connectedDevices.map(d => {
        if (d.uuid === uuid) {
          d.ready = false;
        }
        return d;
      });
      console.log('sssssssssss', action.payload, uuid, state.connectedDevices);
    },
    currentDeviceReady(state, action) {
      const {uuid} = action.payload;
      state.connectedDevices.map(d => {
        if (d.uuid === uuid) {
          d.ready = true;
        }
        return d;
      });
    },
    removeCurrentDevice(state, action) {
      const {uuid} = action.payload;
      state.connectedDevices = state.connectedDevices.filter(
        d => d.uuid !== uuid,
      );
    },
    characteristicDiscovered(state, action) {
      const {uuid, charUUID} = action.payload;
      state.connectedDevices.map(d => {
        if (d.uuid === uuid) {
          d.chars = [...d.chars, {uuid: charUUID}];
        }
        return d;
      });
    },
    characteristicRead(state, action) {
      const {uuid, charUUID, value} = action.payload;
      state.connectedDevices.map(d => {
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
      state.connectedDevices.map(d => {
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
      state.connectedDevices.map(d => {
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
      state.connectedDevices.map(d => {
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
  currentDeviceReady,
  connectingDevice,
} = bluetoothSlice.actions;
export default bluetoothSlice.reducer;
