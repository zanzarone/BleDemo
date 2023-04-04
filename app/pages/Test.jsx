import React, {useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import style from '../assets/App.module.css';
import {BluetoothService} from '../bluetoothz';
/// Now let's initialize the store.

export default function Test() {
  const [isScanning, scan] = useState(false);
  const bluetooth = useSelector(state => {
    // console.info('\n[App: ', state, ']\n');
    return state.bluetooth;
  });

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View style={style.container}>
          <FlatList
            data={bluetooth.devices}
            renderItem={({item}) => (
              <TouchableOpacity
                disabled={isScanning}
                style={!isScanning ? style.mainheading : style.bookbtnDISABLED}
                onPress={() => {
                  console.log('CONNECT');
                  BluetoothService.connect(item.uuid);
                }}>
                <Text style={style.mainheading}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <View style={{padding: 10, gap: 10}}>
            <Text style={style.bookcost}>BT: {bluetooth.status}</Text>
            <TouchableOpacity
              disabled={isScanning}
              style={!isScanning ? style.bookbtn : style.bookbtnDISABLED}
              onPress={() => {
                console.log('STATUS');
                BluetoothService.getStatus();
              }}>
              <Text style={style.bookbtntext}>STATUS</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={isScanning}
              style={!isScanning ? style.bookbtn : style.bookbtnDISABLED}
              onPress={() => {
                console.log('SCAN');
                BluetoothService.startScan(() => {
                  scan(false);
                });
                scan(true);
              }}>
              <Text style={style.bookbtntext}>SCAN</Text>
            </TouchableOpacity>
            {/* <Text style={style.bookcost}>$450</Text>
            <TouchableOpacity style={style.bookbtn}>
              <Text style={style.bookbtntext}>Scan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={style.bookbtn}>
              <Text style={style.bookbtntext}>Stop</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
