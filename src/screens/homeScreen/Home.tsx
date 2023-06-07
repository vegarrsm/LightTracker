import React from 'react';
import {Text, View} from 'react-native';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import Dial from '../../components/Dial/Dial';
import {useTheme} from '../../contexts/ThemeContext';
import {IconButton} from '../../components/buttons/IconButton';
import {StackNavigationProp} from '@react-navigation/stack';
import {useLux} from '../../contexts/LuxContext';

export const Home = () => {
  const {currentTheme} = useTheme();
  const {navigate} = useNavigation<StackNavigationProp<ParamListBase>>();
  const {lux} = useLux();

  return (
    <View
      style={{
        ...currentTheme,
        flex: 1,
        paddingTop: 30,
        overflow: 'scroll',
      }}>
      <View
        style={{
          flexDirection: 'row',
          //alignItems: 'stretch',
          justifyContent: 'space-between',
          ...currentTheme,
        }}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 10,
            width: '15%',
          }}
        />
        <Text style={{...currentTheme.h1, alignSelf: 'center'}}>
          Home screen
        </Text>
        <View
          style={{
            flex: 1,
            alignItems: 'flex-end',
            paddingHorizontal: 10,
            width: '15%',
          }}>
          <IconButton
            onPress={() => {
              navigate('Settings');
            }}
            color={currentTheme.primary}
            name="cog"
          />
        </View>
      </View>
      <View
        style={{
          alignItems: 'center',
          width: '100%',
          paddingTop: 30,
        }}>
        <Dial value={lux} />
      </View>
    </View>
  );
};

export default Home;
