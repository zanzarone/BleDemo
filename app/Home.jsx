import React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getHeaderTitle} from '@react-navigation/elements';
import style from './assets/style/header.module.css';
import BottomBar from './components/BottomBar';
import SettingsScreen from './pages/Settings.jsx';
import StatusScreen from './pages/Status.jsx';
import TestScreen from './pages/Test.jsx';

const Tab = createBottomTabNavigator();

export default function HomeScreen() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          header: ({navigation, route, options}) => {
            const title = getHeaderTitle(options, route.name);

            return (
              <View style={style.header}>
                <Text style={style.headerTitle}>{title}</Text>
              </View>
            );
          },
        }}
        tabBar={props => <BottomBar {...props} />}>
        <Tab.Screen name="Test" component={TestScreen} />
        <Tab.Screen name="Status" component={StatusScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
