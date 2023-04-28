import {createSlice} from '@reduxjs/toolkit';
const {Buffer} = require('buffer');

const CharacteristicUUIDs = Object.freeze({
  MODEL_NUMBER: '00002a24-0000-1000-8000-00805f9b34fb',
  SERIAL_NUMBER: '00002a25-0000-1000-8000-00805f9b34fb',
  FIRMWARE_REVISION: '00002a26-0000-1000-8000-00805f9b34fb',
  HARDWARE_REVISION: '00002a27-0000-1000-8000-00805f9b34fb',
  SOFTWARE_REVISION: '00002a28-0000-1000-8000-00805f9b34fb',
  MANUFACTURER_NAME: '00002a29-0000-1000-8000-00805f9b34fb',
  // BATTERY_LEVEL: '00002a19-0000-1000-8000-00805f9b34fb',
  CONTROL_POINT: '00002a66-0000-1000-8000-00805f9b34fb',
  SRM_CTRL_POINT: '7f510010-1b15-11e5-b60b-1697f925ec7b',
  SRM_OFFSET: '7f510004-1b15-11e5-b60b-1697f925ec7b',
  SRM_TEMPERATURE: '7f510005-1b15-11e5-b60b-1697f925ec7b',
  TIME_SYNC: '7f51000a-1b15-11e5-b60b-1697f925ec7b',
  SRM_BATTERY_STATUS: '7f510017-1b15-11e5-b60b-1697f925ec7b',
  // SRM_DUAL_FORCE_ANGLE_TIMESTAMP: '7f510019-1b15-11e5-b60b-1697f925ec7b',
  SRM_TORQUE_ANGLE_VELOCITY_TIMESTAMP: '7f510018-1b15-11e5-b60b-1697f925ec7b',
  SRM_MEASUREMENT: '7f510050-1b15-11e5-b60b-1697f925ec7b',
  MEASUREMENT: '00002a63-0000-1000-8000-00805f9b34fb',
});

const revolution = {
  lastAccumulatedCrankTime: undefined,
  lastCadenceEventCount: undefined,
  lastAngle: -1,
  values: [], //Array(360).fill(undefined),
};

function revolutionUpdate(element) {
  const {torqueValues} = element;
  let values = [...revolution.values];
  let lastAngle = revolution.lastAngle;
  let lastValues = [];

  for (let i = 0; i < torqueValues.length; i++) {
    const data = torqueValues[i];
    const angle = data.angle;
    let a = angle - lastAngle;
    if (a === 0) continue;
    let b = Math.abs(a);
    let c = Math.min(360 - b, b);
    // let d = c - 1
    let e = a >= 0 ? 1 : -1;
    let f = b == c ? 1 : -1;
    let direction = f * e;
    /// pedalo avanti
    if (direction > 0) {
      // console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ AVANTI');
      if (data.angle < lastAngle) {
        console.log(
          '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ A',
          data.angle,
          lastAngle,
        );
        // Emitter.emit(EmitterSignal.REVOLUTION_DID_UPDATE, {
        lastValues = [...revolution.values];
        // ,
        // });
        values = [];
      } else {
        // console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ B', data.angle, lastAngle);
      }
      values.push(data);
      lastAngle = data.angle;
    }
    /// pedalo indietro
    else {
      // console.log('####################################### INDIETRO');
      if (data.angle <= lastAngle) {
        // console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ C', data.angle, lastAngle);
        values = values.filter(item => item.angle < data.angle);
      } else {
        // console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ D', data.angle, lastAngle);
        values = [];
      }
      // values.push(data);
      lastAngle = data.angle;
    }
  }
  revolution.lastAccumulatedCrankTime = element.accumulatedCrankTime;
  revolution.lastCadenceEventCount = element.cadence;
  revolution.lastAngle = lastAngle;
  revolution.values = values;
  return lastValues;
}

function extractData({charUUID, raw}) {
  // console.log(
  //   'SOOOOOOOAASDASDASKDJKLASDJKASDKLAJDKL',
  //   charUUID,
  //   CharacteristicUUIDs.SRM_TORQUE_ANGLE_VELOCITY_TIMESTAMP,
  //   buff,
  //   );
  charUUID = charUUID.toLowerCase();
  let result = [];
  switch (charUUID) {
    case CharacteristicUUIDs.SRM_TORQUE_ANGLE_VELOCITY_TIMESTAMP: {
      let buff = Buffer.from(raw, 'hex');
      // const element = new TorqueTimestampElement();
      // console.log('===================> ', buff.toString('hex'));
      const cadenceEventCount = buff.readUInt8(0);
      const accumulatedCrankTime = buff.readUInt16LE(1);
      const torqueValues = [];
      const count = buff.readUInt8(3);
      // console.log('===================> count', count);
      for (let i = 0; i < count; i++) {
        const base = i * 10;
        const accumulatedTimestamp = buff.readUInt32LE(base + 4);
        const torque = buff.readInt16LE(base + 8);
        const angle = buff.readUInt16LE(base + 10);
        const angularVelocity = buff.readInt16LE(base + 12);
        // console.log(
        //   '===================> val',
        //   i,
        //   base,
        //   accumulatedTimestamp,
        //   torque,
        //   angle,
        //   angularVelocity,
        // );
        torqueValues.push({
          accumulatedTimestamp,
          torque: Math.round((torque / 32) * 10) / 10,
          angle,
          angularVelocity,
        });
      }
      const element = {cadenceEventCount, accumulatedCrankTime, torqueValues};
      // console.log('===================> cadence', element.cadence);
      // console.log(
      //   '===================> accumulatedCrankTime',
      //   element.accumulatedCrankTime,
      // );
      // console.log('===================> torqueValues ', element.torqueValues);
      // dispatch(revolutionDidUpdate({element}));
      // Emitter.emit(EmitterSignal.SRM_TORQUE_ANGLE_VELOCITY_TIMESTAMP_READY, torqueValues.length > 0 ? {value: torqueValues[0]} : {value: undefined});
      result = revolutionUpdate(element);
    }
  }
  return result;
}

const initialState = {
  status: null,
  devices: [],
  buffer: {},
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
          d.chars = [...d.chars, {uuid: charUUID, enable: false}];
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
      const {uuid, charUUID, value} = action.payload;
      if (!state.buffer.hasOwnProperty(uuid)) {
        state.buffer[uuid] = {};
      }
      if (!state.buffer[uuid].hasOwnProperty(charUUID)) {
        state.buffer[uuid][charUUID] = [];
      }
      const result = extractData({charUUID, raw: value});
      // console.log('===================================>>>>>>', result);
      if (result.length > 0) {
        state.buffer[uuid][charUUID] = result;
      }
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
      if (state.buffer.hasOwnProperty(uuid)) {
        if (state.buffer[uuid].hasOwnProperty(charUUID)) {
          state.buffer[uuid][charUUID] = [];
        }
      }
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
