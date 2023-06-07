import React, {
  createContext,
  useMemo,
  useState,
  useEffect,
  useContext,
} from 'react';
import {BleManager, Device, Subscription} from 'react-native-ble-plx';
import {ProviderProps} from './ThemeContext';

interface DeviceContextProps {
  device: Device | null;
  setDevice: React.Dispatch<React.SetStateAction<Device | null>>;
  monitor: Subscription | null;
  setMonitor: React.Dispatch<React.SetStateAction<Subscription | null>>;
  deviceList: Device[];
  setDeviceList: React.Dispatch<React.SetStateAction<Device[]>>;
  overlayVisible: boolean;
  setOverlayVisible: React.Dispatch<React.SetStateAction<boolean>>;
  manager?: BleManager;
}

export const DeviceContext = createContext<DeviceContextProps>({
  device: null,
  setDevice: () => {
    console.log('it should never get here', 1);
  },
  monitor: null,
  setMonitor: () => {
    console.log('it should never get here', 2);
  },
  deviceList: [],
  setDeviceList: () => {
    console.log('it should never get here', 3);
  },
  overlayVisible: false,
  setOverlayVisible: () => {
    console.log('it should never get here', 4);
  },
});

export const useDevice = () => useContext(DeviceContext);

export const DeviceProvider: React.FC<ProviderProps> = ({
  children,
}: ProviderProps) => {
  const manager = useMemo(() => new BleManager(), []);
  const [monitor, setMonitor] = useState<Subscription | null>(null);
  const [device, setDevice] = useState<Device | null>(null);
  const [deviceList, setDeviceList] = useState<Device[]>([]);
  const [overlayVisible, setOverlayVisible] = useState(false);

  useEffect(() => {
    if (overlayVisible) {
      manager.startDeviceScan(null, null, (error, scannedDevice) => {
        if (error) {
          console.log('startDeviceScan failed:', error);
        }

        if (scannedDevice?.name?.includes('Nano')) {
          setDeviceList(prev =>
            prev.find(dev => dev.id === scannedDevice.id)
              ? prev
              : [...prev, scannedDevice],
          );
        }
      });
    } else {
      manager.stopDeviceScan();
      deviceList.length !== 0 && setDeviceList([]);
    }
  }, [overlayVisible, manager, deviceList]);

  useEffect(() => {
    device && setOverlayVisible(false);
  }, [device]);

  useEffect(() => {
    console.log('\n\nmonitor', monitor === null);
  }, [monitor]);

  return (
    <DeviceContext.Provider
      value={{
        manager,
        device,
        setDevice,
        monitor,
        setMonitor,
        deviceList,
        setDeviceList,
        overlayVisible,
        setOverlayVisible,
      }}>
      {children}
    </DeviceContext.Provider>
  );
};
