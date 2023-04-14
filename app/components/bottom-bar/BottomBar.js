import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/dist/Feather';

const icons = [
  {name: 'cpu', size: 24},
  {name: 'monitor', size: 24},
  {name: 'compass', size: 24},
];
export default function BottomBar({state, descriptors, navigation}) {
  return (
    <View style={styles.bottomBar}>
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
            style={styles.bottomBarItem}>
            <Icon
              color={isFocused ? styles.activeColor : styles.idleColor}
              {...icons[index]}
            />
            <Text
              style={{
                color: isFocused ? styles.activeColor : styles.idleColor,
                fontFamily: 'Baloo2-Bold',
              }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

let styles;
if (Platform.OS === 'android') {
  styles = StyleSheet.create({
    bottomBar: {
      flexDirection: 'row',
      position: 'absolute',
      bottom: 25,
      marginLeft: 20,
      marginRight: 20,
      backgroundColor: '#0f0f0f',
      borderRadius: 15,
      elevation: 4,
      shadowColor: '#000',
    },
    bottomBarItem: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: 80,
    },
    activeColor: '#fff',
    idleColor: '#555',
  });
} else {
  styles = StyleSheet.create({
    bottomBar: {
      // height: 80,
      flexDirection: 'row',
      position: 'absolute',
      bottom: 25,
      marginLeft: 20,
      marginRight: 20,
      backgroundColor: '#0f0f0f',
      borderRadius: 15,
      shadowColor: '#000',
      shadowOffset: {width: -2, height: 4},
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    bottomBarItem: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      height: 80,
      // padding: 20,
    },
    activeColor: '#fff',
    idleColor: '#555',
  });
}
