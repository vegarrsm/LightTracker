import React from 'react';
import {useTheme} from '../../contexts/ThemeContext';
import {View, Text} from 'react-native';
import TextButton from '../../components/buttons/TextButton';
import {syncWithFirestore} from '../../util/syncWithFirestore';
import useRecordStorage, {Record} from '../../util/storage';
import {useFirebase} from '../../contexts/FirebaseContext';

const StorageControls: React.FC = () => {
  const {currentTheme} = useTheme();
  const {firestoreDb} = useFirebase();
  const {data, clearData, loadData} = useRecordStorage();

  return (
    <View>
      <Text style={{...currentTheme.h2, marginBottom: 10, marginTop: 30}}>
        Synchronization options
      </Text>
      <TextButton
        title="Sync"
        onPress={() => {
          if (firestoreDb) {
            loadData().then((records: string | null) => {
              syncWithFirestore(
                JSON.parse(records || '{}'),
                clearData,
                firestoreDb,
              );
            });
          }
        }}
      />
      <View />
      <TextButton
        title="Clear Storage"
        onPress={() => {
          clearData();
        }}
      />
      <TextButton
        title="Print data"
        onPress={() => {
          loadData().then(d => {
            console.log(d);
          });
          console.log('\n\n\n\n\nDATA IN STORAGE: ', data);
          /* Realm.open({schema: [RecordSchema]})
            .then((realm: Realm) => {
              const records = realm.objects('Record');
              console.log('Print data:', records);
              realm.close();
            })
            .catch((error: any) => {
              console.log('Error opening realm:', error);
            }); */
        }}
      />
    </View>
  );
};

export default StorageControls;
