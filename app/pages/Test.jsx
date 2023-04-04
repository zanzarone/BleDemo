import React, {useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import style from '../assets/App.module.css';
import {BluetoothService} from '../bluetoothz';

const Tab = createBottomTabNavigator();

function HomeScreen() {
  const [isScanning, scan] = useState(false);
  const bluetooth = useSelector(state => {
    // console.info('\n[App: ', state, ']\n');
    return state.bluetooth;
  });

  return (
    <View
      style={{
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: 'orange',
        flexDirection: 'column',
      }}>
      <View style={{padding: 10, gap: 10, flex: 0}}>
        <Text style={{color: 'black'}}>BT: {bluetooth.status}</Text>
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
      </View>
      <FlatList
        style={{backgroundColor: 'skyblue', width: '100%'}}
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
  );
}

function SettingsScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Settings!</Text>
    </View>
  );
}

function MyTabBar({state, descriptors, navigation}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        position: 'absolute',
        bottom: 15,
        backgroundColor: 'snow',
        borderRadius: 15,
        marginLeft: 15,
        marginRight: 15,
      }}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            key={index}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{flex: 1, padding: 20}}>
            <Text style={{color: isFocused ? '#673ab7' : '#222'}}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function Test() {
  return (
    <NavigationContainer>
      <Tab.Navigator tabBar={props => <MyTabBar {...props} />}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// export default function Test() {
//   const [isScanning, scan] = useState(false);
//   const bluetooth = useSelector(state => {
//     // console.info('\n[App: ', state, ']\n');
//     return state.bluetooth;
//   });

//   return (
//     <SafeAreaProvider>
//       <SafeAreaView>
//         <View style={style.container}>
//           <FlatList
//             data={bluetooth.devices}
//             renderItem={({item}) => (
//               <TouchableOpacity
//                 disabled={isScanning}
//                 style={!isScanning ? style.mainheading : style.bookbtnDISABLED}
//                 onPress={() => {
//                   console.log('CONNECT');
//                   BluetoothService.connect(item.uuid);
//                 }}>
//                 <Text style={style.mainheading}>{item.name}</Text>
//               </TouchableOpacity>
//             )}
//           />
//           <View style={{padding: 10, gap: 10}}>
//             <Text style={style.bookcost}>BT: {bluetooth.status}</Text>
//             <TouchableOpacity
//               disabled={isScanning}
//               style={!isScanning ? style.bookbtn : style.bookbtnDISABLED}
//               onPress={() => {
//                 console.log('STATUS');
//                 BluetoothService.getStatus();
//               }}>
//               <Text style={style.bookbtntext}>STATUS</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               disabled={isScanning}
//               style={!isScanning ? style.bookbtn : style.bookbtnDISABLED}
//               onPress={() => {
//                 console.log('SCAN');
//                 BluetoothService.startScan(() => {
//                   scan(false);
//                 });
//                 scan(true);
//               }}>
//               <Text style={style.bookbtntext}>SCAN</Text>
//             </TouchableOpacity>
//             {/* <Text style={style.bookcost}>$450</Text>
//             <TouchableOpacity style={style.bookbtn}>
//               <Text style={style.bookbtntext}>Scan</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={style.bookbtn}>
//               <Text style={style.bookbtntext}>Stop</Text>
//             </TouchableOpacity> */}
//           </View>
//         </View>
//       </SafeAreaView>
//     </SafeAreaProvider>
//   );
// }
