import {average} from 'chroma-js';
import {
  TimeOfDay,
  TimeSections,
  isBrightHour,
} from '../components/charts/util/gradientCalculator';
import {Record} from './storage';

type adherenceValue = {
  hour: number;
  average: number;
  spiking: number;
};

const countSpikes = (
  measurements: Record[],
  sections: TimeSections,
): number[][] => {
  let spikeCount = Array.from({length: 24}, (_, i) => [i, 0]);
  let lastSpikeTime = 0;

  measurements.forEach(measurement => {
    const hour = new Date(measurement.time).getHours();
    const isBright = isBrightHour(hour, sections);
    const threshold = isBright ? 1000 : 100;

    if (
      measurement.lux > threshold &&
      measurement.time - lastSpikeTime > 60000
    ) {
      spikeCount[hour][1] += 1;
      lastSpikeTime = measurement.time;
    }
  });

  return spikeCount;
};

const calculateMorningEvening = (
  adherenceValues: adherenceValue[],
  spikeCounts: number[][],
  startTime: number,
  morning: boolean,
): [number, number] => {
  let total = 0;
  let weightedAvSpikes = 0;
  for (let i = 1; i <= 3; i++) {
    total += morning
      ? adherenceValues[startTime].average * (4 - i)
      : adherenceValues[startTime].average * i;
    weightedAvSpikes += morning
      ? spikeCounts[startTime][1] * (4 - i)
      : spikeCounts[startTime][1] * i;
    startTime < 23 ? startTime + 1 : (startTime -= 23);
  }
  return [total / 6, weightedAvSpikes / 6];
};

const calculateDayNight = (
  adherenceValues: adherenceValue[],
  startTime: number,
  sections: TimeSections,
): [number, number] => {
  const sortedSections = sections.sort((a, b) => a.startTime - b.startTime);
  const endTime =
    sortedSections.find(sec => sec.startTime > startTime)?.startTime ||
    sortedSections[0].startTime;
  const totals = (
    startTime < endTime // Checks if the section is split over midnight
      ? adherenceValues.slice(startTime, endTime)
      : adherenceValues
          .slice(0, endTime)
          .concat(adherenceValues.slice(startTime, adherenceValues.length))
  ).reduce((v, v2) => {
    return {
      hour: 0,
      average: v.average + v2.average,
      spiking: v.spiking + v2.spiking,
    };
  });
  const span = Math.abs(
    endTime > startTime ? endTime - startTime : 24 - startTime + endTime,
  );
  console.log(
    'startTime, endTime, span, totals.average',
    startTime,
    endTime,
    span,
    totals.average,
  );
  return [totals.average / span, totals.spiking / span];
};

export const adherenceCalculator = (
  sections: TimeSections,
  lightMeasurements: Record[],
): Array<[TimeOfDay, number[]]> => {
  const adherenceValues: adherenceValue[] = [];
  const spikeCounts = countSpikes(lightMeasurements, sections);
  const totalLux: number[][] = Array.from({length: 24}, (_, i) => [i, 1]);
  const countPerHour = Array.from({length: 24}, () => 0);
  lightMeasurements.forEach(measure => {
    const hour = new Date(measure.time).getHours();
    totalLux[hour][1] += measure.lux;
    countPerHour[hour] += 1;
  });
  totalLux.forEach((total, hour) => {
    let goal =
      sections
        .sort((a, b) => a.startTime - b.startTime)
        .reverse()
        .find(sec => hour >= sec.startTime)?.goal ||
      sections.sort((a, b) => b.startTime - a.startTime)[0].goal; // Choose latest goal if no startTime is lower than hour
    const averageLux =
      total[1] / countPerHour[hour] !== 0 ? total[1] / countPerHour[hour] : 1;
    if (goal === 0) {
      goal = 1;
    }
    const luxAdherence = isBrightHour(hour, sections)
      ? averageLux / goal
      : goal / averageLux;
    adherenceValues.push({
      average: luxAdherence,
      hour: hour,
      spiking: spikeCounts[hour][1],
    });
  });
  console.log(adherenceValues);
  //console.log(lightMeasurements.map((l)=>{return {hour:new Date(l.time).getHours(), lux:l.lux}}))
  const sectionAdherence: Array<[TimeOfDay, number[]]> = [];
  sections.forEach(section => {
    switch (Number(section.name)) {
      case TimeOfDay.Morning:
        console.log('MORNING BEFORE ADHERENCE');
        sectionAdherence.push([
          section.name,
          calculateMorningEvening(
            adherenceValues,
            spikeCounts,
            section.startTime,
            true,
          ),
        ]);
        break;
      case TimeOfDay.Evening:
        console.log(
          'EVENING BEFORE ADHERENCE',
          Number(section.name),
          section.name,
        );
        sectionAdherence.push([
          section.name,
          calculateMorningEvening(
            adherenceValues,
            spikeCounts,
            section.startTime,
            false,
          ),
        ]);
        break;
      case TimeOfDay.Day:
      case TimeOfDay.Night:
        console.log('Day or Night', Number(section.name));
        sectionAdherence.push([
          section.name,
          calculateDayNight(adherenceValues, section.startTime, sections),
        ]);
        break;
    }
  });

  return sectionAdherence;
  // Calculate spikes as well?
};
