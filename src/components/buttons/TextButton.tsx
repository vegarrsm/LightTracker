// CustomButton.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';

interface TextButtonProps {
  title: string;
  onPress: () => void;
  color?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const TextButton: React.FC<TextButtonProps> = ({
  title,
  onPress,
  style,
  color,
  textStyle,
}) => {
  const {currentTheme} = useTheme();

  return (
    <TouchableOpacity
      style={{
        alignItems: 'center',
        ...buttonStyles.button,
        ...style,
        backgroundColor: color || currentTheme.primary,
      }}
      onPress={onPress}>
      <Text
        style={{
          ...(textStyle || currentTheme.h3),
          color: textStyle?.color || currentTheme.textSecondary,
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export const buttonStyles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
});

export default TextButton;
