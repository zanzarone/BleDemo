import {View, Dimensions, TouchableOpacity, Text} from 'react-native';
import mainStyle from '../../assets/style/theme.module.css';
import HeaderBar from '../../components/header-bar/HeaderBar';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BluetoothService, defines} from '../../bluetoothz';
import {useSelector} from 'react-redux';
const LIVE_DATA_UUID = '7f51000c-1b15-11e5-b60b-1697f925ec7b';
const screenWidth = Dimensions.get('window').width;
// import {LineChart} from 'react-native-charts-wrapper';
import {LineChart} from 'react-native-chart-kit';

const chartConfig = {
  backgroundGradientFrom: '#222',
  backgroundGradientFromOpacity: 1,
  backgroundGradientTo: '#222',
  backgroundGradientToOpacity: 1,

  fillShadowGradientFrom: '#f00',
  fillShadowGradientFromOpacity: 0,
  fillShadowGradientTo: '#f00',
  fillShadowGradientToOpacity: 0,
  color: (opacity = 1) => `#023047`,
  labelColor: (opacity = 1) => `#fff`,
  strokeWidth: 2,

  useShadowColorFromDataset: false,
  decimalPlaces: 0,
};

export default function CharOverview({route, navigation}) {
  const insets = useSafeAreaInsets();
  const {uuid, charUUID} = route.params;
  const data = useSelector(state => {
    let data = [];
    if (state.bluetooth.buffer.hasOwnProperty(uuid)) {
      if (state.bluetooth.buffer[uuid]?.hasOwnProperty(charUUID)) {
        // console.log(
        //   '$$$$$$$$$$$$$$$$$$$$$$$$',
        //   state.bluetooth.buffer[uuid][charUUID],
        // );
        state.bluetooth.buffer[uuid][charUUID]?.map(item => {
          // console.log('$$$$$$$$$$$$$$$$$$$$$$$$', item);
          data.push({x: item.angle, y: item.torque});
        });
      }
    }
    return data;
  });

  const name = charUUID.length < 8 ? charUUID : charUUID.substring(0, 8);

  // console.log('$$$$$$$$$$$$$$$$$$$$$$$$', data);

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
            labels: [0, 45, 90, 135, 180, 225, 270, 315, 360],
            datasets: [
              {
                data: data.map(value => {
                  return value.y;
                }),
                color: (opacity = 1) => 'royalblue',
                strokeWidth: 3,
              },
            ],
          }}
          width={screenWidth}
          height={400}
          chartConfig={chartConfig}
          withDots={false}
          withInnerLines={false}
          withHorizontalLines={false}
          withVerticalLines={false}
          segments={8}
          // yAxisLabel="$"
          yAxisSuffix=" N"
          formatXLabel={v => `${v}°`}
          // verticalLabelRotation={45}
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
