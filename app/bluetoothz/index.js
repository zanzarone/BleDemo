import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import {store} from '../redux/store';
import {
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
} from '../redux/slices/bluetooth.slice';
// import our BLE native module
const {BluetoothZ} = NativeModules;
// console.log(BluetoothZ);
const {
  BLE_ADAPTER_STATUS_DID_UPDATE,
  BLE_PERIPHERAL_FOUND,
  BLE_ADAPTER_STATUS_POWERED_ON,
  BLE_ADAPTER_STATUS_POWERED_OFF,
  BLE_ADAPTER_STATUS_INVALID,
  BLE_ADAPTER_STATUS_UNKNOW,
  BLE_PERIPHERAL_CONNECTED,
  BLE_PERIPHERAL_DISCONNECTED,
  BLE_PERIPHERAL_CONNECT_FAILED,
  BLE_PERIPHERAL_CHARACTERISTIC_DISCOVERED,
  BLE_PERIPHERAL_CHARACTERISTIC_READ_OK,
  BLE_PERIPHERAL_CHARACTERISTIC_READ_FAILED,
  BLE_PERIPHERAL_CHARACTERISTIC_WRITE_OK,
  BLE_PERIPHERAL_CHARACTERISTIC_WRITE_FAILED,
  BLE_PERIPHERAL_NOTIFICATION_UPDATES,
  BLE_PERIPHERAL_ENABLE_NOTIFICATION_FAILED,
  BLE_PERIPHERAL_NOTIFICATION_CHANGED,
  BLE_PERIPHERAL_READ_RSSI,
} = BluetoothZ.getConstants();

module.exports.defines = {
  BLE_ADAPTER_STATUS_DID_UPDATE,
  BLE_PERIPHERAL_FOUND,
  BLE_ADAPTER_STATUS_POWERED_ON,
  BLE_ADAPTER_STATUS_POWERED_OFF,
  BLE_ADAPTER_STATUS_INVALID,
  BLE_ADAPTER_STATUS_UNKNOW,
  BLE_PERIPHERAL_CONNECTED,
  BLE_PERIPHERAL_DISCONNECTED,
  BLE_PERIPHERAL_CONNECT_FAILED,
  BLE_PERIPHERAL_CHARACTERISTIC_DISCOVERED,
  BLE_PERIPHERAL_CHARACTERISTIC_READ_OK,
  BLE_PERIPHERAL_CHARACTERISTIC_READ_FAILED,
  BLE_PERIPHERAL_CHARACTERISTIC_WRITE_OK,
  BLE_PERIPHERAL_CHARACTERISTIC_WRITE_FAILED,
  BLE_PERIPHERAL_NOTIFICATION_UPDATES,
  BLE_PERIPHERAL_ENABLE_NOTIFICATION_FAILED,
  BLE_PERIPHERAL_NOTIFICATION_CHANGED,
};
// This event emitter will be responsible of ALL bluetooth event
const eventEmitter = new NativeEventEmitter(BluetoothZ);
console.log(' ========== >', BluetoothZ);

class BluetoothService {
  addListeners() {
    /// Initializing bluetooth native module
    eventEmitter.addListener(BLE_ADAPTER_STATUS_DID_UPDATE, event => {
      console.log('stato cambiato', event);
      store.dispatch(updateStatus(event.status));
    });
    /// Initializing bluetooth native module
    eventEmitter.addListener(BLE_PERIPHERAL_FOUND, event => {
      console.log('received device ', event);
      store.dispatch(addDevice(event));
    });
    /// Initializing bluetooth native module
    eventEmitter.addListener(BLE_PERIPHERAL_READ_RSSI, event => {
      console.log('RSSI ', event);
      store.dispatch(updateRSSI(event));
    });
    /// Initializing bluetooth native module
    eventEmitter.addListener(BLE_PERIPHERAL_CONNECTED, event => {
      if (this.autoReconnect?.watcher)
        clearTimeout(this.autoReconnect?.watcher);
      this.autoReconnect = null;
      console.log('!! BLE_PERIPHERAL_CONNECTED ', event);
      store.dispatch(addCurrentDevice({uuid: event.uuid}));
    });
    /// Initializing bluetooth native module
    eventEmitter.addListener(BLE_PERIPHERAL_DISCONNECTED, event => {
      console.log('x BLE_PERIPHERAL_DISCONNECTED ', this.autoReconnect);
      if (this.autoReconnect !== null && this.autoReconnect.count > 0) {
        clearTimeout(this.autoReconnect?.watcher);
        this.autoReconnect = {
          count: this.autoReconnect.count - 1,
          watcher: setTimeout(() => this.disconnect({uuid: event.uuid}), 3000),
        };
        BluetoothZ.connect(event.uuid);
      } else {
        if (this.autoReconnect?.watcher)
          clearTimeout(this.autoReconnect?.watcher);
        this.autoReconnect = null;
        store.dispatch(removeCurrentDevice({uuid: event.uuid}));
      }
    });
    /// Initializing bluetooth native module
    eventEmitter.addListener(BLE_PERIPHERAL_CONNECT_FAILED, event => {
      if (this.autoReconnect?.watcher)
        clearTimeout(this.autoReconnect?.watcher);
      this.autoReconnect = null;
      console.log('x BLE_PERIPHERAL_CONNECT_FAILED ', event);
      store.dispatch(removeCurrentDevice({uuid: event.uuid}));
    });
    /// Initializing bluetooth native module
    eventEmitter.addListener(
      BLE_PERIPHERAL_CHARACTERISTIC_DISCOVERED,
      event => {
        console.log('!! BLE_PERIPHERAL_CHARACTERISTIC_DISCOVERED ', event);
        store.dispatch(
          characteristicDiscovered({
            uuid: event.uuid,
            charUUID: event.charUUID,
          }),
        );
      },
    );
    /// Initializing bluetooth native module
    eventEmitter.addListener(BLE_PERIPHERAL_CHARACTERISTIC_READ_OK, event => {
      console.log('!! BLE_PERIPHERAL_CHARACTERISTIC_READ_OK ', event);
      store.dispatch(
        characteristicRead({
          uuid: event.uuid,
          charUUID: event.charUUID,
          value: event.value,
        }),
      );
    });
    /// Initializing bluetooth native module
    eventEmitter.addListener(
      BLE_PERIPHERAL_CHARACTERISTIC_READ_FAILED,
      event => {
        console.log('x BLE_PERIPHERAL_CHARACTERISTIC_READ_FAILED ', event);
        store.dispatch(
          characteristicReadFailed({
            uuid: event.uuid,
            charUUID: event.charUUID,
          }),
        );
      },
    );
    eventEmitter.addListener(BLE_PERIPHERAL_NOTIFICATION_UPDATES, event => {
      console.log('!! BLE_PERIPHERAL_NOTIFICATION_UPDATES ', event);
      store.dispatch(
        characteristicUpdates({
          uuid: event.uuid,
          charUUID: event.charUUID,
          value: event.value,
          enable: true,
        }),
      );
      // if (onConnected) onConnected(event.uuid);
    });
    eventEmitter.addListener(BLE_PERIPHERAL_NOTIFICATION_CHANGED, event => {
      console.log('!! BLE_PERIPHERAL_NOTIFICATION_CHANGED ', event);
      store.dispatch(
        characteristicUpdates({
          uuid: event.uuid,
          charUUID: event.charUUID,
          enable: event.enable,
        }),
      );
      // if (onConnected) onConnected(event.uuid);
    });
    this.bleFailToEnableUpdatesListener = eventEmitter.addListener(
      BLE_PERIPHERAL_ENABLE_NOTIFICATION_FAILED,
      event => {
        console.log('x BLE_PERIPHERAL_ENABLE_NOTIFICATION_FAILED ', event);
        store.dispatch(
          characteristicChangeNotification({
            uuid: event.uuid,
            charUUID: event.charUUID,
            enable: false,
          }),
        );
        // if (onFailToConnect) onFailToConnect();
      },
    );
  }

  constructor() {
    console.log('\n\n\n INITIALIZE \n\n\n');
    this.autoReconnect = null;
    // adding the listner on Bluetooth status change
    this.addListeners();
    /// Initializing bluetooth native module
    BluetoothZ.setup();
  }

  /**
   * get status of the bluetooth
   */
  async getStatus() {
    try {
      const {status} = await BluetoothZ.status();
      store.dispatch(updateStatus(status));
    } catch (error) {
      store.dispatch(updateStatus(null));
    }
  }

  /**
   * get status of the bluetooth
   */
  async clearAllDevices() {
    store.dispatch(clearDevices());
  }

  /**
   *
   * @param {function} onEnd => callback for scan finished event
   * @param {array} services => array of UUID to scan
   * @param {string} filter => filter of allowed devices
   * @param {int} timeout => scan interval
   */
  startScan(onEnd, services, filter, timeout) {
    console.log('====> START SCAN');
    store.dispatch(clearDevices());
    BluetoothZ.startScan(services, filter);
    timeout = !timeout ? 5000 : timeout;
    setTimeout(() => this.stopScan(onEnd), timeout);
  }

  /**
   *
   * @param {function} onEnd => callback for scan finished event
   */
  stopScan(onEnd) {
    console.log('====> STOP SCAN');
    BluetoothZ.stopScan();
    if (onEnd) {
      onEnd();
    }
  }

  /**
   *
   * @param {*} uuid => address of devic to connect
   */
  async connect(uuid, keepConnection) {
    console.log('====> CONNECT', uuid);
    BluetoothZ.connect(uuid);
    if (keepConnection && this.autoReconnect === null) {
      this.autoReconnect = {
        count: 5,
        watcher: setTimeout(() => this.connect(uuid, keepConnection), 3000),
      };
    }
  }

  /**
   *
   * @param {*} uuid => address of devic to connect
   */
  async disconnect(uuid) {
    console.log('====> DISCONNECT', uuid);
    BluetoothZ.disconnect(uuid);
  }

  /**
   *
   * @param {*} uuid => address of devic to connect
   */
  async readCharacteristic(uuid, charUUID) {
    console.log('====> READ', charUUID);
    BluetoothZ.readCharacteristicValue(uuid, charUUID);
  }

  /**
   *
   * @param {*} uuid => address of devic to connect
   */
  async changeCharacteristicNotification(uuid, charUUID, enable) {
    console.log('====> ENABLE', charUUID, enable);
    BluetoothZ.changeCharacteristicNotification(uuid, charUUID, enable);
  }
}

module.exports.BluetoothService = new BluetoothService();
