import {PermissionsAndroid, Platform} from 'react-native';

let permissions = [];
const v = +Platform.Version;
if (v >= 31) {
  permissions.push({
    permission: PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    explanation:
      'Demo app require CONNECT permission to be able to connect to paired Bluetooth devices.',
  });
  permissions.push({
    permission: PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    explanation:
      'Demo app require SCAN permission to be able to discover and pair nearby Bluetooth devices.',
  });
} else {
  permissions.push({
    permission: PermissionsAndroid.PERMISSIONS.BLUETOOTH,
    explanation:
      'Demo app require CONNECT permission to be able to connect to paired Bluetooth devices.',
  });
  permissions.push({
    permission: PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    explanation:
      'Demo app require SCAN permission to be able to discover and pair nearby Bluetooth devices.',
  });
}
permissions.push({
  permission: PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  explanation:
    'Demo app require SCAN permission to be able to discover and pair nearby Bluetooth devices.',
});

permissions.map(p => console.log(p.permission));

export const requestBluetoothPermission = async () => {
  const title = 'Cool Photo App Camera Permission';
  console.log('===========================>');
  try {
    for (let i = 0; i < permissions.length; i++) {
      const {permission, explanation} = permissions[i];
      let granted = await PermissionsAndroid.request(permission, {
        title,
        message: explanation,
        // buttonNeutral: 'Ask Me Later',
        // buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      });
      console.log(
        permission,
        'isGranted',
        granted === PermissionsAndroid.RESULTS.GRANTED,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        return;
      }
    }
  } catch (err) {
    console.log(err);
  }
};

export const checkBluetoothPermission = async () => {
  let allGranted = true;
  for (let i = 0; i < permissions.length; i++) {
    const {permission} = permissions[i];
    const granted = await PermissionsAndroid.check(permission);
    console.log(
      permission,
      'isGranted',
      granted === PermissionsAndroid.RESULTS.GRANTED,
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      allGranted = false;
      break;
    }
  }
  console.log(allGranted ? ' OK ' : ' NOOO ');
  return allGranted;
};
