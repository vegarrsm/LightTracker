import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

interface LoadingProps {
  size: number | 'small' | 'large';
  color?: string;
}

const Loading: React.FC<LoadingProps> = ({size, color = '#FFFFFF'}) => {
  return (
    <View style={styles.centered}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loading;
