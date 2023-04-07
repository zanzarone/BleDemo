import React from 'react';
import mainStyle from '../../assets/style/theme.module.css';
import {Text, View, StyleSheet} from 'react-native';
import HeaderBar from '../../components/header-bar/HeaderBar';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function StatusScreen() {
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
      <HeaderBar title="Status" />
    </View>
  );
}

let style = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
});
