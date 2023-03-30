import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';

// export namespace BluetoothService {
//   const eventEmitter = new NativeEventEmitter(NativeModules.BluetoothBridge);

//   export interface BleDevice {
//     name: string;
//   }

//   export function startScanForDevices(
//     callback: (device: BleDevice) => void,
//   ): EmitterSubscription | undefined {
//     const eventListener = (event: any) => {
//       callback(event as BleDevice);
//     };

//     const {BluetoothBridge} = NativeModules;
//     BluetoothBridge.startScan();

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
