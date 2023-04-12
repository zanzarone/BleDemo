import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native';
import {useSelector} from 'react-redux';
import HeaderBar from '../../components/header-bar/HeaderBar';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import mainStyle from '../../assets/style/theme.module.css';
import {BluetoothService, defines} from '../../bluetoothz';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
const LIVE_DATA_UUID = '7f51000c-1b15-11e5-b60b-1697f925ec7b';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
  interpolate,
  cancelAnimation,
} from 'react-native-reanimated';

let buttonShadow;
if (Platform.OS === 'android') {
  buttonShadow = StyleSheet.create({
    elevation: 14,
    shadowOpacity: 1,
    shadowColor: 'white',
  });
} else {
  buttonShadow = StyleSheet.create({
    shadowColor: '#333',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 3,
  });
}

let style;
if (Platform.OS === 'android') {
  style = StyleSheet.create({
    buttonShadow: {
      elevation: 14,
      shadowOpacity: 1,
      shadowColor: 'white',
    },
    shadow: {
      elevation: 14,
      shadowOpacity: 1,
      shadowColor: 'white',
    },
  });
} else {
  style = StyleSheet.create({
    buttonShadow: {
      shadowColor: '#333',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 1,
      shadowRadius: 3,
    },
    shadow: {
      shadowColor: '#000',
      shadowOffset: {width: -2, height: 4},
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
  });

  // = StyleSheet.create({
  //   shadowColor: '#333',
  //   shadowOffset: {width: 0, height: 2},
  //   shadowOpacity: 1,
  //   shadowRadius: 3,
  // });
}

const Ring = ({delay, height, width, children, start = false}) => {
  const ring = useSharedValue(0);

  const ringStyle = useAnimatedStyle(() => {
    return {
      opacity: 1 - ring.value,
      transform: [
        {
          scale: interpolate(ring.value, [0, 1], [0, 2]),
        },
      ],
    };
  });

  useEffect(() => {
    if (!start) {
      cancelAnimation(ring);
      ring.value = null;
    } else {
      ring.value = withDelay(
        delay,
        withRepeat(
          withTiming(1, {
            duration: 3000,
          }),
          -1,
          false,
        ),
      );
    }
  }, [start]);

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          zIndex: 1,
          height,
          width,
          borderRadius: height / 2,
          borderColor: 'royalblue',
          borderWidth: 1,
        },
        ringStyle,
      ]}>
      {children}
    </Animated.View>
  );
};

function Device({name, uuid, rssi, map}) {
  return (
    <View
      key={name}
      style={[
        {
          flexDirection: 'row',
          backgroundColor: '#171717',
          borderRadius: 15,
          padding: 15,
          gap: 10,
          justifyContent: 'space-between',
          marginBottom: 10,
        },
        style.shadow,
      ]}>
      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          flex: 1,
          alignItems: 'center',
        }}>
        <View
          style={{
            height: 55,
            width: 55,
            backgroundColor: '#000',
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon name="access-point" color="lightgreen" size={26} />
        </View>
        <View
          style={{
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'flex-start',
            gap: 0,
          }}>
          <Text
            style={{
              fontFamily: 'Baloo2-Bold',
              fontSize: 16,
              color: '#fff',
              flex: 1,
            }}>
            {name}
          </Text>
          <View style={{flex: 2, flexDirection: 'row', gap: 0}}>
            <Text
              style={{
                color: '#555',
                fontFamily: 'Baloo2-Medium',
                fontSize: 10,
                flex: 1,
                flexWrap: 'wrap',
              }}>
              {uuid}
            </Text>
          </View>
        </View>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
        <Icon name="signal-cellular-2" size={20} color="#555" />
        <Text
          style={{
            color: '#fff',
            fontFamily: 'Baloo2-Medium',
            fontSize: 18,
          }}>
          {rssi} RSSI
        </Text>
      </View>
    </View>
  );
}

const BleButton = ({bluetooth, status, setStatus}) => {
  if (bluetooth.status === defines.BLE_ADAPTER_STATUS_POWERED_ON)
    return (
      <TouchableOpacity
        disabled={status === 1}
        onPress={() => {
          console.log('SCAN');
          setTimeout(() => {
            BluetoothService.startScan(
              () => {
                setStatus(2);
              },
              null,
              null,
              10000,
            );
          }, 2000);
          setStatus(1);
          BluetoothService.clearAllDevices();
        }}
        style={[
          {
            zIndex: 1000,
            position: 'absolute',
            height: 70,
            width: 70,
            borderRadius: 35,
            backgroundColor: 'royalblue',
            justifyContent: 'center',
            alignItems: 'center',
          },
          style.buttonShadow,
        ]}>
        <Icon name="bluetooth" size={40} color="#fff" />
      </TouchableOpacity>
    );
  else if (bluetooth.status === defines.BLE_ADAPTER_STATUS_POWERED_OFF) {
    return (
      <TouchableOpacity
        disabled={status !== 2}
        onPress={() => {
          console.log('SCAN');
        }}
        style={[
          {
            zIndex: 1000,
            position: 'absolute',
            height: 70,
            width: 70,
            borderRadius: 35,
            backgroundColor: 'crimson',
            justifyContent: 'center',
            alignItems: 'center',
          },
          style.buttonShadow,
        ]}>
        <Icon name="bluetooth-off" size={40} color="#fff" />
      </TouchableOpacity>
    );
  }
};

export default function TestScreen() {
  const insets = useSafeAreaInsets();
  const [status, setStatus] = useState(0);
  const bluetooth = useSelector(state => {
    return state.bluetooth;
  });

  useEffect(() => {
    if (bluetooth.status === defines.BLE_ADAPTER_STATUS_POWERED_ON) {
      setStatus(0);
      BluetoothService.clearAllDevices();
    }
    if (bluetooth.status === defines.BLE_ADAPTER_STATUS_POWERED_OFF) {
      setStatus(3);
      BluetoothService.clearAllDevices();
    }
    if (
      bluetooth.status === defines.BLE_ADAPTER_STATUS_INVALID ||
      bluetooth.status === defines.BLE_ADAPTER_STATUS_UNKNOW
    ) {
      setStatus(4);
    }
  }, [bluetooth.status]);

  return (
    <View
      style={[
        mainStyle.body,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}>
      <HeaderBar title="Scan" />
      <View style={([mainStyle.container], {flexDirection: 'column', flex: 1})}>
        <View
          style={{
            height: 120,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: 'pink',
          }}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}>
            <BleButton
              bluetooth={bluetooth}
              status={status}
              setStatus={setStatus}
            />
            <Ring delay={0} height={80} width={80} start={status === 1} />
            <Ring delay={1000} height={100} width={100} start={status === 1} />
            <Ring delay={2000} height={120} width={120} start={status === 1} />
            <Ring delay={3000} height={120} width={120} start={status === 1} />
          </View>
        </View>
        <View style={{flex: 1, backgroundColor: 'transparent'}}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'Baloo2-Regular',
              fontSize: 20,
              color: '#555',
              marginTop: 10,
              paddingHorizontal: 20,
              // backgroundColor: 'red',
              // flex: 1,
              // textAlignVertical: 'top',
            }}>
            {status === 0 && 'Press Bluetooth button to scan'}
            {status === 1 && 'Wait until finish Scannig'}
            {status === 2 && 'Devices found'}
            {status === 3 && 'Adapter is OFF. Please enable Bluetooth'}
          </Text>
          <FlatList
            style={{
              backgroundColor: 'transparent',
              width: '100%',
              marginTop: 10,
              paddingHorizontal: 20,
              flex: 1,
            }}
            contentContainerStyle={{alignItems: 'stretch'}}
            data={bluetooth.devices}
            renderItem={({item, idx}) => {
              console.log('aaa', item, bluetooth.currentDevices);
              const disconnectBtnVisible = bluetooth.currentDevices?.some(
                d => d.uuid === item.uuid,
              );
              let isNotifying = false;
              bluetooth.currentDevices?.map(d => {
                if (d.uuid === item.uuid) {
                  d.chars?.map(c => {
                    if (c.uuid === LIVE_DATA_UUID) {
                      isNotifying = c.notification;
                    }
                  });
                }
              });
              return (
                <Device name={item.name} uuid={item.uuid} rssi={item.rssi} />
              );
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
                      disabled={status === 1}
                      onPress={() => {
                        console.log('CONNECT');
                        BluetoothService.connect(item.uuid, true);
                      }}>
                      <Text style={{fontFamily: 'Baloo2-Medium', fontSize: 22}}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                      }}>
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
                            console.log('CHANGE');
                            let notification = false;
                            bluetooth.currentDevices?.map(d => {
                              if (d.uuid === item.uuid) {
                                d.chars.map(c => {
                                  if (c.uuid === LIVE_DATA_UUID) {
                                    notification = c.notification;
                                  }
                                });
                              }
                            });
                            BluetoothService.changeCharacteristicNotification(
                              item.uuid,
                              LIVE_DATA_UUID,
                              !notification,
                            );
                          }}>
                          <Icon
                            name="bluetooth"
                            size={20}
                            color={isNotifying ? 'lightgreen' : 'red'}
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
                            BluetoothService.disconnect(item.uuid);
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
        </View>
      </View>
    </View>
  );
}
