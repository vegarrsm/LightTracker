import Realm from 'realm';

// Define your Realm schema structure
const DeviceSchema = {
  name: 'Device',
  properties: {
    id: 'string',
  },
};
interface DeviceObject {
  id: string;
}

// Create a new Realm instance
const realm = new Realm({schema: [DeviceSchema]});

export const storeDeviceIdInRealm = async (deviceId: string) => {
  try {
    realm.write(() => {
      // delete all existing devices
      let allDevices = realm.objects('Device');
      realm.delete(allDevices);

      // add the new device
      realm.create('Device', {id: deviceId});
    });
  } catch (error) {
    console.log('Error storing device ID in Realm', error);
  }
};

export const getDeviceIdFromRealm = (): string | null => {
  let device = realm.objects<DeviceObject>('Device')[0]; // get the first (and only) device
  return device ? device.id : null; // return the device id or null if no device is found
};

export const deleteDeviceFromRealm = () => {
  try {
    realm.write(() => {
      let allDevices = realm.objects('Device');
      realm.delete(allDevices); // delete all devices
    });
  } catch (error) {
    console.log('Error deleting device from Realm', error);
  }
};
