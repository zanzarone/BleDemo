import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';

// import our BLE native module
const {BluetoothZ} = NativeModules;
// adding listner, to receive ALL ble events
const eventEmitter = new NativeEventEmitter(BluetoothZ);
// Operation type
const OperationType = {StartScan: 0, StopScan};
// operation queue, to schedule app's requests to Ble
class OperationQueue {
  constructor() {
    this.items = {};
    this.frontIndex = 0;
    this.backIndex = 0;
  }
  enqueue(item) {
    this.items[this.backIndex] = item;
    this.backIndex++;
    // return item + ' inserted'
  }
  dequeue() {
    const item = this.items[this.frontIndex];
    delete this.items[this.frontIndex];
    this.frontIndex++;
    return item;
  }
  peek() {
    return this.items[this.frontIndex];
  }
  get printQueue() {
    return this.items;
  }
}

const queue = new OperationQueue();

const eventListener = event => {
  // callback(event as BleDevice);
};

export function startScan(callback) {
  console.log('pipo');
}

export function stopScan(callback) {
  console.log('stopScan');
}

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
