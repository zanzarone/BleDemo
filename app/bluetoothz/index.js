import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import {store} from '../redux/store';
import {updateStatus, addDevice} from '../redux/slices/bluetooth.slice';

// import our BLE native module
const {BluetoothZ} = NativeModules;
console.log(BluetoothZ);
const {
  BLE_ADAPTER_STATUS_DID_UPDATE,
  BLE_PERIPHERAL_FOUND,
  BLE_PERIPHERAL_CONNECTED,
  BLE_PERIPHERAL_DISCONNECTED,
  BLE_PERIPHERAL_CONNECT_FAILED,
} = BluetoothZ.getConstants();
// This event emitter will be responsible of ALL bluetooth event
const eventEmitter = new NativeEventEmitter(BluetoothZ);
console.log(' ========== >', BluetoothZ);

class BluetoothService {
  constructor() {
    this.bleScanTimer = null;
    // adding the listner on Bluetooth status change
    this.bleScanListener = null;
    this.bleConnectedListener = null;
    this.bleDisconnectedListener = null;
    this.bleFailToConnectListener = null;
    this.bleStatusLister = eventEmitter.addListener(
      BLE_ADAPTER_STATUS_DID_UPDATE,
      event => {
        console.log(event);
        /// sincronizing the store
        store.dispatch(updateStatus(event.status));
      },
    );
    /// Initializing bluetooth native module
    BluetoothZ.setup();
  }

  /**
   * get status of the bluetooth
   */
  async getStatus() {
    try {
      const status = await BluetoothZ.status();
      store.dispatch(updateStatus(status));
    } catch (error) {
      store.dispatch(updateStatus(null));
    }
  }
  /**
   *
   * @param {function} onEnd => callback for scan finished event
   * @param {array} services => array of UUID to scan
   * @param {string} filter => filter of allowed devices
   * @param {array} options => option for the scanner
   * @param {int} timeout => scan interval
   */
  startScan(onEnd, services, filter, options, timeout) {
    console.log('====> START SCAN');
    if (this.bleScanTimer) {
      clearTimeout(this.bleScanTimer);
      this.bleScanTimer = null;
    }
    if (this.bleScanListener) {
      this.bleScanListener.remove();
    }
    this.bleScanListener = eventEmitter.addListener(
      BLE_PERIPHERAL_FOUND,
      event => {
        console.log('received device ', event);
        store.dispatch(addDevice(event));
      },
    );
    BluetoothZ.startScan(services, filter, options);
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
  async connect(uuid, onConnected, onDisconnected, onFailToConnect) {
    console.log('====> CONNECT');
    if (this.bleConnectedListener) this.bleConnectedListener.remove();
    if (this.bleDisconnectedListener) this.bleDisconnectedListener.remove();
    if (this.bleFailToConnectListener) this.bleFailToConnectListener.remove();
    try {
      this.bleConnectedListener = eventEmitter.addListener(
        BLE_PERIPHERAL_CONNECTED,
        event => {
          console.log('!! BLE_PERIPHERAL_CONNECTED ', event);
          if (onConnected) onConnected();
        },
      );
      this.bleDisconnectedListener = eventEmitter.addListener(
        BLE_PERIPHERAL_DISCONNECTED,
        event => {
          console.log('x BLE_PERIPHERAL_DISCONNECTED ', event);
          if (onDisconnected) onDisconnected();
        },
      );
      this.bleConnectedListener = eventEmitter.addListener(
        BLE_PERIPHERAL_CONNECT_FAILED,
        event => {
          console.log('x BLE_PERIPHERAL_CONNECT_FAILED ', event);
          if (onFailToConnect) onFailToConnect();
        },
      );
      await BluetoothZ.connect(uuid);
    } catch (error) {
      console.log('====> Connect error', error);
    }
  }
}

module.exports.BluetoothService = new BluetoothService();
