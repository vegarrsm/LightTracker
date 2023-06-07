// syncWithFirestore.ts

import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {} from './storage';

type Record = {
  time: number;
  latitude: number;
  longitude: number;
  lux: number;
};

export const syncWithFirestore = async (
  data: Record[],
  clearData: () => Promise<void>,
  db: FirebaseFirestoreTypes.Module,
) => {
  try {
    console.log('Add doc');
    const docRef = db?.collection('testuserid').doc('newDoc');
    //const storedData = realm.objects<Record>('Record');
    const formatted = data.map(record => {
      return {
        time: firestore.Timestamp.fromDate(new Date(record.time)),
        location: new firestore.GeoPoint(record.latitude, record.longitude),
        lux: record.lux,
      };
    });
    console.log('FORMATTED');

    const docSnapshot = await docRef.get();
    if (docSnapshot.exists) {
      console.log('exists');
      await docRef
        .update({
          values: firestore.FieldValue.arrayUnion(...formatted),
        })
        .then(() => {
          console.log('CLEAR!');

          clearData();
        });
    } else {
      console.log('no exists');
      await docRef
        .set({
          values: firestore.FieldValue.arrayUnion(...formatted),
        })
        .then(() => {
          console.log('CLEAR!');

          clearData();
        });
    }
    console.log('Document written with ID: ', docRef.id);

    /* realm.write(() => {
      realm.deleteAll();
    }); */
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};
