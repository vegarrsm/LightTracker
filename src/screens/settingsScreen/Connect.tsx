import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {getService} from '../../util/getService';
import {useLux} from '../../contexts/LuxContext';
import {useDevice} from '../../contexts/DeviceContext';
import TextButton from '../../components/buttons/TextButton';
import {useTheme} from '../../contexts/ThemeContext';
import DeviceListOverlay from '../../components/overlays/DeviceListOverlay';
import StorageControls from './StorageControls';
import {deleteDeviceFromRealm} from '../../util/realmDevice';
import useDeviceScan from '../../util/deviceScan';
import useRecordStorage from '../../util/storage';

export const Connect: React.FC = () => {
  const {device, setDevice, monitor, setMonitor, manager} = useDevice();
  const [overlayVisible, setOverlayVisible] = useState(false);
  const {setLux} = useLux();
  const {currentTheme} = useTheme();
  const {storeData} = useRecordStorage();
  const {deviceList, startScan, stopScan} = useDeviceScan({
    manager: manager,
    scanFilter: d => d?.name?.includes('Nano') || false,
  });

  useEffect(() => {
    console.log('startscan infinite?', overlayVisible);
    if (overlayVisible) {
      startScan();
    } else {
      stopScan();
    }
  }, [overlayVisible, startScan, stopScan]);

  useEffect(() => {
    console.log(deviceList);
  }, [deviceList]);

  useEffect(() => {
    device && setOverlayVisible(false);
  }, [device, setOverlayVisible]);

  return (
    <View style={{width: '80%', ...currentTheme}}>
      <Text style={{...currentTheme.h2, marginBottom: 10, marginTop: 30}}>
        Sensor
      </Text>
      {/*Consider a separate color for these titles */}
      <Text style={{...currentTheme.h3}}>
        {device ? 'Connected to: ' + device?.name : 'No device connected'}
      </Text>
      <TextButton
        title="Pair Device"
        onPress={() => {
          setOverlayVisible(true);
        }}
      />
      <TextButton
        title="Disconnect"
        onPress={() => {
          device?.cancelConnection();
          monitor?.remove();
          deleteDeviceFromRealm();
          console.log('DISCONNECTING DEVICE IN Connect.tsx button');
          setDevice(null);
        }}
      />
      <StorageControls />
      <DeviceListOverlay
        visible={overlayVisible}
        devices={deviceList}
        onSelect={d => {
          console.log('Device overlay getService');
          getService(d, setLux, monitor, setMonitor, setDevice, storeData, 10);
        }}
        setVisible={setOverlayVisible}
      />
    </View>
  );
};
