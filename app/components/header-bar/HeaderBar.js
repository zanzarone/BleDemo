import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/Feather';

export default function HeaderBar({title, user = null, dropDown = null}) {
  return (
    <View style={[styles.header, {justifyContent: 'space-between'}]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{title}</Text>
        {dropDown && (
          <Icon name="chevron-down" size={30} color="#555" style={{}} />
        )}
      </View>
      <View style={{marginRight: 15}}>
        {user && (
          <TouchableOpacity>
            <View
              style={{
                height: 50,
                width: 50,
                backgroundColor: '#222',
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={require('../../assets/26628675.jpeg')}
                style={{
                  height: 40,
                  width: 40,
                  resizeMode: 'contain',
                  borderRadius: 10,
                  borderColor: '#555',
                  borderWidth: 1,
                }}
              />
              {/* <Icon name="user" size={24} color="#fff" /> */}
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

let styles;
if (Platform.OS === 'android') {
  styles = StyleSheet.create({
    header: {
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#0a0911',
      height: 70,
    },
    headerTitle: {
      marginLeft: 15,
      fontSize: 38,
      fontFamily: 'Baloo2-SemiBold',
      color: '#fff',
    },
  });
} else {
  styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      // backgroundColor: '#f00',
      gap: 1,
      // height: 80,
    },
    headerTitle: {
      marginLeft: 15,
      // flexDirection: 'row',
      fontSize: 32,
      fontFamily: 'Baloo2-Medium',
      color: '#fff',
      // backgroundColor: '#0f0',
      // height: '100%',
    },
  });
}
