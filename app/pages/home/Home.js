import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import BottomBar from '../../components/bottom-bar/BottomBar';
// import StatusScreen from '../status/Status';
import TestScreen from '../test/Test';
import OverviewScreen from '../overview/Overview';
import ArrangeDisplayScreen from '../screens/ArrangeDisplayScreen';

const Tab = createBottomTabNavigator();

export default function HomeScreen() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
          }}
          tabBar={props => <BottomBar {...props} />}>
          <Tab.Screen name="BLE Test" component={TestScreen} />
          <Tab.Screen name="Screens" component={ArrangeDisplayScreen} />
          <Tab.Screen name="Overview" component={OverviewScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
