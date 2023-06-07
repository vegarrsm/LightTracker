import React from 'react';
import {View, Text} from 'react-native';
import {IconButton} from '../../components/buttons/IconButton';
import {useNavigation, ParamListBase} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTheme} from '../../contexts/ThemeContext';
import {Connect} from './Connect';

export const Settings = () => {
  const {pop} = useNavigation<StackNavigationProp<ParamListBase>>();
  const {currentTheme} = useTheme();

  console.log('Loop is in settings?');

  return (
    <View style={{...currentTheme, minHeight: '100%'}}>
      <View
        style={{
          flexDirection: 'row',
          //alignItems: 'stretch',
          justifyContent: 'space-between',
          ...currentTheme,
        }}>
        <View style={{alignItems: 'flex-start', flex: 1}}>
          <IconButton
            onPress={() => {
              pop();
            }}
            color={currentTheme.primary}
            name="arrow-left"
          />
        </View>
        <Text
          style={{
            ...currentTheme.h1,
            flex: 3,
            paddingHorizontal: 10,
          }}>
          Settings
        </Text>
        <View style={{flex: 1}} />
      </View>
      <View style={{alignItems: 'center'}}>
        <Connect />
      </View>
    </View>
  );
};
