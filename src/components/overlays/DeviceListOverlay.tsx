// DeviceListOverlay.tsx
import React, {useEffect} from 'react';
import {TouchableOpacity, Text, View} from 'react-native';
import {Device} from 'react-native-ble-plx';
import Overlay from './Overlay';
import {useTheme} from '../../contexts/ThemeContext';
import {buttonStyles} from '../buttons/TextButton';
import Loading from '../loading/Loading';

interface DeviceListOverlayProps {
  visible: boolean;
  devices: Device[];
  onSelect: (device: Device) => void;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

interface DeviceButtonProps {
  device: Device;
  onSelect: (device: Device) => void;
}

const DeviceButton: React.FC<DeviceButtonProps> = ({device, onSelect}) => {
  const {currentTheme} = useTheme();
  const [connecting, setConnecting] = React.useState(false);

  return (
    <TouchableOpacity
      style={{}}
      onPress={() => {
        onSelect(device);
        setConnecting(true);
      }}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          backgroundColor: currentTheme.primary,
          ...buttonStyles.button,
        }}>
        <View
          style={{
            alignItems: 'flex-start',
            width: '90%',
          }}>
          <Text
            style={{
              ...currentTheme.h2,
              color: currentTheme.textSecondary,
              width: '100%',
            }}
            numberOfLines={2}>
            {'name: ' + device.name}
          </Text>
          <Text
            style={{
              ...currentTheme.bodyText,
              color: currentTheme.textSecondary,
            }}>
            {'id: ' + device.id}
          </Text>
        </View>
        <View
          style={{
            marginRight: '10%',
          }}>
          {connecting && <Loading size={'small'} color="#000000" />}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const DeviceListOverlay: React.FC<DeviceListOverlayProps> = ({
  visible,
  devices,
  onSelect,
  setVisible,
}) => {
  const {currentTheme} = useTheme();

  useEffect(() => {
    console.log('deviceList mounted');
  }, [onSelect]);

  return (
    <Overlay visible={visible} setVisible={setVisible}>
      <Text style={{...currentTheme.h1}}>Choose a sensor: </Text>
      <View style={{width: '70%'}}>
        {devices.map(device => (
          <DeviceButton key={device.id} device={device} onSelect={onSelect} />
        ))}
      </View>
    </Overlay>
  );
};

export default DeviceListOverlay;
