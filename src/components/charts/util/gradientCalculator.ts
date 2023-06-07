import chroma from 'chroma-js';
import {scalePower} from '../Chart';

export enum TimeOfDay {
  'Morning' = 0,
  'Day' = 1,
  'Evening' = 2,
  'Night' = 3,
}
export type TimeSections = {
  name: TimeOfDay;
  startTime: number;
  formatted: string;
  goal: number;
}[];

export const isBrightHour = (hour: number, timeSections: TimeSections) => {
  const sortedSections = timeSections.sort((a, b) => a.startTime - b.startTime);
  let section = sortedSections.findLast(sec => hour >= sec.startTime);
  const name = section
    ? section.name
    : sortedSections[sortedSections.length - 1].name;

  return name === TimeOfDay.Morning || name === TimeOfDay.Day;
};

export const gradientCalculator = (
  timeSections: TimeSections,
  actual: number,
  goal: number,
  hour: number,
) => {
  goal === 0 && (goal = 1);
  actual === 0 && (actual = 1);
  const brightHours = isBrightHour(hour, timeSections);
  const color = chroma
    .scale(['red', 'yellow', 'green'])(
      brightHours
        ? actual ** (1 / scalePower) / goal ** (1 / scalePower)
        : goal ** (1 / scalePower) / actual ** (1 / scalePower),
    )
    .hex();
  return color;
};
