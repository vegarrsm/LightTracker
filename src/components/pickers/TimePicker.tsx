import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import DatePicker from 'react-native-date-picker';
import TextButton from '../buttons/TextButton';
import Overlay from '../overlays/Overlay';

type TimeProps = {
  time: number;
  setTime: (value: number) => void;
};

const TimePicker: React.FC<TimeProps> = ({setTime, time}) => {
  const {currentTheme} = useTheme();

  const [tempTime, setTempTime] = useState(new Date(360000 * (23 + time)));
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  // Make a useEffect(() => {}, [datePickerOpen]); to reset tempTime if cancelled by clicking outside of the timepicker

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        marginTop: 25,
      }}>
      <TextButton
        title={new Date(new Date(3600000 * (23 + time)))
          .toTimeString()
          .slice(0, 5)}
        onPress={() => setDatePickerOpen(true)}
        style={{
          paddingHorizontal: 50,
          width: '100%',
          alignItems: 'center',
          borderColor: currentTheme.primary,
          borderWidth: 2,
          borderRadius: 0,
        }}
        textStyle={{...currentTheme.h2, color: currentTheme.textPrimary}}
        color={currentTheme.backgroundColor}
      />
      <Overlay visible={datePickerOpen} setVisible={setDatePickerOpen}>
        <Text style={{...currentTheme.h1, marginTop: -70, height: 70}}>
          Choose a time
        </Text>
        <DatePicker
          mode="time"
          fadeToColor={'none'}
          date={tempTime} // Sets the time to 00:00 by going 23 hours past 1970 01:00 (UNIX Start point)
          onDateChange={v => {
            setTempTime(v);
          }}
          style={{
            rowGap: 2000,
            transform: [{scale: 1.4}],
            margin: 100,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            width: '70%',
            justifyContent: 'space-between',
          }}>
          <TextButton
            style={{width: '45%'}}
            title="Cancel"
            onPress={() => {
              setDatePickerOpen(false);
            }}
            textStyle={{...currentTheme.h2, color: currentTheme.textSecondary}} // maybe this shouldn't be bigger
          />
          <TextButton
            style={{width: '45%'}}
            textStyle={{...currentTheme.h2, color: currentTheme.textSecondary}}
            title="Confirm"
            onPress={() => {
              console.log(tempTime);
              setTime(tempTime.getHours() + tempTime.getMinutes() / 60);
              setDatePickerOpen(false);
            }}
          />
        </View>
      </Overlay>
    </View>
  );
};

export default TimePicker;
