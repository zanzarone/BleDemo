import React from 'react';
import mainStyle from '../../assets/style/theme.module.css';
import {Text, View, StyleSheet} from 'react-native';
import HeaderBar from '../../components/header-bar/HeaderBar';

export default function StatusScreen() {
  return (
    <View style={mainStyle.body}>
      <HeaderBar title="Prova" />
    </View>
  );
}

let style = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
});
