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
const {BLE_ADAPTER_STATUS_DID_UPDATE, BLE_PERIPHERAL_FOUND} =
  BluetoothZ.getConstants();
// This event emitter will be responsible of ALL bluetooth event
const eventEmitter = new NativeEventEmitter(BluetoothZ);
console.log(' ========== >', BluetoothZ);

class BluetoothService {
  constructor() {
    this.bleScanTimer = null;
    // adding the listner on Bluetooth status change
    this.bleScanListener = null;
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

  /***
   * Getting the status
   */
  async getStatus() {
    try {
      const status = await BluetoothZ.status();
      store.dispatch(updateStatus(status));
    } catch (error) {
      store.dispatch(updateStatus(null));
    }
  }

  startScan(onEnd, timeout) {
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
    BluetoothZ.startScan();
    timeout = !timeout ? 5000 : timeout;
    setTimeout(() => this.stopScan(onEnd), timeout);
  }

  stopScan(onEnd) {
    console.log('====> STOP SCAN');
    BluetoothZ.stopScan();
    if (onEnd) {
      onEnd();
    }
  }
}

module.exports.BluetoothService = new BluetoothService();

// export namespace BluetoothService {

//   export interface BleDevice {
//     name: string;
//   }

//   export function startScanForDevices(callback: (device: BleDevice) => void ): EmitterSubscription | undefined {

//     BluetoothZ.startScan();

//     const sub = eventEmitter!.addListener('Device', eventListener);

//     return sub;
//   }

//   export function stopScanForDevices(eventSub?: EmitterSubscription) {
//     const {BluetoothBridge} = NativeModules;
//     BluetoothBridge.stopScan();

//     if (eventSub != null) {
//       eventSub.remove();
//     }
//   }
// }

/* 
export { Tiger } would be equivalent to module.exports.Tiger = Tiger.

Conversely, module.exports = Tiger would be equivalent to export default Tiger.

So when you use module.exports = Tiger and then attempt import { Tiger } from './animals' you're effectively asking for Tiger.Tiger.

*/

// const BluetoothOperation = {
//   StartScan: 0,
//   StopScan: 1,
// };

// // operation queue, to schedule app's requests to Ble
// class BluetoothQueue {
//   constructor() {
//     // Create an empty array of commands
//     this.queue = [];
//     // We're inactive to begin with
//     this.active = false;
//   }

//   // Method for adding command chain to the queue
//   place(command, callback) {
//     // Push the command onto the command array
//     this.queue.push({command, callback});
//     // If we're currently inactive, start processing
//     if (!this.active) this.next();
//   }

//   // Method for calling the next command chain in the array
//   next() {
//     // If this is the end of the queue
//     if (!this.queue.length) {
//       // We're no longer active
//       this.active = false;
//       // Stop execution
//       return;
//     }
//     // Grab the next command
//     const command = this.queue.shift();
//     // We're active
//     this.active = true;
//     // Call the command
//     command.callback();
//     this.next();
//   }

//   //Clearing queue
//   clear() {
//     this.queue.length = 0;
//     this.active = false;
//   }
// }
