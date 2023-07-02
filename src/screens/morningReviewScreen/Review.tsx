import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import Chart from '../../components/charts/Chart';
import {useTheme} from '../../contexts/ThemeContext';
import TextButton from '../../components/buttons/TextButton';
import {
  TimeOfDay,
  TimeSections,
} from '../../components/charts/util/gradientCalculator';
import recommender, {computeHourlyAverage} from '../../util/recommender';
import {Record, useScheduleStorage} from '../../util/storage';
import {useFirebase} from '../../contexts/FirebaseContext';
import {readFromFirestore} from '../../util/readFromFirestore';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

const times: TimeSections = [
  {name: TimeOfDay.Night, startTime: 23, formatted: '23:00', goal: 1},
  {name: TimeOfDay.Morning, startTime: 7, formatted: '07:00', goal: 500},
  {name: TimeOfDay.Day, startTime: 10, formatted: '10:00', goal: 150},
  {name: TimeOfDay.Evening, startTime: 20, formatted: '20:00', goal: 10},
];
/* const lineData = [
  1, 10, 1, 0, 5, 1, 1, 10, 500, 400, 450, 500, 400, 250, 250, 250, 400, 250,
  340, 20, 200, 340, 100, 10,
]; */

const Review: React.FC = () => {
  const {currentTheme} = useTheme();
  const {firestoreDb} = useFirebase();
  const {reset} = useNavigation<StackNavigationProp<ParamListBase>>();
  const {storeReviewTime} = useScheduleStorage();

  const [realData, setRealData] = useState<Record[]>([]);

  const testData: Record[] = [];

  for (let i = 0; i < 36000; i++) {
    let obj = {
      time: 1684706400000 + i * 2400,
      latitude: 0,
      longitude: 0,
      lux: Math.random() * 2000,
    };
    testData.push(obj);
  }
  useEffect(() => {
    console.log('firestoredb: ', firestoreDb?.app.name);
    firestoreDb &&
      readFromFirestore('test', firestoreDb)
        .then((data: Record[]) => {
          setRealData(data);
        })
        .catch((error: any) => {
          console.log(error);
        });
  }, [firestoreDb]);
  useEffect(() => {
    console.log('FETCH WORKED!!!', realData[100]);
  }, [realData]);
  const lineData = computeHourlyAverage(realData);
  const feedback = recommender(realData, times);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: currentTheme.backgroundColor,
        minHeight: '100%',
        paddingHorizontal: '5%',
        justifyContent: 'space-between', // this will push content apart
      }}>
      <View>
        <Text
          style={{
            marginTop: currentTheme.standardTopMargin,
            ...currentTheme.h1,
          }}>
          Morning Review
        </Text>
        <Chart barData={times} lineData={lineData.map(d => d.lux)} />
        <Text style={{...currentTheme.bodyText, marginVertical: 20}}>
          {feedback}
        </Text>
      </View>
      <View
        style={{
          marginBottom: currentTheme.bottomButtonMargin,
          width: '100%',
          alignItems: 'center',
        }}>
        <TextButton
          style={{width: '70%'}}
          title="Next"
          onPress={() => {
            reset({index: 0, routes: [{name: 'Home'}]});
            storeReviewTime();
          }}
        />
      </View>
    </View>
  );
};

export default Review;
