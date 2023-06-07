import {
  BleError,
  Characteristic,
  Device,
  Subscription,
} from 'react-native-ble-plx';
import {Buffer} from 'buffer';
//import {storeItem} from './storeItem';
import {getDeviceIdFromRealm, storeDeviceIdInRealm} from './realmDevice';
import {Record} from './storage';

export const getService = async (
  device: Device,
  setLux: React.Dispatch<React.SetStateAction<number>>,
  monitor: Subscription | null,
  setMonitor: React.Dispatch<React.SetStateAction<Subscription | null>>,
  setDevice: React.Dispatch<React.SetStateAction<Device | null>>,
  storeData: (record: Record) => Promise<void>,
  maxTries: number,
) => {
  let disconnectListener: Subscription | null = null;
  try {
    disconnectListener = device.onDisconnected(err => {
      console.log('DEVICE DISCONNECTED!!!!!!!!');
      console.log('err ', err);
    });

    // Resource Management: Stop previous monitoring
    if (monitor) {
      monitor.remove();
      setMonitor(null);
    }

    const serviceUUID = '9A48ECBA-2E92-082F-C079-9E75AAE428B1';
    const characteristicUUID = '1A3AC130-31EE-758A-BC50-54A61958EF81';
    const ackCharacteristicUUID = '2B1CC222-AAEE-BA8A-1250-14C21958E333';
    const timeCharacteristicUUID = '3B123AAA-BBEE-1325-5555-54BCAB58EF81';

    console.log('getService: ', device.id);

    await device.connect().catch(e => console.log('CONNECT ERROR', e.message));

    storeDeviceIdInRealm(device.id);

    await device.discoverAllServicesAndCharacteristics();

    const services = await device.services();

    console.log('Available services:', services);

    const service = services.find(
      s => s.uuid.toLowerCase() === serviceUUID.toLowerCase(),
    );

    if (!service) {
      console.log('No service found');
      throw new Error('Service not found');
    }

    console.log('Service found:', service.uuid);

    const characteristics = await device.characteristicsForService(
      service.uuid,
    );

    const luxCharacteristic = characteristics.find(
      c => c.uuid.toLowerCase() === characteristicUUID.toLowerCase(),
    );
    const ackCharacteristic = characteristics.find(
      c => c.uuid.toLowerCase() === ackCharacteristicUUID.toLowerCase(),
    );
    const timeCharacteristic = characteristics.find(
      c => c.uuid.toLowerCase() === timeCharacteristicUUID.toLowerCase(),
    );

    if (!luxCharacteristic || !ackCharacteristic || !timeCharacteristic) {
      console.log('Characteristic not found: ');
      [luxCharacteristic, ackCharacteristic, timeCharacteristic].forEach(
        (c, i) => {
          if (c === undefined) {
            console.log(' CharIndex: ', i);
          }
        },
      );
      throw new Error('Characteristic not found');
    }

    console.log('Characteristics found');

    const timebase = await device
      .readCharacteristicForService(serviceUUID, timeCharacteristicUUID)
      .then(
        c =>
          c.value
            ? new Date(
                Date.now() - Buffer.from(c.value || '', 'base64').readInt32LE(),
              )
            : new Date(1), // If c.value is undefined, returns a recognizable really old date
      );

    console.log('Timebase:', timebase.toISOString());

    setMonitor(
      luxCharacteristic.monitor(
        async (error: BleError | null, char: Characteristic | null) => {
          if (error && getDeviceIdFromRealm()) {
            console.log('Monitor error: Retry:');
            setTimeout(() => {
              getService(
                device,
                setLux,
                monitor,
                setMonitor,
                setDevice,
                storeData,
                maxTries - 1,
              );
              return;
            }, 1000);
          }
          if (!char) {
            console.log('No characteristic provided in monitor callback');
            return;
          }
          if (char.uuid.toLowerCase() === characteristicUUID.toLowerCase()) {
            const dataString = Buffer.from(char.value || '', 'base64').toString(
              'utf-8',
            );
            if (dataString !== 'BUFFER_EMPTY') {
              console.log(
                'CHARACTERISTIC ',
                char.value,
                'DATA STRING ',
                dataString,
              );
              const [luxString, arduinoTimestampString] = dataString.split(',');
              const lux = parseInt(luxString, 10);
              const arduinoTimestamp =
                timebase.getTime() + parseInt(arduinoTimestampString, 10);
              console.log('Store data', {
                lux,
                time: arduinoTimestamp,
                latitude: 0,
                longitude: 0,
              });
              storeData({
                lux,
                time: arduinoTimestamp,
                latitude: 0,
                longitude: 0,
              });
              console.log('Lux:', lux);
              console.log(
                'Arduino Timestamp and timebase and arduinoTimestampString parsed:',
                arduinoTimestampString,
                '\n',
                timebase,
                '\n',
                parseInt(arduinoTimestampString, 10),
              );
              console.log('actual time:', arduinoTimestamp);

              setLux(lux);

              console.log('Device exists right?', device.name);
              setDevice(device);

              // Send acknowledgment to the Arduino
              const isConnected = await device.isConnected();

              if (isConnected) {
                console.log('Was connected');
                await device.discoverAllServicesAndCharacteristics();
                await device
                  .writeCharacteristicWithResponseForService(
                    serviceUUID.toLowerCase(),
                    ackCharacteristicUUID.toLowerCase(),
                    Buffer.from([1]).toString('base64'),
                  )
                  .then(e => console.log('ACK SUCCEED', e.value))
                  .catch(e => console.log('ACK FAIL', e));
              } else {
                console.log('Device is not connected');
                device
                  .connect()
                  .then(() => {
                    device
                      .discoverAllServicesAndCharacteristics()
                      .then(() => {
                        device
                          .writeCharacteristicWithResponseForService(
                            serviceUUID,
                            ackCharacteristicUUID,
                            Buffer.from([1]).toString('base64'),
                          )
                          .then(recon =>
                            console.log('\nReconnect ACK\n', recon.value),
                          )
                          .catch(writeErr =>
                            console.log('Get service writeErr', writeErr),
                          );
                      })
                      .catch(e => {
                        console.log('RECONNECT DISCOVER', e.message);
                      });
                  })
                  .catch(e => console.log('RECONNECT DISGRACE', e.message));
              }
            } else {
              console.log('BUFFER_EMPTY');
            }
          }
        },
      ),
    );

    console.log('Monitor started');
  } catch (error) {
    console.log('Error connecting to device', device.id, error, monitor);
    if (maxTries > 0 && getDeviceIdFromRealm()) {
      console.log(`Retrying connection...${maxTries} tries left`);
      console.log('getService Retry', device.id);
      setTimeout(async () => {
        try {
          console.log('again');
          if (disconnectListener) {
            disconnectListener.remove();
          }
          await device.cancelConnection();
          getService(
            device,
            setLux,
            monitor,
            setMonitor,
            setDevice,
            storeData,
            maxTries - 1,
          ).catch(e => console.log('RETRY FAILED', e.message));
        } catch (err) {
          console.error('Error in getService inside monitor callback:', err);
        }
      }, 1000);
    }
  }
};
