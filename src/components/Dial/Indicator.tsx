import React from 'react';
import {Path} from 'react-native-svg';

interface IndicatorProps {
  angle: number;
  dialColor: string;
}

const Indicator: React.FC<IndicatorProps> = ({
  angle,
  dialColor,
}: IndicatorProps) => {
  const width = 15; // Customize the width of the indicator triangle
  const height = 20; // Customize the height of the indicator triangle

  const path = `M${-width / 2},0 L${width / 2},0 L0,${height} z`;

  return (
    <Path
      d={path}
      stroke="none"
      fill={dialColor}
      transform={`rotate(${angle + 180})`}
    />
  );
};

export default Indicator;
