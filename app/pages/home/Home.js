import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import BottomBar from '../../components/bottom-bar/BottomBar';
import TestScreen from '../test/Test';
import OverviewScreen from '../overview/Overview';

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
          {/* <Tab.Screen name="Overview" component={OverviewScreen} /> */}
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
