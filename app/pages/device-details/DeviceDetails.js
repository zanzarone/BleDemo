import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native';
import HeaderBar from '../../components/header-bar/HeaderBar';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import mainStyle from '../../assets/style/theme.module.css';

export default function DeviceDetails({navigation}) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        mainStyle.body,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}>
      <HeaderBar
        title="Device details"
        navigation={navigation}
        onBackButton={() => {}}
      />
      <View></View>
    </View>
  );
}
