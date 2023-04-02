import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';

// import our BLE native module
const {BluetoothZ} = NativeModules;

// adding listner, to receive ALL ble events
const eventEmitter = new NativeEventEmitter(BluetoothZ);

const OperationType = {
  StartScan: 0,
  StopScan,
};

// operation queue, to schedule app's requests to Ble
class OperationQueue {
  constructor() {
    // Create an empty array of commands
    this.queue = [];
    // We're inactive to begin with
    this.active = false;
  }

  // Method for adding command chain to the queue
  place(command, callback) {
    // Push the command onto the command array
    this.queue.push({command, callback});
    // If we're currently inactive, start processing
    if (!this.active) this.next();
  }

  // Method for calling the next command chain in the array
  next() {
    // If this is the end of the queue
    if (!this.queue.length) {
      // We're no longer active
      this.active = false;
      // Stop execution
      return;
    }
    // Grab the next command
    const command = this.queue.shift();
    // We're active
    this.active = true;
    // Call the command
    command();
    this.next();
  }

  //Clearing queue
  clear() {
    this.queue.length = 0;
    this.active = false;
  }
}
// const queue = new OperationQueue();

class BluetoothService {
  constructor() {
    this.commands = new OperationQueue();
  }

  startScan() {
    const eventListener = event => {
      // callback(event as BleDevice);
    };
    this.commands.place();
  }
}

module.exports = BluetoothService;

// export function startScan(callback) {
//   console.log('pipo');
// }

// export function stopScan(callback) {
//   console.log('stopScan');
// }

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
