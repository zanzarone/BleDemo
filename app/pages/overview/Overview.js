import React from 'react';
import mainStyle from '../../assets/style/theme.module.css';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import HeaderBar from '../../components/header-bar/HeaderBar';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/dist/Feather';

const screenWidth = Dimensions.get('window').width;
// console.log(screenWidth);

function Activity({title, time, distance, map}) {
  return (
    <View
      key={title}
      style={[
        {
          flexDirection: 'row',
          backgroundColor: '#171717',
          borderRadius: 15,
          padding: 15,
          gap: 10,
          justifyContent: 'space-between',
          marginBottom: 10,
        },
        style.shadow,
      ]}>
      <View style={{flexDirection: 'row', gap: 10}}>
        <View
          style={{
            height: 55,
            width: 55,
            backgroundColor: '#000',
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon name={map} color="lightgreen" size={26} />
        </View>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'flex-start',
            gap: 0,
          }}>
          <Text
            style={{
              fontFamily: 'Baloo2-Bold',
              fontSize: 16,
              color: '#fff',
              // backgroundColor: 'red',
              flex: 1,
              // textAlignVertical: 'top',
            }}>
            {title}
          </Text>
          <View style={{flex: 2, flexDirection: 'row', gap: 5}}>
            <Icon name="clock" color="#555" size={16} />
            <Text style={{color: '#555'}}>{time}</Text>
          </View>
        </View>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
        <Icon name="map" size={20} color="#555" />
        <Text
          style={{
            color: '#fff',
            fontFamily: 'Baloo2-Medium',
            fontSize: 18,
          }}>
          {distance} km
        </Text>
      </View>
    </View>
  );
}

function RecentActivityCard() {
  const activities = [
    {
      title: 'No pain, no gain',
      time: '01:10:20',
      distance: '18.3',
      map: 'git-branch',
    },
    {
      title: '⚡️ WATTopia',
      time: '02:00:32',
      distance: '22.2',
      map: 'git-merge',
    },
    {
      title: 'Rest(in peace ✝)',
      time: '00:50:24',
      distance: '8.3',
      map: 'git-pull-request',
    },
    {
      title: '💪 Thougt afternoon',
      time: '00:50:24',
      distance: '8.3',
      map: 'git-branch',
    },
  ];
  return (
    <View
      style={{
        backgroundColor: '#222',
        flex: 1,
        borderRadius: 20,
        marginLeft: 10,
        marginRight: 10,
        flexDirection: 'column',
        padding: 20,
        gap: 10,
        maxHeight: 390,
      }}>
      <View
        style={{
          //   backgroundColor: 'red',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            fontFamily: 'Baloo2-SemiBold',
            fontSize: 26,
            color: '#fff',
          }}>
          Recent Activity
        </Text>
        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{color: '#fff'}}>See all</Text>
          <Icon name="chevron-right" color="#555" size={28} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          //   backgroundColor: 'red',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
        }}>
        <Text style={{fontSize: 22}}>🔥</Text>
        <Text
          style={{
            fontFamily: 'Baloo2-Medium',
            fontSize: 16,
            color: '#fff',
          }}>
          2,154
        </Text>
        <Text
          style={{
            fontFamily: 'Baloo2-Medium',
            fontSize: 16,
            color: '#555',
          }}>
          kcal burnt
        </Text>
      </View>
      <ScrollView nestedScrollEnabled={true}>
        {activities.map(a => (
          <Activity
            key={a.title}
            title={a.title}
            time={a.time}
            distance={a.distance}
            map={a.map}
          />
        ))}
      </ScrollView>
    </View>
  );
}

import {LineChart, ProgressChart} from 'react-native-chart-kit';

function PowerSummaryChart() {
  return (
    <View
      style={{
        backgroundColor: '#222',
        flex: 1,
        borderRadius: 20,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        flexDirection: 'column',
        padding: 20,
        gap: 10,
      }}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'column'}}>
          <Text
            style={{
              fontFamily: 'Baloo2-Medium',
              fontSize: 16,
              color: '#555',
            }}>
            Now
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: 'Baloo2-SemiBold',
                fontSize: 24,
                color: '#fff',
              }}>
              Week
            </Text>
            <Icon name="chevron-down" size={30} color="#555" style={{}} />
          </View>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          <TouchableOpacity
            style={{
              height: 35,
              width: 35,
              // backgroundColor: 'lightgreen',
              borderColor: '#555',
              borderWidth: 1,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon name="activity" size={16} color="#555" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: 35,
              width: 35,
              backgroundColor: 'lightgreen',
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon name="map" size={16} />
          </TouchableOpacity>
        </View>
      </View>
      {/* <View> */}
      <ProgressChart
        data={{
          labels: ['Swim', 'Bike', 'Run'], // optional
          data: [0.4, 0.6, 0.8],
        }}
        width={screenWidth - 80}
        height={220}
        strokeWidth={16}
        radius={32}
        chartConfig={{
          // backgroundColor: '#171717',
          backgroundGradientFrom: '#222',
          backgroundGradientTo: '#222',
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: 'silver',
          },
        }}
        hideLegend={false}
      />
      {/* </View> */}
    </View>
  );
}

function PowerSummaryChart2() {
  return (
    <View
      style={{
        backgroundColor: '#222',
        flex: 1,
        borderRadius: 20,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        flexDirection: 'column',
        padding: 20,
        gap: 10,
      }}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'column'}}>
          <Text
            style={{
              fontFamily: 'Baloo2-Medium',
              fontSize: 16,
              color: '#555',
            }}>
            Now
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: 'Baloo2-SemiBold',
                fontSize: 24,
                color: '#fff',
              }}>
              Week
            </Text>
            <Icon name="chevron-down" size={30} color="#555" style={{}} />
          </View>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          <TouchableOpacity
            style={{
              height: 35,
              width: 35,
              // backgroundColor: 'lightgreen',
              borderColor: '#555',
              borderWidth: 1,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon name="activity" size={16} color="#555" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: 35,
              width: 35,
              backgroundColor: 'lightgreen',
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon name="map" size={16} />
          </TouchableOpacity>
        </View>
      </View>
      {/* <View> */}
      <LineChart
        data={{
          labels: ['January', 'February', 'March', 'April', 'May', 'June'],
          datasets: [
            {
              data: [
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
              ],
            },
          ],
        }}
        width={screenWidth - 60}
        height={220}
        yAxisLabel="$"
        yAxisSuffix="k"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          // backgroundColor: '#171717',
          backgroundGradientFrom: '#222',
          backgroundGradientTo: '#222',
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: 'silver',
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
      {/* </View> */}
    </View>
  );
}

export default function Overview() {
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
      <HeaderBar title="Overview" />
      <ScrollView
        nestedScrollEnabled={true}
        style={{
          flexDirection: 'column',
          flex: 1,
          // gap: 20,
          paddingTop: 10,
          // backgroundColor: 'pink',
        }}>
        <RecentActivityCard />
        <PowerSummaryChart />
        <PowerSummaryChart2 />
        <View style={{marginBottom: 90}}></View>
      </ScrollView>
    </View>
  );
}

let style = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
