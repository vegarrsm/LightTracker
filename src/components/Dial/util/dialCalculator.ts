export const calculateMarkerPosition = (
  angle: number,
  factor: number,
  gaugeRadius: number,
) => {
  const length = gaugeRadius * factor;
  const radians = (angle * Math.PI) / 180;
  return {
    x: gaugeRadius + Math.sin(radians) * length,
    y: gaugeRadius - Math.cos(radians) * length,
  };
};

export function getIndicatorPositionAndAngle(
  value: number,
  minValue: number,
  maxValue: number,
  gaugeRadius: number,
  power: number,
) {
  const startAngle = 202.5;
  const angleStep = 315 / 10;
  const valueAngle =
    startAngle +
    ((value - minValue) / (maxValue - minValue)) ** (1 / power) *
      (angleStep * 10);

  const valuePosition = calculateMarkerPosition(valueAngle, 0.65, gaugeRadius);

  return {valuePosition, valueAngle};
}
