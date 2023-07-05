import Location from 'react-native-get-location';
import Realm from 'realm';
import {Record} from './storage';

// Moved away from Realm, but keeping this code for reference
export const storeItem = (lux: number, timestamp: number) => {
  console.log('storeItem: ', lux, new Date(timestamp).toISOString());
  // Get the current location
  /* Location.getCurrentPosition({enableHighAccuracy: true, timeout: 8000}).then(
    location => {
      // Open the Realm database
      Realm.open({schema: [RecordSchema]})
        .then(realm => {
          // Add the data to the database
          realm.write(() => {
            const timeDifference = Date.now() - timestamp;

            realm.create('Record', {
              time: new Date(timestamp + timeDifference),
              latitude: location.latitude,
              longitude: location.longitude,
              lux: lux,
            });
          });
          realm.close();
        })
        .catch(error => {
          console.log('Error opening realm:', error);
        });
    },
  ); */
};
