import {View, Dimensions, TouchableOpacity, Text} from 'react-native';
import mainStyle from '../../assets/style/theme.module.css';
import HeaderBar from '../../components/header-bar/HeaderBar';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {LineChart} from 'react-native-chart-kit';
import {useState} from 'react';
import {BluetoothService, defines} from '../../bluetoothz';
import {useSelector} from 'react-redux';
const LIVE_DATA_UUID = '7f51000c-1b15-11e5-b60b-1697f925ec7b';
const screenWidth = Dimensions.get('window').width;

const Pippo = ({uuid, charUUID}) => {
  const characteristic = useSelector(state => {
    const device = state.bluetooth.devices.filter(d => d.uuid === uuid)[0];
    const char = device.chars.filter(c => c.uuid === charUUID)[0];
    return char;
  });
  console.log(
    '++++++++++++++++++++++++++++++++++++++++++++++++++++++++++',
    characteristic,
  );

  return (
    <TouchableOpacity
      disabled={
        characteristic?.enable === undefined || characteristic?.enable === null
      }
      onPress={() => {
        //   setEnable(old => !old);
        BluetoothService.changeCharacteristicNotification(
          uuid,
          charUUID,
          !characteristic?.enable,
        );
      }}
      style={
        characteristic?.enable
          ? mainStyle.primaryButton
          : mainStyle.secondaryButton
      }>
      <Text
        style={
          characteristic?.enable
            ? mainStyle.primaryButtonLabel
            : mainStyle.secondaryButtonLabel
        }>
        Enable
      </Text>
    </TouchableOpacity>
  );
};

export default function CharOverview({route, navigation}) {
  const insets = useSafeAreaInsets();
  const {uuid, charUUID} = route.params;
  console.log('CharOverview - UUID', uuid);
  const data = useSelector(state => {
    let data = [];
    if (state.buffer?.hasOwnProperty(uuid)) {
      if (state.buffer[uuid]?.hasOwnProperty(charUUID)) {
        return state.buffer[uuid][charUUID];
      }
    }
    return data;
  });

  const name = charUUID.length < 8 ? charUUID : charUUID.substring(0, 8);
  return (
    <View
      style={[
        mainStyle.body,
        {
          paddingTop: insets.top,
          //   paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}>
      <HeaderBar title={name} navigation={navigation} onBackButton={() => {}} />

      {data.length > 0 && (
        <LineChart
          data={{
            // labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            labels: data.map(d => d.angle),
            datasets: [
              {
                data: data.map(d => d.torque),
                withDots: false,
              },
            ],
          }}
          width={screenWidth - 16}
          height={440}
          //   yAxisLabel="$"
          //   yAxisSuffix="k"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundGradientFrom: '#222',
            backgroundGradientFromOpacity: 0,
            backgroundGradientTo: '#222',
            backgroundGradientToOpacity: 0,
            decimalPlaces: 1, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 0, ${opacity})`,
            //   style: {
            //     borderRadius: 16,
            //   },
            // propsForDots: {r: 0},
            //   propsForDots: {
            //     r: '6',
            //     strokeWidth: '2',
            //     stroke: 'silver',
            //   },
          }}
          // bezier
          style={{
            marginVertical: 8,
            marginHorizontal: 8,
            borderRadius: 0,
          }}
        />
      )}

      <View style={{flex: 1}}>
        <View style={{flexDirection: 'row', margin: 8, gap: 16}}>
          <TouchableOpacity
            onPress={() => {
              BluetoothService.changeCharacteristicNotification(
                uuid,
                charUUID,
                true,
              );
            }}
            style={{backgroundColor: 'orange', padding: 10}}>
            <Text>START</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              BluetoothService.changeCharacteristicNotification(
                uuid,
                charUUID,
                false,
              );
            }}
            style={{backgroundColor: 'blue', padding: 10}}>
            <Text>STOP</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
