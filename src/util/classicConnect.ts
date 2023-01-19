import RNBluetoothClassic, {
  BluetoothDevice,
} from 'react-native-bluetooth-classic';

export const connectToClassic = (id: string): Promise<BluetoothDevice> => {
  //should check if device already connected, if so return it
  return RNBluetoothClassic.connectToDevice(id);
};
