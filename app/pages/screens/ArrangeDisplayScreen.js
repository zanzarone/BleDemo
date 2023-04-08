import React from 'react';
import mainStyle from '../../assets/style/theme.module.css';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import HeaderBar from '../../components/header-bar/HeaderBar';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

export default function ArrangeDisplayScreen() {
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
      <HeaderBar title="Screens" />
      <View style={{marginLeft: 15, gap: 20}}>
        <Text
          style={{fontSize: 24, color: '#fff', fontFamily: 'Baloo2-Regular'}}>
          Type
        </Text>
        <ScrollView horizontal>
          <LinearGradient
            style={{
              width: 100,
              height: 100,
              borderRadius: 20,
              marginRight: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            colors={['purple', 'orange']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}>
            <Text style={{fontFamily: 'Baloo2-Bold', fontSize: 20}}>Sport</Text>
          </LinearGradient>
          <LinearGradient
            style={{
              width: 100,
              height: 100,
              borderRadius: 20,
              marginRight: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            colors={['red', 'black']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}>
            <Text style={{fontFamily: 'Baloo2-Bold', fontSize: 20}}>SRM</Text>
          </LinearGradient>
          <LinearGradient
            style={{
              width: 100,
              height: 100,
              borderRadius: 20,
              marginRight: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            colors={['springgreen', 'darkgreen']}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}>
            <Text style={{fontFamily: 'Baloo2-Bold', fontSize: 20}}>
              Outdoor
            </Text>
          </LinearGradient>
        </ScrollView>
      </View>
      <View style={{marginLeft: 15, gap: 20}}>
        <Text
          style={{fontSize: 24, color: '#fff', fontFamily: 'Baloo2-Regular'}}>
          Configure
        </Text>
      </View>
    </View>
  );
}

let style = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
});
