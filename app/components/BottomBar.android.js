import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 25,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: 'snow',
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#333',
  },
  bottomBarItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'pink',
    padding: 20,
  },
  activeColor: 'blue',
  idleColor: 'silver',
});

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
            <Text
              style={{
                color: isFocused ? styles.activeColor : styles.idleColor,
                fontWeight: 'bold',
              }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
