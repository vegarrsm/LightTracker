import React from 'react';
import {LinearGradient, Path, Stop} from 'react-native-svg';

type LineSegmentProps = {
  d: string;
  gradientUrl: string;
};

export const LineSegment: React.FC<LineSegmentProps> = ({d, gradientUrl}) => {
  return <Path d={d} stroke={gradientUrl} strokeWidth={2} />;
};

type GradientProps = {
  id: string;
  isGreen: boolean;
};

export const Gradient: React.FC<GradientProps> = ({id, isGreen}) => {
  return (
    <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <Stop offset="0%" stopColor={isGreen ? 'green' : 'red'} />
      <Stop offset="100%" stopColor={isGreen ? 'lightgreen' : 'orange'} />
    </LinearGradient>
  );
};
