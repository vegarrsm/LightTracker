import {TimeSections} from '../components/charts/util/gradientCalculator';
import {recommendations, spikeRecommendations} from '../data/feedbackTexts';
import {adherenceCalculator} from './adherenceCalculator';
import {Record} from './storage';

type Average = {
  lux: number;
  coverage: number;
};

export const computeHourlyAverage = (records: Record[]): Average[] => {
  // Group records by hour
  const groupedByHour: {[key: string]: Record[]} = {};
  records.forEach(record => {
    const date = new Date(record.time);
    if (groupedByHour[date.getHours()]) {
      groupedByHour[date.getHours()].push(record);
    } else {
      groupedByHour[date.getHours()] = [record];
    }
  });

  const averages: Average[] = [];
  for (const hour in groupedByHour) {
    const group = groupedByHour[hour];
    const sum = group.reduce((accum, record) => accum + record.lux, 0);
    const avg = sum / group.length;
    const coverage = (group.length / 360) * 100;
    averages.push({
      lux: avg,
      coverage: coverage > 100 ? 100 : coverage, // cap at 100%
    });
  }

  return averages;
};

const recommender = (records: Record[], sections: TimeSections): string => {
  const adherence = adherenceCalculator(sections, records);
  const adherenceForFeedback =
    adherence
      .map(numbers => numbers[1])
      .filter(v => {
        v[0] < 0.8;
      }).length === 0
      ? adherence.sort((a, b) => b[1][0] - a[1][0])[3]
      : adherence.sort((a, b) => b[1][0] - a[1][0])[0];

  const significantSpike = adherence
    .sort((a, b) => b[1][1] - a[1][1])
    .filter(
      ad =>
        ((Number(ad[0]) >= 2 && ad[1][0] > 0.9) ||
          (Number(ad[0]) < 2 && ad[1][0] < 0.5)) &&
        ad[1][1] > 30,
    )[0];

  const averages = computeHourlyAverage(records);
  //const adherences = adherenceCalculator(averages);
  // const time points
  const severity = Math.round(adherenceForFeedback[1][0] * 4);
  console.log('SEVERITY: ' + severity);
  let feedback =
    recommendations[severity > 4 ? 4 : severity][adherenceForFeedback[0]];
  //feedback += recommendations[adherenceForFeedback[]][0];
  feedback += significantSpike
    ? '\n\n' + spikeRecommendations[Number(significantSpike[0])]
    : '';
  return feedback;
};

export default recommender;
