import React, {useState} from 'react';
import mainStyle from '../../assets/style/theme.module.css';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import HeaderBar from '../../components/header-bar/HeaderBar';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

const types = [
  {name: 'SRM', colors: ['red', 'black']},
  {name: 'Peloton', colors: ['#7117ea', '#ea6060']},
  {name: 'Chrono', colors: ['#ea506f', '#de7919', '#fccf3a']},
  {name: 'MTB', colors: ['#276174', '#33c58e', '#63fd88']},
  {name: 'Free', colors: ['#5c2774', '#335cc5', '#637ffd']},
  // {name: 'MTB', colors: ['red', 'black']},
];

export default function ArrangeDisplayScreen({navigation}) {
  const insets = useSafeAreaInsets();
  const [type, setType] = useState(0);
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
      <HeaderBar navigation={navigation} title="Screens" />
      <View style={{marginLeft: 15, gap: 1}}>
        <Text
          style={{fontSize: 24, color: '#fff', fontFamily: 'Baloo2-Regular'}}>
          Type
        </Text>
        <Text
          style={{fontSize: 18, color: '#777', fontFamily: 'Baloo2-Medium'}}>
          Select a starting configuration
        </Text>
        <ScrollView horizontal>
          {types.map((i, index) => {
            return (
              <LinearGradient
                style={{
                  width: 130,
                  height: 130,
                  borderRadius: 20,
                  marginRight: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: index == type ? 4 : 0,
                  borderColor: 'white',
                }}
                colors={i.colors}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}>
                <TouchableOpacity
                  onPress={() => {
                    setType(index);
                  }}>
                  <Text style={{fontFamily: 'Baloo2-Bold', fontSize: 32}}>
                    {i.name}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            );
          })}
        </ScrollView>
      </View>
      <View style={{marginLeft: 15, gap: 1}}>
        <Text
          style={{fontSize: 24, color: '#fff', fontFamily: 'Baloo2-Regular'}}>
          Configure
        </Text>
        <Text
          style={{fontSize: 18, color: '#777', fontFamily: 'Baloo2-Medium'}}>
          Select a starting configuration
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
