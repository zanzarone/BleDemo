import React, {useState} from 'react';
import {Text, View, FlatList, TouchableOpacity, Dimensions} from 'react-native';
import {useSelector} from 'react-redux';
import style from '../../assets/style/theme.module.css';
import {BluetoothService} from '../../bluetoothz';
import Icon from 'react-native-vector-icons/dist/Feather';
const {height, width} = Dimensions.get('window');
const LIVE_DATA_UUID = '7f51000c-1b15-11e5-b60b-1697f925ec7b';
export default function TestScreen() {
  const [isScanning, scan] = useState(false);
  // const [enableNotification, notification] = useState(false);
  const bluetooth = useSelector(state => {
    return state.bluetooth;
  });

  return (
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
              !isScanning ? style.primaryButtonLabel : style.disabledButtonLabel
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
          console.log('aaa', item, bluetooth.currentDevice);
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
                <View
                  style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                  {disconnectBtnVisible &&
                    bluetooth.currentDevice?.uuid !== null && (
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
                          console.log('CHANGE');
                          BluetoothService.changeCharacteristicNotification(
                            bluetooth.currentDevice?.uuid,
                            LIVE_DATA_UUID,
                            !bluetooth.currentDevice.chars[LIVE_DATA_UUID]
                              ?.notification,
                          );
                        }}>
                        <Icon
                          name="bluetooth"
                          size={20}
                          color={
                            bluetooth.currentDevice.chars[LIVE_DATA_UUID]
                              ?.notification
                              ? 'lightgreen'
                              : 'red'
                          }
                        />
                      </TouchableOpacity>
                    )}
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
                      <Icon name="x" size={20} color="red" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          );
        }}
      />
      <View style={{backgroundColor: 'transparent'}}></View>
    </View>
  );
}

{
  /* <View style={style.body}>
      <View
        style={{
          zIndex: 900,
          position: 'absolute',
          backgroundColor: '#222',
          height: height / 2,
          borderRadius: height / 2,
          left: -60,
          right: -60,
          top: -height / 2 / 3,
        }}>
        <TouchableOpacity
          onPress={() => {
            BluetoothService.startScan(() => {
              scan(false);
            });
            scan(true);
          }}
          disabled={isScanning}
          style={{
            position: 'absolute',
            left: 60 + width / 2 - 75,
            top: height / 2 / 3 + 60,
            zIndex: 1000,
            backgroundColor: 'dimgray',
            borderColor: '#220',
            borderWidth: 1,
            height: 150,
            width: 150,
            borderRadius: 75,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Animatable.View
            // animation="pulse"
            easing="ease-out"
            iterationCount="infinite"
            // style={{textAlign: 'center'}}
          >
            <Icon name="bluetooth" size={65} />
          </Animatable.View>
        </TouchableOpacity>
      </View>
      <Text style={{color: 'red', zIndex: 2000, fontSize: 200}}>SCA</Text>
    </View> */
}

{
  /* <TouchableOpacity
style={{
  height: 180,
  width: 180,
  borderRadius: 90,
  borderColor: 'dimgray',
  borderWidth: 3,
  alignItems: 'center',
  justifyContent: 'center',
}}>
<View
  style={{
    height: 150,
    width: 150,
    borderRadius: 75,
    borderColor: 'dimgray',
    borderWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
  }}>
  <View
    style={{
      height: 100,
      width: 100,
      borderRadius: 50,
      borderColor: 'dimgray',
      borderWidth: 3,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
    <Icon color="#fff" name="bluetooth" size={60} />
  </View>
</View>
</TouchableOpacity> */
}
