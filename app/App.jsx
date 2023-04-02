import React from 'react';
import { SafeAreaView, Text, View, ImageBackground, TouchableOpacity } from 'react-native';
import { Appbar } from 'react-native-paper';
import { Platform } from 'react-native';
import style from './App.module.css';

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

const image = {
  uri: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80',
};

export default function App() {
  return (
    <SafeAreaView>
      <Appbar.Header>
        <Appbar.Content title="Valkyrie Sky" subtitle={'The journey of a lifetime'} />
        <Appbar.Action icon="magnify" onPress={() => {}} />
        <Appbar.Action icon={MORE_ICON} onPress={() => {}} />
      </Appbar.Header>
      <View style={style.container}>
        <ImageBackground source={image} resizeMode="cover" style={style.appbg}>
          <View style={style.main}>
            <View>
              <Text style={style.mainheading}>McWay Falls, United States</Text>
            </View>
            <View style={style.location}>
              <Text>⭐️ 5.0</Text>
              <Text style={style.locationicons}>🕜 7 Hours</Text>
              <Text>✈️ 200 km</Text>
            </View>
            <View style={style.booking}>
              <View style={style.party}>
                <TouchableOpacity style={style.partybtn}>
                  <Text>-</Text>
                </TouchableOpacity>
                <Text>5</Text>
                <TouchableOpacity style={style.partybtn}>
                  <Text>+</Text>
                </TouchableOpacity>
              </View>
              <View>
                <Text>🕗 5 Days</Text>
              </View>
            </View>
          </View>
          <View style={style.content}>
            <View style={style.contentheading}>
              <Text style={style.selected}>Descriptions</Text>
              <Text style={style.unselected}>Facility</Text>
            </View>
            <View>
              <Text style={style.description}>
                McWay Falls is an 80-foot-tall waterfall on the coast of Big Sur in central California that flows
                year-round from McWay Creek in Julia Pfeiffer Burns State Park, about 37 miles south of Carmel, into the
                Pacific Ocean.
              </Text>
            </View>
          </View>
          <View style={style.book}>
            <Text style={style.bookcost}>$450</Text>
            <TouchableOpacity style={style.bookbtn}>
              <Text style={style.bookbtntext}>Book a Tour</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}
// import React from 'react';
// import {
//   SafeAreaView,
//   Text,
//   Button,
// } from 'react-native';

// import {startScan} from './bluetoothz';
// // console.log(NativeModules.BluetoothZ);

// const onPress = () => {
//   // console.log('We will invoke the native module here!', ask.RTC);
//   // BluetoothZ.initialize();
//   // console.log('ISODIOSIDODI ', NativeModules.BluetoothZ.getConstants());
// };

// const App = () => {
//   return (
//     <SafeAreaView>
//       <Text style={{color: 'red'}}>AAA</Text>
//       <Button
//         title="Click to invoke your native module!"
//         color="#841584"
//         onPress={onPress}
//       />
//     </SafeAreaView>
//   );
// };