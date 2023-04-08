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
} = BluetoothZ.getConstants();
// This event emitter will be responsible of ALL bluetooth event
const eventEmitter = new NativeEventEmitter(BluetoothZ);
console.log(' ========== >', BluetoothZ);

class BluetoothService {
  constructor() {
    this.autoReconnect = true;
    // adding the listner on Bluetooth status change
    this.bleScanListener = null;
    this.bleConnectedListener = null;
    this.bleDisconnectedListener = null;
    this.bleFailToConnectListener = null;
    this.bleReadCharListener = null;
    this.bleFailToReadListener = null;
    this.bleUpdatesCharListener = null;
    this.bleFailToEnableUpdatesListener = null;
    console.log('\n\n\n INITIALIZE \n\n\n');
    this.bleStatusLister = eventEmitter.addListener(
      BLE_ADAPTER_STATUS_DID_UPDATE,
      event => {
        console.log('stato cambiato', event);
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
      const {status} = await BluetoothZ.status();
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
    store.dispatch(clearDevices());
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
    console.log('====> CONNECT', uuid);
    if (this.bleConnectedListener) this.bleConnectedListener.remove();
    if (this.bleDisconnectedListener) this.bleDisconnectedListener.remove();
    if (this.bleCharFoundListener) this.bleCharFoundListener.remove();
    if (this.bleFailToConnectListener) this.bleFailToConnectListener.remove();

    this.bleConnectedListener = eventEmitter.addListener(
      BLE_PERIPHERAL_CONNECTED,
      event => {
        console.log('!! BLE_PERIPHERAL_CONNECTED ', event);
        store.dispatch(addCurrentDevice(event.uuid));
        if (onConnected) onConnected(event.uuid);
      },
    );
    this.bleCharFoundListener = eventEmitter.addListener(
      BLE_PERIPHERAL_CHARACTERISTIC_DISCOVERED,
      event => {
        console.log('!! BLE_PERIPHERAL_CHARACTERISTIC_DISCOVERED ', event);
        store.dispatch(characteristicDiscovered({uuid, charUUID: event.uuid}));
        if (onConnected) onConnected(event.uuid);
      },
    );
    this.bleDisconnectedListener = eventEmitter.addListener(
      BLE_PERIPHERAL_DISCONNECTED,
      event => {
        console.log('x BLE_PERIPHERAL_DISCONNECTED ', event);
        store.dispatch(removeCurrentDevice(event.uuid));
        if (onDisconnected) onDisconnected(event.uuid);
      },
    );
    this.bleFailToConnectListener = eventEmitter.addListener(
      BLE_PERIPHERAL_CONNECT_FAILED,
      event => {
        console.log('x BLE_PERIPHERAL_CONNECT_FAILED ', event);
        store.dispatch(removeCurrentDevice(event.uuid));
        if (onFailToConnect) onFailToConnect();
      },
    );
    BluetoothZ.connect(uuid);
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
    if (this.bleReadCharListener) this.bleReadCharListener.remove();
    if (this.bleFailToReadListener) this.bleFailToReadListener.remove();

    this.bleReadCharListener = eventEmitter.addListener(
      BLE_PERIPHERAL_CHARACTERISTIC_READ_OK,
      event => {
        console.log('!! BLE_PERIPHERAL_CHARACTERISTIC_READ_OK ', event);
        store.dispatch(characteristicRead(event));
        // if (onConnected) onConnected(event.uuid);
      },
    );
    this.bleFailToReadListener = eventEmitter.addListener(
      BLE_PERIPHERAL_CHARACTERISTIC_READ_FAILED,
      event => {
        console.log('x BLE_PERIPHERAL_CHARACTERISTIC_READ_FAILED ', event);
        store.dispatch(characteristicReadFailed(event));
        // if (onFailToConnect) onFailToConnect();
      },
    );
    BluetoothZ.readCharacteristicValue(uuid, charUUID);
  }

  /**
   *
   * @param {*} uuid => address of devic to connect
   */
  async changeCharacteristicNotification(uuid, charUUID, enable) {
    console.log('====> ENABLE', charUUID, enable);
    if (this.bleUpdatesCharListener) this.bleUpdatesCharListener.remove();
    if (this.bleFailToEnableUpdatesListener)
      this.bleFailToEnableUpdatesListener.remove();
    if (this.bleCharUpdatesChangedListener)
      this.bleCharUpdatesChangedListener.remove();

    this.bleUpdatesCharListener = eventEmitter.addListener(
      BLE_PERIPHERAL_NOTIFICATION_UPDATES,
      event => {
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
      },
    );
    this.bleCharUpdatesChangedListener = eventEmitter.addListener(
      BLE_PERIPHERAL_NOTIFICATION_CHANGED,
      event => {
        console.log('!! BLE_PERIPHERAL_NOTIFICATION_CHANGED ', event);
        store.dispatch(
          characteristicUpdates({
            uuid: event.uuid,
            charUUID: event.charUUID,
            enable: event.enable,
          }),
        );
        // if (onConnected) onConnected(event.uuid);
      },
    );
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
    BluetoothZ.changeCharacteristicNotification(uuid, charUUID, enable);
    setTimeout(() => {
      // this.readCharacteristic(uuid, '00002a24-0000-1000-8000-00805f9b34fb');
    }, 2000);
  }
}

module.exports.BluetoothService = new BluetoothService();
