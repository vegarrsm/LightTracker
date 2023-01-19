import {Text, View} from 'react-native';
import {Device} from 'react-native-ble-plx';
import React from 'react';

export const DeviceList: React.FC<{devices: Device[]}> = ({devices}) => {
  console.log(devices);
  return (
    <View>
      {devices.map(d => (
        <View>
          <Text>{d.id + ' | ' + d.name}</Text>
        </View>
      ))}
    </View>
  );
};
