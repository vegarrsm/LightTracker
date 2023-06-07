import React from 'react';
import {View, useWindowDimensions} from 'react-native';
import {Svg, G, Line, Text} from 'react-native-svg';
import {formatLabelText} from '../../util/formatting';
import Indicator from './Indicator';
import {
  getIndicatorPositionAndAngle,
  calculateMarkerPosition,
} from './util/dialCalculator';
import {useTheme} from '../../contexts/ThemeContext';

interface ExponentialGaugeProps {
  value: number;
}

const ExponentialGauge: React.FC<ExponentialGaugeProps> = ({
  value,
}: ExponentialGaugeProps) => {
  const {currentTheme} = useTheme();
  const {width} = useWindowDimensions();
  const size = width * 0.8;
  const gaugeRadius = size / 2;
  const minValue = 0;
  const maxValue = 100000;

  const angleStep = 315 / 10;
  const markerLines = [];
  const markerLabels = [];
  const startAngle = 202.5;

  for (let i = 0; i < 11; i++) {
    const angle = startAngle + angleStep * i;
    const outerPoint = calculateMarkerPosition(angle, 0.75, gaugeRadius);
    const innerPoint = calculateMarkerPosition(angle, 0.85, gaugeRadius);
    markerLines.push(
      <Line
        key={`marker-line-${i}`}
        x1={innerPoint.x}
        y1={innerPoint.y}
        x2={outerPoint.x}
        y2={outerPoint.y}
        strokeWidth={2}
        stroke={currentTheme.primary}
      />,
    );

    const labelText = formatLabelText(
      minValue + (maxValue - minValue) * (i / 10) ** 4,
    );

    const labelPosition = calculateMarkerPosition(angle, 0.95, gaugeRadius);
    markerLabels.push(
      <Text
        key={`marker-label-${i}`}
        x={labelPosition.x}
        y={labelPosition.y}
        fontSize={12}
        textAnchor="middle"
        alignmentBaseline="central"
        fill={currentTheme.primary}>
        {labelText}
      </Text>,
    );
  }

  const {valuePosition, valueAngle} = getIndicatorPositionAndAngle(
    value,
    minValue,
    maxValue,
    gaugeRadius,
  );

  return (
    <View style={{margin: 'auto', ...currentTheme}}>
      <Svg height={size} width={size}>
        <G>
          {markerLines}
          {markerLabels}
        </G>
        <G x={valuePosition.x} y={valuePosition.y}>
          <Indicator dialColor={currentTheme.secondary} angle={valueAngle} />
        </G>
        <Text
          x={gaugeRadius}
          y={gaugeRadius}
          fontSize={48}
          textAnchor="middle"
          alignmentBaseline="central"
          fill={currentTheme.primary}>
          {value}
        </Text>
      </Svg>
    </View>
  );
};

export default ExponentialGauge;
