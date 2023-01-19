import React, {useEffect, useState} from 'react';
import {
  Button,
  Permission,
  PermissionsAndroid,
  Text,
  TextInput,
  View,
} from 'react-native';
import {BleManager, Device, Subscription} from 'react-native-ble-plx';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import {LogBox} from 'react-native';
import {Buffer} from 'buffer';
import {AsyncStorageHook} from '@react-native-async-storage/async-storage/lib/typescript/types';
import {DeviceList} from './DeviceList';
import {
  GeoPoint,
  updateDoc,
  doc,
  arrayUnion,
  getDoc,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import {auth, db} from '../../../firebase';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {connectToClassic} from '../../util/classicConnect';
import Location from 'react-native-get-location';
import notifee, {AndroidVisibility} from '@notifee/react-native';
import {USER, PASS} from '@env';

LogBox.ignoreLogs(['new NativeEventEmitter']);
type Records = [
  {
    time: Timestamp;
    location: GeoPoint;
    lux: number;
  },
];

const storeItem = (lux: number, storage: AsyncStorageHook) => {
  Location.getCurrentPosition({enableHighAccuracy: true, timeout: 8000}).then(
    location => {
      storage
        .getItem()
        .then(item => {
          let newItem: Records = [
            {
              lux: lux,
              location: new GeoPoint(location.latitude, location.longitude),
              time: Timestamp.now(),
            },
          ];
          if (item) {
            let current: Records = JSON.parse(item);
            storage.setItem(JSON.stringify(current.concat(newItem)));
          } else {
            storage.setItem(JSON.stringify(newItem));
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
  );
};

const getService = async (
  e: Device,
  setLux: React.Dispatch<React.SetStateAction<number>>,
  monitor: Subscription | null,
  storage: AsyncStorageHook,
  setDevice: React.Dispatch<React.SetStateAction<string>>,
  maxTries: number,
) => {
  e.discoverAllServicesAndCharacteristics()
    .then(() => {
      console.log('11', e);
      e.characteristicsForService('9A48ECBA-2E92-082F-C079-9E75AAE428B1')
        .then(c => {
          console.log('22');
          c.forEach(f => {
            console.log('uuid ', f.uuid, 'service uuid ', f.serviceUUID);
            if (f.uuid.includes('1a3ac130')) {
              monitor = f.monitor((h, char) => {
                if (h) {
                  console.log('monitor ', h.message);
                }
                if (char) {
                  if (char.uuid.includes('1a3ac130')) {
                    const count = Buffer.from(char.value || '', 'base64')
                      .swap32()
                      .readInt32BE(0);
                    setLux(count);
                    storeItem(count, storage);
                    console.log(count);
                    setDevice(e.id + e.localName + e.name);
                  }
                }
              });
            }
          });
          console.log('Should have worked!');
        })
        .catch(err => {
          console.log('ERRRRRR: ', err);
          maxTries > 0 ??
            getService(e, setLux, monitor, storage, setDevice, maxTries - 1);
        });
    })
    .catch(err => {
      console.log('service error', err); //Make it a while or recursive so it keeps trying until it gets data
      maxTries > 0 ??
        getService(e, setLux, monitor, storage, setDevice, maxTries - 1);
    });
};

const requestCameraPermission = async (perm: Permission) => {
  try {
    const granted = await PermissionsAndroid.request(perm, {
      title: 'Cool Photo App Camera Permission',
      message:
        'Cool Photo App needs access to your camera ' +
        'so you can take awesome pictures.',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    });
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use ', perm);
    } else {
      console.log(perm, ' permission denied');
    }
  } catch (err) {
    console.log('ERROR');
    console.warn(err);
  }
};

export const Connect = () => {
  const storage = useAsyncStorage('lightData');
  const manager = new BleManager();
  var monitor: Subscription | null;
  const [lux, setLux] = useState(0);
  const [device, setDevice] = useState('');
  const [deviceList, setDeviceList] = useState<Device[]>([]);
  const [email, setEmail] = useState(USER);
  const [password, setPassword] = useState(PASS);

  const handleSubmit = async () => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  useEffect(() => {
    let permissions: Permission[] = [
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
      PermissionsAndroid.PERMISSIONS.CAMERA,
    ];
    permissions.forEach(perm => {
      console.log(perm);
      requestCameraPermission(perm);
    });
  }, []);

  return (
    <View>
      <TextInput
        placeholder="email"
        onChangeText={t => setEmail(t)}
        defaultValue={USER}
      />
      <TextInput
        placeholder="password"
        onChangeText={t => setPassword(t)}
        defaultValue={PASS}
      />
      <Button
        title="Log in"
        onPress={() => {
          console.log(email, password);
          handleSubmit().then(
            e => {
              console.log('1', e);
            },
            e => {
              console.log('2', e);
            },
          );
        }}
      />
      <Button
        title="Connect"
        onPress={() => {
          console.log('REMOVE!', monitor);
          /*           if (monitor) {
            //monitor.remove();
            //monitor = null;
          } else { */
          console.log('Devices');
          manager
            .connectToDevice('24:9E:FE:8D:68:01')
            .then(e => {
              console.log('connected!');
              getService(e, setLux, monitor, storage, setDevice, 10);
              setDevice('connecting to: ' + e.id);
            })
            .catch(e => {
              console.log('connection failed: ', e);
            });
          //}
        }}
      />
      <Button
        title="Sync"
        onPress={async () => {
          try {
            console.log('Add doc');
            const docRef = doc(db, 'test/newDoc');
            getDoc(docRef).then(d => {
              console.log('SET');
              storage.getItem((e, values) => {
                // Note that this will not add duplicate elements! Okay in this case because of timestamp though
                if (!e && values) {
                  let storedData: Records = JSON.parse(values);
                  let formatted = arrayUnion(...storedData);
                  d.exists()
                    ? updateDoc(docRef, {
                        values: formatted,
                      }).then(() => storage.removeItem())
                    : setDoc(docRef, {
                        values: formatted,
                      }).then(() => storage.removeItem());
                  console.log('Document written with ID: ', docRef.id);
                } else {
                  console.log(e);
                }
              });
            });
          } catch (e) {
            console.error('Error adding document: ', e);
          }
        }}
      />
      <Button
        title="Clear Storage"
        onPress={() => {
          storage.removeItem();
          console.log('Clear!');
          /* manager.startDeviceScan(
            ['9A48ECBA-2E92-082F-C079-9E75AAE428B1'],
            null,
            (e, d) => {
              console.log('FOUND!', d?.id, d?.localName, d?.serviceUUIDs);
              if (e) {
                console.log(e);
              }
              console.log(d?.localName);
              //console.log(d);
              if (
                d &&
                deviceList.find(item => item.id === d.id) === undefined
              ) {
                deviceList.forEach(dev => {
                  console.log(dev.id, ' - ', d.id);
                });
                console.log(
                  'deviceList: ',
                  deviceList.find(item => item.id === d.id),
                  '\n',
                  deviceList,
                );
                setDeviceList(deviceList.concat([d]));
              }
            },
          ); */
        }}
      />
      <Button
        title="Disconnect"
        onPress={() => {
          monitor?.remove();
          setDevice('');
        }}
      />
      <Button
        title="Print data"
        onPress={() => {
          storage.getItem((e, item) => {
            console.log('Print data: ', item);
          });
        }}
      />
      <Button
        title="Store Test Data"
        onPress={() => {
          storeItem(123, storage);
        }}
      />
      <Button
        title="BT Classic Connect"
        onPress={async () => {
          let connected = await connectToClassic('00:18:E4:40:00:06');
          setDevice(connected.name);
          connected.onDataReceived(data => {
            let lightValue = parseInt(data.data, 10);
            if (lightValue) {
              setLux(lightValue);
              storeItem(lightValue, storage);
              console.log(data.data);
            }
          });
        }}
      />
      <Button
        title="Notify!"
        onPress={() => {
          notifee
            .createChannel({
              id: 'default',
              name: 'Default Channel',
            })
            .then(channelId => {
              notifee.onForegroundEvent(e => {
                console.log(e);
              });
              notifee.displayNotification({
                title: 'Foreground Service Notification',
                body: 'Press the Quick Action to stop the service',
                android: {
                  channelId,
                  asForegroundService: true,
                  visibility: AndroidVisibility.PUBLIC,
                },
              });
            });

          console.log('NOTIFY!');
        }}
      />
      <Text style={{fontSize: 30}}>{lux.toString()}</Text>
      <Text style={{fontSize: 30}}>Connected to: {device}</Text>
      <DeviceList devices={deviceList} />
    </View>
  );
};
