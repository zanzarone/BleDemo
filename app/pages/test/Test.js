import React, {useState} from 'react';
import {Text, View, FlatList, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import style from '../../assets/style/theme.module.css';
import {BluetoothService} from '../../bluetoothz';

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
          style={{backgroundColor: 'transparent', width: '100%', marginTop: 10}}
          contentContainerStyle={{alignItems: 'stretch'}}
          data={bluetooth.devices}
          renderItem={({item, idx}) => {
            // console.log('aaa', item);
            const disconnectBtnVisible =
              item.uuid === bluetooth.currentDevice?.uuid;
            return (
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'stretch',
                  paddingBottom: 10,
                }}>
                <View
                  key={'flatlist' + idx}
                  style={{
                    backgroundColor: '#555',
                    paddingHorizontal: 10,
                    borderRadius: 20,
                    flex: 1,
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity
                    style={{
                      // backgroundColor: 'red',
                      height: '100%',
                      paddingHorizontal: 10,
                      paddingVertical: 20,
                    }}
                    disabled={isScanning}
                    onPress={() => {
                      console.log('CONNECT');
                      BluetoothService.connect(item.uuid);
                    }}>
                    <Text style={{fontFamily: 'Baloo2-Medium', fontSize: 22}}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {disconnectBtnVisible && (
                      <TouchableOpacity
                        style={{
                          backgroundColor: '#333',
                          height: '100%',
                          height: 50,
                          width: 50,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 25,
                        }}
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
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}
