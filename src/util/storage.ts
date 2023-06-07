import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Record = {
  time: number;
  latitude: number;
  longitude: number;
  lux: number;
};

const useRecordStorage = () => {
  const [data, setData] = useState<Record[]>([]);

  const loadData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('records');
      if (storedData) {
        setData(JSON.parse(storedData));
      }
      return storedData;
    } catch (error) {
      // Error retrieving data
      console.log(error);
    }
    return null;
  };
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const storeData = async () => {
      try {
        await AsyncStorage.setItem('records', JSON.stringify(data));
      } catch (error) {
        // Error saving data
        console.log(error);
      }
    };

    storeData();
  }, [data]);

  const storeData = async (record: Record) => {
    setData(prevData => [...prevData, record]);
  };

  const clearData = async () => {
    try {
      await AsyncStorage.removeItem('records');
      setData([]);
    } catch (error) {
      // Error clearing data
      console.log(error);
    }
  };

  return {data, storeData, loadData, clearData};
};

export default useRecordStorage;

/* import Realm from 'realm';

export type Schema = [
  {
    name: string;
    properties: {
      time: number;
      latitude: number;
      longitude: number;
      lux: number;
    };
  },
];

export const RecordSchema = {
  name: 'Record',
  properties: {
    time: 'number', // will be converted to Timestamp when sending to Firestore
    latitude: 'number', // for GeoPoint
    longitude: 'number', // for GeoPoint
    lux: 'number',
  },
};

export const clearRealmStorage = async () => {
  try {
    const realm = await Realm.open({schema: [RecordSchema]});

    realm.write(() => {
      const allRecords = realm.objects('Record');
      realm.delete(allRecords);
    });

    realm.close();
    console.log('Realm storage cleared successfully');
  } catch (error) {
    console.error('Error clearing Realm storage:', error);
  }
};

export const getRealmStorage = async () => {
  try {
    const realm = await Realm.open({schema: [RecordSchema]});
    const allRecords = realm.objects('Record');
    realm.close();
    return allRecords;
  } catch (error) {
    console.error('Error getting Realm storage:', error);
  }
};

export const saveRealmStorage = async (record: Schema) => {
  try {
    const realm = await Realm.open({schema: [RecordSchema]});
    realm.write(() => {
      realm.create('Record', record);
    });
    realm.close();
    console.log('Record saved successfully');
  } catch (error) {
    console.error('Error saving record:', error);
  }
};
 */

export const useScheduleStorage = () => {
  const [reviewTime, setReviewTime] = useState<Date>(new Date(0));
  const [firstOpen, setFirstOpen] = useState<boolean>(false);

  const getOpenedTime = async () => {
    try {
      const storedData = await AsyncStorage.getItem('lastReview');
      if (storedData) {
        setReviewTime(new Date(JSON.parse(storedData)));
      }
      return storedData;
    } catch (error) {
      // Error retrieving data
      console.log(error);
    }
    return null;
  };

  const getFirstOpen = async () => {
    await AsyncStorage.getItem('firstOpen').then(value => {
      console.log('FIRSTOPEN?????', value);
      value ? setFirstOpen(false) : setFirstOpen(true);
    });
  };
  const storeFirstOpen = async (clear?: boolean) => {
    try {
      clear
        ? await AsyncStorage.setItem('firstOpen', JSON.stringify(true))
        : AsyncStorage.removeItem('firstOpen');
    } catch (error) {
      // Error saving data
      console.log(error);
    }
  };
  const storeReviewTime = async () => {
    try {
      await AsyncStorage.setItem('lastReview', JSON.stringify(new Date()));
    } catch (error) {
      // Error saving data
      console.log(error);
    }
  };
  const clearReviewTime = async () => {
    try {
      await AsyncStorage.removeItem('lastReview');
    } catch (error) {
      // Error saving data
      console.log(error);
    }
  };

  useEffect(() => {
    getOpenedTime();
    getFirstOpen();
  }, []);

  return {
    firstOpen,
    reviewTime,
    storeFirstOpen,
    storeReviewTime,
    clearReviewTime,
  };
};
