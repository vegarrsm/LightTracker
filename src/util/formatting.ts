export const formatLabelText = (value: number) => {
  console.log('value', value);
  if (value === 0) {
    return '0';
  } else if (value >= 1000) {
    return `${Math.round(value / 1000)}k`;
  } else {
    const roundedValue = Math.round(value / 10) * 10;
    const magnitude = value === 0 ? 1 : Math.floor(Math.log10(value)) + 1;
    const precision = Math.max(0, 3 - magnitude);
    const formattedValue =
      precision === 0
        ? roundedValue.toLocaleString()
        : roundedValue.toFixed(precision);
    return formattedValue.replace(/\.0+$/, '');
  }
};

export const toHourMinute = (num: number): string => {
  let date = new Date(0);
  date.setMinutes(num * 60); // convert hours to minutes
  let hh = date.getUTCHours();
  let mm = date.getUTCMinutes();

  // Zero padding
  let hhStr = hh < 10 ? '0' + hh.toString() : hh.toString();
  let mmStr = mm < 10 ? '0' + mm.toString() : mm.toString();

  return `${hhStr}:${mmStr}`;
};

type timeLux = {
  time: number;
  lux: number;
};

export type Schedule = {
  0: timeLux;
  1: timeLux;
  2: timeLux;
  3: timeLux;
};

type TimeLuxFormatted = {
  startTimeFormatted: string;
  endTimeFormatted: string;
  luxFormatted: number;
};

type FormattedSchedule = {
  0: TimeLuxFormatted;
  1: TimeLuxFormatted;
  2: TimeLuxFormatted;
  3: TimeLuxFormatted;
};
type ScheduleKey = 0 | 1 | 2 | 3;

export const getFormattedSchedule = (schedule: Schedule): FormattedSchedule => {
  const formattedSchedule: FormattedSchedule = {
    0: {startTimeFormatted: '', endTimeFormatted: '', luxFormatted: 0},
    1: {startTimeFormatted: '', endTimeFormatted: '', luxFormatted: 0},
    2: {startTimeFormatted: '', endTimeFormatted: '', luxFormatted: 0},
    3: {startTimeFormatted: '', endTimeFormatted: '', luxFormatted: 0},
  };

  const keys: ScheduleKey[] = [0, 1, 2, 3];

  keys.forEach((key, i) => {
    const nextKey = i === keys.length - 1 ? keys[0] : keys[i + 1];
    const lux = schedule[key].lux;

    const startTime = schedule[key].time % 24;
    const endTime = schedule[nextKey].time % 24;

    const startTimeFormatted = formatTime(startTime);
    const endTimeFormatted = formatTime(endTime);
    const luxFormatted = Math.round(lux);

    formattedSchedule[key] = {
      startTimeFormatted,
      endTimeFormatted,
      luxFormatted,
    };
  });

  return formattedSchedule;
};

const formatTime = (time: number): string => {
  const hours = Math.floor(time);
  const minutes = Math.floor((time - hours) * 60);
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  return `${formattedHours}:${formattedMinutes}`;
};
