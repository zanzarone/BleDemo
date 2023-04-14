import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Button,
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
  Easing,
  Extrapolate,
} from 'react-native-reanimated';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DeviceDetails from '../device-details/DeviceDetails';

const State = {
  IDLE: 0,
  SCAN_START: 1,
  SCAN_END: 2,
  ADAPTER_OFF: 3,
  ADAPTER_INVALID: 4,
};

const Stack = createNativeStackNavigator();

let style;
if (Platform.OS === 'android') {
  style = StyleSheet.create({
    buttonShadow: {
      elevation: 14,
      shadowOpacity: 1,
      shadowColor: '#333',
    },
    shadow: {
      elevation: 7,
      shadowOpacity: 1,
      shadowColor: '#000',
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

const BlinkingDot = ({ready, connected}) => {
  const opacity = useSharedValue(1);

  // Set the opacity value to animate between 0 and 1
  useEffect(() => {
    if (ready === false || ready === null) {
      opacity.value = withRepeat(
        withTiming(0, {duration: 800, easing: Easing.ease}),
        -1,
        true,
      );
    } else {
      cancelAnimation(opacity);
      opacity.value = 1;
    }
  }, [ready]);

  const style = useAnimatedStyle(() => ({opacity: opacity.value}), []);

  return (
    <Animated.View style={style}>
      <Icon
        name={ready === true ? 'access-point' : 'access-point-remove'}
        color={
          ready === true
            ? '#fff'
            : connected || ready === null
            ? '#000'
            : '#fff'
        }
        size={26}
        style={{zIndex: 1000}}
      />
    </Animated.View>
  );
};

const RSSISymbol = ({rssi}) => {
  let icon;
  if (rssi >= -65) {
    icon = <Icon name="signal-cellular-3" size={22} color="green" />;
  } else if (rssi < -65 && rssi > -75) {
    icon = <Icon name="signal-cellular-2" size={22} color="lightgreen" />;
  } else if (rssi <= -75 && rssi > -85) {
    icon = <Icon name="signal-cellular-1" size={22} color="yellow" />;
  } else {
    icon = <Icon name="signal-cellular-outline" size={22} color="red" />;
  }
  return (
    <View
      style={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'red',
        gap: 5,
      }}>
      {icon}
      <Text
        style={{
          color: '#fff',
          fontFamily: 'Baloo2-Medium',
          fontSize: 11,
          textAlign: 'center',
          minWidth: 55,
        }}>
        {rssi} dB
      </Text>
    </View>
  );
};

const MoreDetails = ({navigation, uuid}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('DeviceDetails', {
          uuid,
        });
      }}
      style={{
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Icon name="chevron-right" size={22} color="silver" />
    </TouchableOpacity>
  );
};

function ScanResult({
  name,
  uuid,
  rssi,
  disabled,
  onConnect,
  onDisconnect,
  ready,
  navigation,
}) {
  const connected = ready === false || ready === true;
  return (
    <View
      key={name}
      style={[
        {
          flexDirection: 'row',
          backgroundColor: '#282A2C',
          borderRadius: 15,
          paddingVertical: 15,
          paddingLeft: 15,
          paddingRight: 5,
          gap: 0,
          justifyContent: 'space-between',
          marginBottom: 15,
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
        <TouchableOpacity
          disabled={disabled}
          onPress={() => {
            if (!connected) {
              onConnect();
            } else {
              onDisconnect();
            }
          }}
          style={{
            height: 55,
            width: 55,
            backgroundColor:
              ready === true
                ? '#3D4EEE'
                : connected || ready === null
                ? '#84F88D'
                : '#333',
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <BlinkingDot ready={ready} connected={connected} />
          {/* <Icon
            name={ready === true ? 'access-point' : 'access-point-remove'}
            color={
              ready === true
                ? '#fff'
                : connected || ready === null
                ? '#000'
                : '#fff'
            }
            size={26}
            style={{zIndex: 1000}}
          /> */}
        </TouchableOpacity>
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
      <RSSISymbol rssi={rssi} />
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          // backgroundColor: 'red',
          justifyContent: 'center',
          width: 20,
        }}>
        {ready && <MoreDetails navigation={navigation} uuid={uuid} />}
      </View>
    </View>
  );
}

const BleButton = ({bluetooth, state, setState}) => {
  const PrivateButton = () => {
    if (
      bluetooth.status === defines.BLE_ADAPTER_STATUS_UNKNOW ||
      bluetooth.status === defines.BLE_ADAPTER_STATUS_INVALID
    ) {
      return (
        <TouchableOpacity
          disabled={state === State.SCAN_START}
          onPress={() => {}}
          style={[
            {
              zIndex: 1000,
              position: 'absolute',
              height: 70,
              width: 70,
              borderRadius: 35,
              backgroundColor: '#333',
              justifyContent: 'center',
              alignItems: 'center',
            },
            style.buttonShadow,
          ]}>
          <Icon name="bluetooth-off" size={40} color="#555" />
        </TouchableOpacity>
      );
    } else if (bluetooth.status === defines.BLE_ADAPTER_STATUS_POWERED_ON) {
      return (
        <TouchableOpacity
          disabled={state === State.SCAN_START}
          onPress={() => {
            console.log('SCAN');
            setTimeout(() => {
              BluetoothService.startScan(
                () => {
                  setState(State.SCAN_END);
                },
                null,
                null,
                7000,
              );
            }, 2000);
            setState(State.SCAN_START);
            BluetoothService.clearAllDevices();
          }}
          style={[
            {
              zIndex: 1000,
              position: 'absolute',
              height: 70,
              width: 70,
              borderRadius: 35,
              backgroundColor: '#3D4EEE',
              justifyContent: 'center',
              alignItems: 'center',
            },
            style.buttonShadow,
          ]}>
          <Icon name="bluetooth" size={40} color="#fff" />
        </TouchableOpacity>
      );
    } else if (bluetooth.status === defines.BLE_ADAPTER_STATUS_POWERED_OFF) {
      return (
        <TouchableOpacity
          disabled={state !== 2}
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

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}>
      {<PrivateButton />}
      <Ring
        delay={0}
        height={80}
        width={80}
        start={state === State.SCAN_START}
      />
      <Ring
        delay={1000}
        height={100}
        width={100}
        start={state === State.SCAN_START}
      />
      <Ring
        delay={2000}
        height={120}
        width={120}
        start={state === State.SCAN_START}
      />
      <Ring
        delay={3000}
        height={120}
        width={120}
        start={state === State.SCAN_START}
      />
    </View>
  );
};

const Scan = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [state, setState] = useState(State.IDLE);
  const bluetooth = useSelector(state => {
    return state.bluetooth;
  });

  useEffect(() => {
    if (bluetooth.status === defines.BLE_ADAPTER_STATUS_POWERED_ON) {
      setState(State.IDLE);
      BluetoothService.clearAllDevices();
    }
    if (bluetooth.status === defines.BLE_ADAPTER_STATUS_POWERED_OFF) {
      setState(State.ADAPTER_OFF);
      BluetoothService.clearAllDevices();
    }
    if (
      bluetooth.status === defines.BLE_ADAPTER_STATUS_INVALID ||
      bluetooth.status === defines.BLE_ADAPTER_STATUS_UNKNOW
    ) {
      setState(State.ADAPTER_INVALID);
    }
  }, [bluetooth.status]);

  return (
    <View
      style={[
        mainStyle.body,
        {
          paddingTop: insets.top,
          // paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}>
      <HeaderBar title="Scan" />
      <View style={([mainStyle.container], {flexDirection: 'column', flex: 1})}>
        <View
          style={{
            height: 180,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: 'red',
          }}>
          <BleButton bluetooth={bluetooth} state={state} setState={setState} />
          <Text
            style={{
              position: 'absolute',
              top: 0,
              textAlign: 'center',
              fontFamily: 'Baloo2-Regular',
              fontSize: 18,
              color: '#777',
              paddingHorizontal: 20,
            }}>
            {state === State.IDLE && 'Press Bluetooth button to scan'}
            {state === State.SCAN_START && 'Wait until finish scanning'}
            {state === State.SCAN_END && 'Scan finished!'}
            {state === State.ADAPTER_OFF &&
              'Adapter is OFF. Please enable Bluetooth'}
            {state === State.ADAPTER_INVALID &&
              'Bluetooth is unavailable on this device'}
          </Text>
        </View>
        <View style={{flex: 1, backgroundColor: 'transparent'}}>
          {bluetooth.devices?.length > 0 && (
            <FlatList
              style={{
                width: '100%',
                marginTop: 0,
                marginBottom: 110,
                paddingHorizontal: 20,
                flex: 1,
              }}
              contentContainerStyle={{alignItems: 'stretch'}}
              data={bluetooth.devices}
              renderItem={({item, idx}) => {
                const connectionFree = bluetooth.devices.every(d => {
                  console.log('dentro', d);
                  return d?.ready === undefined || d?.ready === true;
                });

                console.log(
                  idx,
                  item.uuid,
                  'ready',
                  item.ready,
                  'connectionFree',
                  connectionFree,
                  'uuid',
                );

                return (
                  <ScanResult
                    navigation={navigation}
                    disabled={state === State.SCAN_START || !connectionFree}
                    name={item.name}
                    uuid={item.uuid}
                    rssi={item.rssi}
                    ready={item.ready}
                    onConnect={() => {
                      BluetoothService.connect(item.uuid, true);
                    }}
                    onDisconnect={() => {
                      BluetoothService.disconnect(item.uuid);
                    }}
                  />
                );
              }}
            />
          )}
          {bluetooth.devices?.length <= 0 && (
            <>
              <View
                style={{
                  flex: 1,
                  padding: 0,
                  // justifyContent: 'center',
                  alignItems: 'center',
                  // backgroundColor: 'red',
                }}>
                <View
                  style={[
                    {
                      flexDirection: 'column',
                      backgroundColor: '#111',
                      borderRadius: 15,
                      gap: 0,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginHorizontal: 30,
                      paddingHorizontal: 30,
                      paddingVertical: 30,
                      zIndex: 1000,
                    },
                    style.shadow,
                  ]}>
                  <Icon name="broadcast-off" color="#444" size={50} />
                  <Text
                    style={{
                      fontSize: 18,
                      textAlign: 'center',
                      fontFamily: 'Baloo2-Bold',
                      color: '#444',
                    }}>
                    No nearby Bluetooth devices found
                  </Text>
                </View>
                {/* <Button
                  title="Go to Details"
                  onPress={() => navigation.navigate('DeviceDetails')}
                /> */}
              </View>
              <View style={{flex: 1}}></View>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default function TestScreen({navigation}) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Scan"
        component={Scan}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DeviceDetails"
        component={DeviceDetails}
        options={{headerShown: false}}
        n
      />
    </Stack.Navigator>
  );
}
