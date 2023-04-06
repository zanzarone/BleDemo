import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getHeaderTitle} from '@react-navigation/elements';
import BottomBar from '../../components/bottom-bar/BottomBar';
import SettingsScreen from '../settings/Settings.jsx';
import StatusScreen from '../status/Status';
import TestScreen from '../test/Test';

const Tab = createBottomTabNavigator();

export default function HomeScreen() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}
        tabBar={props => <BottomBar {...props} />}>
        <Tab.Screen name="Activity" component={TestScreen} />
        <Tab.Screen name="Status" component={StatusScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

let styles;
if (Platform.OS === 'android') {
  styles = StyleSheet.create({
    header: {
      justifyContent: 'center',
      backgroundColor: '#fff',
      height: 70,
    },
    headerTitle: {
      marginLeft: 10,
      fontSize: 38,
      fontFamily: 'Baloo2-SemiBold',
      color: '#0a0911',
    },
  });
} else {
  styles = StyleSheet.create({
    header: {
      justifyContent: 'flex-end',
      backgroundColor: '#fff',
      height: 100,
    },
    headerTitle: {
      marginLeft: 10,
      fontSize: 38,
      fontFamily: 'Baloo2-SemiBold',
      color: '#0a0911',
    },
  });
}
