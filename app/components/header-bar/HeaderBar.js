import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/dist/Feather';

export default function HeaderBar({title}) {
  return (
    <View style={styles.header}>
      <Icon name="grid" size={25} color="#fff" />
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
}

let styles;
if (Platform.OS === 'android') {
  styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#0a0911',
      height: 70,
    },
    headerTitle: {
      //   marginLeft: 10,
      fontSize: 38,
      fontFamily: 'Baloo2-SemiBold',
      color: '#fff',
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
