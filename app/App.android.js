import React, {useEffect, useState} from 'react';
import {Linking, Platform} from 'react-native';

import {requestPermissions, Permission} from './utils/androidPermissions';
import HomeScreen from './pages/home/Home';

export default function App() {
  const [isFirstTimeRun, firstTimeRun] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(null);

  useEffect(() => {
    check = async () => {
      let allGranted = await requestPermissions();
      console.log(allGranted ? '2 OK ' : '2 NOOO ');
      setPermissionGranted(allGranted);
    };
    check();
  }, [setPermissionGranted]);

  const handleOpenSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  return (
    <>
      <Permission
        show={permissionGranted?.length > 0}
        title="Android permission required"
        message="You have to give Bluetooth&trade; permission to Demo app in order for it to work correctly."
        onButtonPress={() => handleOpenSettings()}
      />
      <HomeScreen />
    </>
  );
}
