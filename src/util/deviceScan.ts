import {useEffect, useState, useCallback} from 'react';
import {BleManager, Device} from 'react-native-ble-plx';

type UseDeviceScanOptions = {
  manager?: BleManager;
  scanFilter: (device: Device) => boolean;
};

type ScanStateType = {
  isScanning: boolean;
  activeScanFilter: (device: Device) => boolean;
};

const useDeviceScan = ({manager, scanFilter}: UseDeviceScanOptions) => {
  const [deviceList, setDeviceList] = useState<Device[]>([]);
  const [scanState, setScanState] = useState<ScanStateType>({
    isScanning: false,
    activeScanFilter: scanFilter,
  });

  useEffect(() => {
    console.log('\n\nDeviceScanMount\n\n');
  }, []);

  useEffect(() => {
    if (!manager) {
      console.log('\n\n\n\n\nNo manager!!!\n\n\n\n');
    }
    console.log(scanState.isScanning ? 'START' : 'STOP');
    if (manager) {
      if (scanState.isScanning) {
        manager.startDeviceScan(null, null, (error, scannedDevice) => {
          //console.log('scannedDevice', scannedDevice?.id);
          if (error) {
            console.log('startDeviceScan failed:', error);
            return;
          }

          if (scannedDevice && scanState.activeScanFilter(scannedDevice)) {
            console.log('\n\nFOUND IT\n\n\n', scannedDevice?.id);
            setDeviceList(prev =>
              prev.find(dev => dev.id === scannedDevice.id)
                ? prev
                : [...prev, scannedDevice],
            );
          }
        });
      } else {
        console.log('\n\nNo longer scanning\n\n');
        manager.stopDeviceScan();
        deviceList.length !== 0 && setDeviceList([]); // This is probably the cause
      }
    }
  }, [scanState, manager, deviceList]);

  const startScan = useCallback(
    (optionalFilter?: (device: Device) => boolean) => {
      console.log('startIIIIING', optionalFilter !== undefined);
      optionalFilter
        ? setScanState({activeScanFilter: optionalFilter, isScanning: true})
        : setScanState(prev => ({...prev, isScanning: true}));
    },
    [], // add dependencies if needed
  );

  const stopScan = useCallback(
    () => {
      console.log('EEEEENNNNDing');
      setScanState(prev => ({...prev, isScanning: false}));
    },
    [], // add dependencies if needed
  );

  return {
    deviceList,
    startScan,
    stopScan,
    isScanning: scanState.isScanning,
  };
};

export default useDeviceScan;
