import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

type Record = {
  time: number;
  latitude: number;
  longitude: number;
  lux: number;
};

export const readFromFirestore = async (
  userId: string,
  db: FirebaseFirestoreTypes.Module,
): Promise<Record[]> => {
  try {
    // get the reference to the user's collection
    const collectionRef = db?.collection(userId);

    // get all documents from the collection
    const snapshot = await collectionRef.get();

    // create an array to hold the data
    console.log('got here 1');
    // loop through the documents and push the data to the array
    console.log('snapshot', snapshot.size);
    const data = snapshot.docs[0]
      .data()
      .values /* .filter(
        (
          value: any, // Probably add some types here
        ) => value.time.seconds * 1000 > new Date().setHours(0, 0, 0, 0),
      ) */
      .map((value: any) => {
        return {
          time: value.time.seconds * 1000,
          lux: value.lux,
          latitude: value.location.latitude,
          longitude: value.location.longitude,
        };
      }) as Record[];
    console.log('docData', data.length, snapshot.docs[0].data().values.length);
    /*     const docData = snapshot.docs[0].data().forEach(doc => {
      console.log('doc', doc.id);
      console.log('docData', docData.values[0]);
      if (docData.values && Array.isArray(docData.values)) {
        //const records: Record[] = docData.values;
        data = [...data, ...records];
      }
    });
 */ console.log('got here 2');

    // return the data
    return data;
  } catch (e) {
    console.error('Error reading documents: ', e);
    return [];
  }
};
