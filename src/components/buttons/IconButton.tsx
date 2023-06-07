import React from 'react';
import {TouchableOpacity} from 'react-native';
import Fawesome from 'react-native-vector-icons/FontAwesome5';

export type TouchIconProps = {
  onPress: () => void;
  color: string;
  name: string;
};

export const IconButton: React.FC<TouchIconProps> = ({
  onPress,
  color,
  name,
}) => {
  return (
    <TouchableOpacity style={{margin: 20}} onPress={onPress}>
      <Fawesome name={name} size={42} color={color} />
    </TouchableOpacity>
  );
};
