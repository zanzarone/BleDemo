/**
 * @format
 */
import React from 'react';
import {
  AppRegistry,
  SafeAreaView,
  NativeModules,
  Text,
  Button,
} from 'react-native';
// import App from './App';
import {name as appName} from './app.json';

console.log(NativeModules.BluetoothZ);

const onPress = () => {
  // console.log('We will invoke the native module here!', ask.RTC);
  // BluetoothZ.initialize();
  console.log('ISODIOSIDODI ', NativeModules.BluetoothZ.getConstants());
};

const App = () => {
  return (
    <SafeAreaView>
      <Text style={{color: 'red'}}>AAA</Text>
      <Button
        title="Click to invoke your native module!"
        color="#841584"
        onPress={onPress}
      />
    </SafeAreaView>
  );
};

AppRegistry.registerComponent(appName, () => App);
