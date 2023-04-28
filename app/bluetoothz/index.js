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
  deviceConnected,
  deviceDisconnected,
  characteristicDiscovered,
  characteristicRead,
  characteristicReadFailed,
  characteristicChangeNotification,
  characteristicUpdates,
  deviceReady,
  connectingDevice,
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
  BLE_PERIPHERAL_READY,
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
  BLE_PERIPHERAL_READY,
  BLE_PERIPHERAL_CHARACTERISTIC_READ_FAILED,
  BLE_PERIPHERAL_CHARACTERISTIC_WRITE_OK,
  BLE_PERIPHERAL_CHARACTERISTIC_WRITE_FAILED,
  BLE_PERIPHERAL_NOTIFICATION_UPDATES,
  BLE_PERIPHERAL_ENABLE_NOTIFICATION_FAILED,
  BLE_PERIPHERAL_NOTIFICATION_CHANGED,
};
// This event emitter will be responsible of ALL bluetooth event
const eventEmitter = new NativeEventEmitter(BluetoothZ);
// console.log(' ========== >', BluetoothZ);

class BluetoothService {
  addListeners() {
    /// BLE_ADAPTER_STATUS_DID_UPDATE
    /// event = {status}
    eventEmitter.addListener(BLE_ADAPTER_STATUS_DID_UPDATE, event => {
      console.log('stato cambiato', event);
      store.dispatch(updateStatus(event));
    });
    /// BLE_PERIPHERAL_FOUND
    /// event = {uuid, name, rssi}
    eventEmitter.addListener(BLE_PERIPHERAL_FOUND, event => {
      // console.log('received device ', {uuid});
      store.dispatch(addDevice(event));
    });
    /// BLE_PERIPHERAL_READ_RSSI
    /// event = {uuid, rssi}
    eventEmitter.addListener(BLE_PERIPHERAL_READ_RSSI, event => {
      console.log('RSSI ', event);
      store.dispatch(updateRSSI(event));
    });
    /// BLE_PERIPHERAL_CONNECTED
    /// event = {uuid}
    eventEmitter.addListener(BLE_PERIPHERAL_CONNECTED, event => {
      this.autoReconnect = null;
      console.log('!! BLE_PERIPHERAL_CONNECTED ', event);
      clearTimeout(this.connectionTimer);
      this.connectionTimer = setTimeout(() => {
        const {uuid} = event;
        console.log('====> 1 TIMEOUT CONNECTION', uuid);
        this.autoReconnect = null;
        this.cancel(uuid);
      }, 10000);
      store.dispatch(deviceConnected(event));
    });
    /// BLE_PERIPHERAL_READY
    /// event = {uuid}
    eventEmitter.addListener(BLE_PERIPHERAL_READY, event => {
      console.log('!! BLE_PERIPHERAL_READY ', event);
      clearTimeout(this.connectionTimer);
      this.connectionTimer = null;
      store.dispatch(deviceReady({uuid: event.uuid}));
    });
    /// BLE_PERIPHERAL_DISCONNECTED
    /// event = {uuid, warning?}
    eventEmitter.addListener(BLE_PERIPHERAL_DISCONNECTED, event => {
      console.log('x BLE_PERIPHERAL_DISCONNECTED ', this.autoReconnect);
      if (this.autoReconnect !== null && this.autoReconnect.count > 0) {
        this.autoReconnect.count = this.autoReconnect.count - 1;
        this.connect(event.uuid);
      } else {
        this.autoReconnect = null;
        clearTimeout(this.connectionTimer);
        this.connectionTimer = null;
        store.dispatch(deviceDisconnected(event));
      }
    });
    /// BLE_PERIPHERAL_CONNECT_FAILED
    /// event = {uuid, error}
    eventEmitter.addListener(BLE_PERIPHERAL_CONNECT_FAILED, event => {
      this.autoReconnect = null;
      clearTimeout(this.connectionTimer);
      this.connectionTimer = null;
      console.log('x BLE_PERIPHERAL_CONNECT_FAILED ', event);
      store.dispatch(deviceDisconnected(event));
    });
    /// BLE_PERIPHERAL_CHARACTERISTIC_DISCOVERED
    /// event = {uuid, charUUID}
    eventEmitter.addListener(
      BLE_PERIPHERAL_CHARACTERISTIC_DISCOVERED,
      event => {
        // console.log('!! BLE_PERIPHERAL_CHARACTERISTIC_DISCOVERED ', event);
        clearTimeout(this.connectionTimer);
        this.connectionTimer = setTimeout(() => {
          const {uuid} = event;
          console.log('====> 2 TIMEOUT CONNECTION', uuid);
          this.autoReconnect = null;
          this.cancel(uuid);
        }, 10000);
        store.dispatch(characteristicDiscovered(event));
      },
    );
    /// BLE_PERIPHERAL_CHARACTERISTIC_READ_OK
    /// event = {uuid, charUUID, value}
    eventEmitter.addListener(BLE_PERIPHERAL_CHARACTERISTIC_READ_OK, event => {
      console.log('!! BLE_PERIPHERAL_CHARACTERISTIC_READ_OK ', event);
      store.dispatch(characteristicRead(event));
    });
    /// BLE_PERIPHERAL_CHARACTERISTIC_READ_FAILED
    /// event = {uuid, charUUID, warning?}
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
    /// BLE_PERIPHERAL_NOTIFICATION_UPDATES
    /// event = {uuid, charUUID, value}
    eventEmitter.addListener(BLE_PERIPHERAL_NOTIFICATION_UPDATES, event => {
      // console.log('!! BLE_PERIPHERAL_NOTIFICATION_UPDATES ', event);
      store.dispatch(characteristicUpdates(event));
    });
    /// BLE_PERIPHERAL_NOTIFICATION_CHANGED
    /// event = {uuid, charUUID, enable}
    eventEmitter.addListener(BLE_PERIPHERAL_NOTIFICATION_CHANGED, event => {
      // console.log('!! BLE_PERIPHERAL_NOTIFICATION_CHANGED ', event);
      store.dispatch(characteristicChangeNotification(event));
    });
    /// BLE_PERIPHERAL_ENABLE_NOTIFICATION_FAILED
    /// event = {uuid, charUUID, warning?}
    eventEmitter.addListener(
      BLE_PERIPHERAL_ENABLE_NOTIFICATION_FAILED,
      event => {
        console.log('x BLE_PERIPHERAL_ENABLE_NOTIFICATION_FAILED ', event);
        store.dispatch(characteristicChangeNotification(event));
        // if (onFailToConnect) onFailToConnect();
      },
    );
  }

  constructor() {
    console.log('\n\n\n INITIALIZE \n\n\n');
    this.autoReconnect = null;
    this.connectionTimer = null;
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
  connect(uuid, keepConnection) {
    console.log('====> CONNECT', uuid);
    store.dispatch(connectingDevice({uuid}));
    BluetoothZ.connect(uuid);
    clearTimeout(this.connectionTimer);
    this.connectionTimer = setTimeout(() => {
      console.log('====> TIMEOUT CONNECTION', uuid);
      this.autoReconnect = null;
      this.cancel(uuid);
    }, 10000);
    if (keepConnection && this.autoReconnect === null) {
      this.autoReconnect = {
        count: 5,
      };
    }
  }

  /**
   *
   * @param {*} uuid => address of devic to connect
   */
  cancel(uuid) {
    console.log('====> CANCEL CONN', uuid);
    BluetoothZ.cancel(uuid);
  }

  /**
   *
   * @param {*} uuid => address of devic to connect
   */
  disconnect(uuid) {
    console.log('====> DISCONNECT', uuid);
    BluetoothZ.disconnect(uuid);
  }

  /**
   *
   * @param {*} uuid => address of devic to connect
   */
  readCharacteristic(uuid, charUUID) {
    console.log('====> READ', charUUID);
    BluetoothZ.readCharacteristicValue(uuid, charUUID);
  }

  /**
   *
   * @param {*} uuid => address of devic to connect
   */
  changeCharacteristicNotification(uuid, charUUID, enable) {
    console.log('====> ENABLE', charUUID, enable);
    BluetoothZ.changeCharacteristicNotification(uuid, charUUID, enable);
  }
}

module.exports.BluetoothService = new BluetoothService();
