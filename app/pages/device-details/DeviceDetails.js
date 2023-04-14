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
import {useSelector} from 'react-redux';
import {CommonActions} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';

export default function DeviceDetails({route, navigation}) {
  const insets = useSafeAreaInsets();
  const {uuid} = route.params;

  const bluetooth = useSelector(state => {
    return state.bluetooth;
  });

  const device = bluetooth.devices.filter(d => d.uuid === uuid)[0];
  // console.log('UUID', uuid, device.name);
  useEffect(() => {
    console.log('useeffect', device);
    if (device) {
      if (device?.ready === undefined) {
        navigation.dispatch(CommonActions.goBack());
      }
    }
  }, [device]);

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
        title={device.name}
        navigation={navigation}
        onBackButton={() => {}}
      />
      <View style={{flex: 1, backgroundColor: 'transparent'}}>
        <FlatList
          style={{
            width: '100%',
            marginTop: 0,
            marginBottom: 110,
            paddingHorizontal: 20,
            flex: 1,
          }}
          contentContainerStyle={{alignItems: 'stretch'}}
          data={device.chars}
          renderItem={({item, index}) => {
            console.log(item.uuid, index);

            return (
              <TouchableOpacity
                key={item.uuid}
                style={[
                  {
                    flexDirection: 'row',
                    backgroundColor: '#282A2C',
                    borderRadius: 15,
                    paddingVertical: 15,
                    paddingLeft: 15,
                    paddingRight: 15,
                    gap: 0,
                    alignItems: 'center',
                    marginBottom: 15,
                  },
                ]}>
                <View
                  style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                  <View
                    style={{
                      backgroundColor: 'royalblue',
                      height: 25,
                      width: 25,
                      borderRadius: 7,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Icon name="bluetooth" size={18} />
                  </View>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={{
                        fontFamily: 'Baloo2-Bold',
                        fontSize: 14,
                        color: '#fff',
                      }}>
                      Characteristic {index + 1}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Baloo2-Medium',
                        fontSize: 12,
                        color: 'lightgreen',
                      }}>
                      {item.uuid}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
}
