import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import BottomBar from './components/BottomBar';
import SettingsScreen from './pages/Settings.jsx';
import StatusScreen from './pages/Status.jsx';
import TestScreen from './pages/Test.jsx';

const Tab = createBottomTabNavigator();

export default function HomeScreen() {
  return (
    <NavigationContainer>
      <Tab.Navigator tabBar={props => <BottomBar {...props} />}>
        <Tab.Screen name="Test" component={TestScreen} />
        <Tab.Screen name="Status" component={StatusScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
