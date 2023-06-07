import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Slider} from '@rneui/themed';
import Fawesome from 'react-native-vector-icons/FontAwesome5';
import {useTheme} from '../../contexts/ThemeContext';

type SliderProps = {
  value: number;
  maxValue: number;
  scalingPower: number;
  setValue: (value: number) => void;
};

const LuxSlider: React.FC<SliderProps> = ({
  maxValue,
  scalingPower,
  setValue,
  value,
}) => {
  const {currentTheme} = useTheme();
  // Transform the linear value of the slider to an exponential one
  const exponentialValue =
    value ** (1 / scalingPower) > 10
      ? (value ** (1 / scalingPower)).toFixed(0)
      : (value ** (1 / scalingPower)).toFixed(1);

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 20,
      }}>
      <Slider
        style={{
          width: '90%',
          height: 100,
        }}
        minimumValue={0}
        maximumValue={maxValue ** scalingPower} // The maximum value has to be the square root of your desired max
        value={value}
        onValueChange={setValue}
        thumbTouchSize={{width: 160, height: 150}}
        thumbStyle={{
          backgroundColor: 'transparent',
          alignItems: 'center',
          justifyContent: 'flex-start',
          height: 100, // TEST THIS STUFF ON OTHER PHONES, this is not quite right here either
          width: 1,
        }}
        trackStyle={{width: '100%', height: 5}}
        minimumTrackTintColor={currentTheme.accent}
        maximumTrackTintColor="grey"
        thumbProps={{
          children: (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 100,
              }}>
              <Text style={{height: 20}}>
                {exponentialValue +
                  (exponentialValue === maxValue.toFixed(0) ? '+' : '')}
              </Text>
              <Fawesome
                name="map-marker"
                solid={true}
                size={30}
                color={currentTheme.secondary}
              />
            </View>
          ),
        }}
      />
    </View>
  );
};

export default LuxSlider;
