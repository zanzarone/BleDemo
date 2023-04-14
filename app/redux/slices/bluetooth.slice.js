import {createSlice} from '@reduxjs/toolkit';
const initialState = {
  status: null,
  devices: [],
  // connectedDevices: [],
};

const bluetoothSlice = createSlice({
  name: 'bluetooth',
  initialState,
  reducers: {
    /**
     *
     * @param {*} state
     * @param {*} action
     */
    updateStatus(state, action) {
      const {status} = action.payload;
      state.status = status;
    },
    /**
     *
     * @param {*} state
     * @param {*} action
     */
    clearDevices(state, action) {
      let devices = [...state.devices];
      devices = devices.filter(d => d.ready);
      state.devices = devices;
    },
    /**
     *
     * @param {*} state
     * @param {*} action
     */
    addDevice(state, action) {
      const {uuid} = action.payload;
      let devs = state.devices.filter(d => d.uuid !== uuid);
      devs.push(action.payload);
      devs.sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));
      state.devices = devs;
    },
    /**
     *
     * @param {*} state
     * @param {*} action
     */
    updateRSSI(state, action) {
      const {uuid, rssi} = action.payload;
      let devices = [...state.devices];
      devices.map(d => {
        if (d.uuid === uuid) {
          d.rssi = rssi;
        }
        return d;
      });
      state.devices = devices;
    },
    /**
     *
     * @param {*} state
     * @param {*} action
     */
    connectingDevice(state, action) {
      const {uuid} = action.payload;
      let devices = [...state.devices];
      devices.map(d => {
        if (d.uuid === uuid) {
          d.ready = null;
          d.chars = [];
        }
        return d;
      });
      state.devices = devices;
    },
    /**
     *
     * @param {*} state
     * @param {*} action
     */
    deviceConnected(state, action) {
      const {uuid} = action.payload;
      let devices = [...state.devices];
      devices.map(d => {
        if (d.uuid === uuid) {
          d.ready = false;
        }
        return d;
      });
      state.devices = devices;
    },
    /**
     *
     * @param {*} state
     * @param {*} action
     */
    deviceReady(state, action) {
      const {uuid} = action.payload;
      let devices = [...state.devices];
      devices.map(d => {
        if (d.uuid === uuid) {
          d.ready = true;
        }
        return d;
      });
      state.devices = devices;
    },
    /**
     *
     * @param {*} state
     * @param {*} action
     */
    deviceDisconnected(state, action) {
      const {uuid} = action.payload;
      let devices = [...state.devices];
      devices.map(d => {
        if (d.uuid === uuid) {
          d.ready = undefined;
          d.chars = [];
        }
        return d;
      });
      state.devices = devices;
    },
    /**
     *
     * @param {*} state
     * @param {*} action
     */
    characteristicDiscovered(state, action) {
      const {uuid, charUUID} = action.payload;
      let devices = [...state.devices];
      devices.map(d => {
        if (d.uuid === uuid) {
          d.chars = [...d.chars, {uuid: charUUID}];
        }
        return d;
      });
      state.devices = devices;
    },
    /**
     *
     * @param {*} state
     * @param {*} action
     */
    characteristicRead(state, action) {
      const {uuid, charUUID, value} = action.payload;
      let devices = [...state.devices];
      devices.map(d => {
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
      state.devices = devices;
    },
    /**
     *
     * @param {*} state
     * @param {*} action
     */
    characteristicReadFailed(state, action) {
      const {uuid, charUUID} = action.payload;
      let devices = [...state.devices];
      devices.map(d => {
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
      state.devices = devices;
    },
    /**
     *
     * @param {*} state
     * @param {*} action
     */
    characteristicUpdates(state, action) {
      const {uuid, charUUID, enable, value} = action.payload;
      let devices = [...state.devices];
      devices.map(d => {
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
      state.devices = devices;
    },
    /**
     *
     * @param {*} state
     * @param {*} action
     */
    characteristicChangeNotification(state, action) {
      const {uuid, charUUID, enable} = action.payload;
      let devices = [...state.devices];
      devices.map(d => {
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
      state.devices = devices;
    },
  },
});

export const {
  updateStatus,
  clearDevices,
  addDevice,
  updateRSSI,
  deviceConnected,
  deviceDisconnected,
  characteristicDiscovered,
  characteristicRead,
  characteristicReadFailed,
  characteristicChangeNotification,
  characteristicUpdates,
  deviceReady,
  connectingDevice,
} = bluetoothSlice.actions;
export default bluetoothSlice.reducer;
