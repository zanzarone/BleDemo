import React, {useState} from 'react';
import {Text, View, FlatList, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import style from '../assets/style/theme.module.css';
import {BluetoothService} from '../bluetoothz';

export default function TestScreen() {
  const [isScanning, scan] = useState(false);
  const bluetooth = useSelector(state => {
    // console.info('\n[App: ', state, ']\n');
    return state.bluetooth;
  });

  return (
    <View style={style.body}>
      <View style={style.container}>
        <Text style={style.regularLabel}>BT: {bluetooth.status}</Text>
        <View style={{flexDirection: 'row', justifyContent: 'center', gap: 10}}>
          <TouchableOpacity
            disabled={isScanning}
            style={!isScanning ? style.primaryButton : style.disabledButton}
            onPress={() => {
              console.log('STATUS');
              BluetoothService.getStatus();
            }}>
            <Text
              style={
                !isScanning
                  ? style.primaryButtonLabel
                  : style.disabledButtonLabel
              }>
              Status
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={isScanning}
            style={!isScanning ? style.secondaryButton : style.disabledButton}
            onPress={() => {
              console.log('SCAN');
              BluetoothService.startScan(() => {
                scan(false);
              });
              scan(true);
            }}>
            <Text
              style={
                !isScanning
                  ? style.secondaryButtonLabel
                  : style.disabledButtonLabel
              }>
              Scan
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          style={{backgroundColor: 'transparent', width: '100%'}}
          contentContainerStyle={{alignItems: 'stretch'}}
          data={bluetooth.devices}
          renderItem={({item, idx}) => {
            // console.log('aaa', item);
            const disconnectBtn = item.uuid === bluetooth.currentDevice?.uuid;
            return (
              <View
                style={{
                  backgroundColor: 'snow',
                  flexDirection: 'row',
                  alignSelf: 'stretch',
                  padding: 10,
                }}>
                <View
                  key={'flatlist' + idx}
                  style={{
                    backgroundColor: 'powderblue',
                    padding: 10,
                    margin: 2,
                    flex: 1,
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity
                    disabled={isScanning}
                    onPress={() => {
                      console.log('CONNECT');
                      BluetoothService.connect(item.uuid);
                    }}>
                    <Text>{item.name}</Text>
                  </TouchableOpacity>
                  {disconnectBtn && (
                    <TouchableOpacity
                      onPress={() => {
                        console.log('DISCONNECT');
                        BluetoothService.disconnect(
                          bluetooth.currentDevice?.uuid,
                        );
                      }}>
                      <Text>❌</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}
