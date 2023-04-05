import React, {useEffect, useState} from 'react';
import {Text, View, Button, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import {
  requestBluetoothPermission,
  checkBluetoothPermission,
  showPermission,
} from './utils/androidPermissions';
import HomeScreen from './Home.jsx';

const PermissionStatus = {GRANTED: 0, REJECTED: 1, TO_CHECK: 2};

const Permission = ({show, title, message, onButtonPress}) => {
  const [isVisible, visible] = useState(show);

  useEffect(() => {
    visible(show);
  }, [show]);

  return (
    <View>
      <Modal isVisible={isVisible}>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 20,
            gap: 15,
          }}>
          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              fontSize: 20,
              fontWeight: 'bold',
            }}>
            {title}
          </Text>
          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              fontSize: 18,
            }}>
            {message}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: 'blue',
              minHeight: 40,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
            }}
            onPress={() => onButtonPress()}>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontSize: 18,
                fontWeight: 'bold',
              }}>
              Ok
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default function App() {
  const [isFirstTimeRun, firstTimeRun] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(
    PermissionStatus.TO_CHECK,
  );

  useEffect(() => {
    check = async () => {
      const granted = await checkBluetoothPermission();
      console.log(granted ? '2 OK ' : '2 NOOO ');
      setPermissionGranted(
        granted ? PermissionStatus.GRANTED : PermissionStatus.REJECTED,
      );
    };
    check();
  }, [setPermissionGranted]);

  return (
    <>
      <Permission
        show={permissionGranted === PermissionStatus.REJECTED}
        title="Android permission required"
        message="You have to give Bluetooth&trade; permission to Demo app in order for it to work correctly."
        onButtonPress={() => {
          setPermissionGranted(PermissionStatus.TO_CHECK);
          setTimeout(async () => {
            await requestBluetoothPermission();
          }, 500);
        }}
      />
      <HomeScreen />
    </>
  );
}
