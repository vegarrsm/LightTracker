// src/screens/Second.tsx
import React, {useEffect, useState} from 'react';
import {Text, ScrollView, View} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import LuxSlider from '../../components/pickers/LuxSlider';
import {TimeOfDay} from '../../components/charts/util/gradientCalculator';
import {ParamListBase, RouteProp} from '@react-navigation/native';
import {
  calculateAlertness,
  calculateMelatonin,
  calculateShift,
} from '../../util/luxImpactCalculators';
import {
  alertnessFeedback,
  melatoninFeedback,
  phaseShiftFeedback,
  referenceValues,
} from '../../data/feedbackTexts';
import {StackNavigationProp} from '@react-navigation/stack';
import TextButton from '../../components/buttons/TextButton';
import TimePicker from '../../components/pickers/TimePicker';
import {useScheduleStorage} from '../../util/storage';
import {useLux} from '../../contexts/LuxContext';

type SetGoalRouteParamList = {
  SetGoal: {timeOfDay: TimeOfDay[]};
};

type SetGoalScreenRouteProp = RouteProp<SetGoalRouteParamList>;
type SetGoalScreenNavigationProp = StackNavigationProp<
  SetGoalRouteParamList & ParamListBase
>;
type Props = {
  route: SetGoalScreenRouteProp;
  navigation: SetGoalScreenNavigationProp;
};
const scalingPower = 0.3;
const maxValue = 4096;

export const SetGoal = ({route, navigation}: Props) => {
  const timeOfDay = route.params.timeOfDay[0];
  const {storeFirstOpen} = useScheduleStorage();

  const [lux, setLux] = useState(0);
  const {currentTheme} = useTheme();
  const [feedback, setFeedback] = useState('');
  const [time, setTime] = useState(
    timeOfDay === TimeOfDay.Evening ? 23 * 60 : 7 * 60,
  );
  const {schedule, setSchedule} = useLux();

  const correctedLux = lux ** (1 / scalingPower);
  console.log(schedule);

  useEffect(() => {
    setSchedule(prev => {
      let inferredChange = timeOfDay === TimeOfDay.Morning && {
        ...prev,
        [TimeOfDay.Day]: {...prev[TimeOfDay.Day], time: time + 3 * 60}, // Might have to rechange this
      };
      if (timeOfDay === TimeOfDay.Night) {
        inferredChange = {
          ...prev,
          [TimeOfDay.Night]: {...prev[TimeOfDay.Evening], time: time - 3 * 60}, // Might have to rechange this
        };
      }
      return {
        ...prev,
        ...inferredChange,
        [timeOfDay]: {time: time, lux: correctedLux},
      };
    });
  }, [setSchedule, time, timeOfDay, correctedLux]);

  useEffect(() => {
    console.log('params: ', timeOfDay, route);

    // Calculates index for melatonin and alertness (which is roughly between 0-1)
    const calculateIndex = (calculationFunction: Function): number => {
      const result = calculationFunction(correctedLux);
      console.log(
        'RESULT',
        result,
        correctedLux,
        result < 1 ? Math.floor(result * 4) : 0,
      );
      return correctedLux === maxValue
        ? 5
        : result < 1
        ? Math.floor(result * 4)
        : 3;
    };

    const selectFeedback = (
      feedbackFunction: Function,
      calculationFunction: (lux: number) => number,
      index: number,
    ): void => {
      setFeedback(
        feedbackFunction(index, calculationFunction(correctedLux).toFixed(2)),
      ); // This should not be correctedLux, but the result of the calculation
    };

    switch (timeOfDay) {
      case TimeOfDay.Morning:
        const shift = calculateShift(correctedLux);
        console.log('SHIFT', shift);
        const i =
          shift > 0 // if 1
            ? 0
            : Math.round(correctedLux) !== maxValue // if 2
            ? Math.floor(Math.abs(shift / -3) * 4) + 1
            : 5;
        console.log(
          'CALCULATESHIFT',
          correctedLux,
          shift,
          Math.floor(Math.abs(shift / -3) * 4),
        );
        selectFeedback(
          phaseShiftFeedback,
          calculateShift,
          i, // Values indicate 0.2 positive - 3 negative hours shift (sort of)
        );
        break;
      case TimeOfDay.Day:
        selectFeedback(
          alertnessFeedback,
          calculateAlertness,
          calculateIndex(calculateAlertness), // Values indicate KSS score 1-9 (1=very alert, 9=very sleepy)
        );
        break;
      case TimeOfDay.Evening:
      case TimeOfDay.Night:
        selectFeedback(
          melatoninFeedback,
          calculateMelatonin,
          calculateIndex(calculateMelatonin), // Values indicate 0-100% suppression
        );
        break;
    }
  }, [correctedLux, route, timeOfDay]);
  console.log(
    'TIME OF DAY WRITTEN: ',
    TimeOfDay[timeOfDay],
    timeOfDay,
    route.params.timeOfDay,
  );
  console.log(navigation.getState().index);
  return (
    <ScrollView
      contentContainerStyle={{
        backgroundColor: currentTheme.backgroundColor,
        minHeight: '100%',
        justifyContent: 'flex-start',
        paddingHorizontal: currentTheme.standardIndent,
      }}>
      <Text
        style={{...currentTheme.h1, marginTop: currentTheme.standardTopMargin}}>
        Set {TimeOfDay[timeOfDay]} Goals
      </Text>
      {(timeOfDay === TimeOfDay.Morning || timeOfDay === TimeOfDay.Evening) && (
        <View>
          <Text
            style={{
              ...currentTheme.h2,
              marginTop: 30,
            }}>
            {timeOfDay === TimeOfDay.Morning
              ? 'When do you want to wake up?'
              : 'When do you want to go to bed?'}
          </Text>
          <TimePicker time={time} setTime={setTime} />
        </View>
      )}
      <Text
        style={{
          ...currentTheme.h2,
          marginTop: 30,
        }}>
        Light intensity {TimeOfDay[timeOfDay].toLowerCase()} hours
        {timeOfDay === TimeOfDay.Morning && '\n(First 3 hours after waking)'}
        {timeOfDay === TimeOfDay.Day &&
          '\n(3 hours after waking until 3 hours before sleeping)'}
        {timeOfDay === TimeOfDay.Evening && '\n(Last 3 hours before sleeping)'}
        {timeOfDay === TimeOfDay.Night && '\n(While sleeping)'}
        {/* '\n(' +
        getFormattedSchedule(schedule)[timeOfDay].startTimeFormatted +
        ' - ' +
        (firstOpen && timeOfDay === TimeOfDay.Day)
          ? '...'
          : getFormattedSchedule(schedule)[timeOfDay].endTimeFormatted + ')' */}
      </Text>
      <LuxSlider
        key={0}
        maxValue={maxValue}
        scalingPower={scalingPower}
        value={lux}
        setValue={setLux}
      />
      <Text
        style={{
          ...currentTheme.bodyText,
          maxHeight: '35%',
          marginBottom: 100,
          position: 'relative',
        }}>
        {'What intensity of light do you want to be exposed to in the ' +
          TimeOfDay[timeOfDay].toLowerCase() +
          '? Drag the slider to see how this affects your ' +
          'circadian rhythm, sleep or alertness, as well as an equivalent light source as reference.' +
          '\n\n' +
          referenceValues(correctedLux) +
          '\n\n' +
          feedback}
      </Text>
      <TextButton
        onPress={() => {
          if (route.params.timeOfDay.length > 1) {
            navigation.push('SetGoals', {
              timeOfDay: route.params.timeOfDay.slice(1),
            });
          } else {
            storeFirstOpen(false);
            navigation.reset({index: 0, routes: [{name: 'Home'}]});
          }
          /* Do some navigation */
        }}
        title={route.params.timeOfDay.length > 1 ? 'Next' : 'Finish'}
        style={{
          width: '90%',
          alignSelf: 'center',
          position: 'absolute',
          bottom: currentTheme.bottomButtonMargin,
          zIndex: 9,
        }}
      />
    </ScrollView>
  );
};
