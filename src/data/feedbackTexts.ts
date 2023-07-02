import {scalePower} from '../components/charts/Chart';

export const recommendations: string[][] = [
  // Probably move this to a separate file
  [
    'You received very little to no light exposure yesterday morning. This can make it harder for your body to wake up and can throw off your circadian rhythm. Try to get more natural light exposure in the morning.',
    'You had very low light exposure during the day. This can disrupt your circadian rhythm and make you feel sleepy or less alert. Try to get more light exposure during the day by increasing the amount of light inside or spending more time outside.',
    "You had high light exposure in the evening. This can significantly delay your body's production of melatonin, making it harder to fall asleep and reducing the quality of your sleep. Try to greatly reduce your light exposure in the evening.",
    'Your sleeping environment was very strongly lit. This can significantly disrupt your sleep and make you feel less rested in the morning. Try to make your sleeping environment as dark as possible.',
  ],
  [
    "You didn't get much daylight exposure yesterday morning. Try to get outside or open your curtains to let in natural light, which can help boost your mood and alertness.",
    'Your light exposure during the day was lower than ideal. This can lead to feelings of sleepiness or a dip in mood. Try to increase your light exposure during the day.',
    "You had quite a bit of light exposure in the evening. This can delay your body's production of melatonin and make it harder to fall asleep. Try to reduce your light exposure in the evening.",
    'Your sleeping environment was quite strongly lit. This can disrupt your sleep and make you feel less rested in the morning. Try to make your sleeping environment darker.',
  ],
  [
    'You received some daylight exposure yesterday morning. Try to get a bit more to fully benefit from the alerting effects of morning light.',
    'Your light exposure during the day was okay, but could be improved. Try to get more natural light, if possible.',
    'Your light exposure in the evening was a bit higher than ideal. Try to dim the lights and avoid screens to help your body prepare for sleep.',
    'Your sleeping environment was a bit more lit than your goal, but still relatively dark. Try to make it as dark as possible for the best sleep.',
  ],
  [
    'You received a good amount of daylight exposure yesterday morning, which is great for synchronizing your circadian rhythm and boosting your mood and alertness. Keep it up!',
    'You maintained good light exposure throughout the day, which is great for keeping your circadian rhythm on track and maintaining your alertness. Well done!',
    'You did well in limiting your light exposure in the evening. This will help your body produce melatonin and prepare for sleep. Keep it up!',
    'Your sleeping environment was very dark, which is great for promoting deep, restful sleep. Well done!',
  ],
];
export const spikeRecommendations: string[] = [
  // Probably move this to a separate file
  'Although you had low average light exposure last morning, you did have a lot of spikes of higher light. This could indicate that you had more positive effect than the graph indicates!',
  'Although you had low average light exposure during the day, you did have a lot of spikes of higher light. This could indicate that you had more positive effect than the graph indicates!',
  'Although you had low average light exposure in the evening, you did have a lot of spikes of higher light. Even very short exposure to light suppresses melatonin which could affect your sleep.',
  'Although your sleeping environment was not very dark, you did have a lot of spikes of lower light. Even very short exposure to light suppresses melatonin which could affect your sleep.',
];
export const coverageFeedback: string[] = [
  // Probably move this to a separate file
  'It seems like you are lacking coverage in the morning. For feedback during these hours, keep the sensor on',
  'It seems like you are lacking coverage during the day. For feedback during these hours, keep the sensor on',
  'It seems like you are lacking coverage in the evening. For feedback during these hours, keep the sensor on',
  'It seems like you are lacking coverage during the night. For feedback during these hours, keep the sensor on',
];

export const melatoninFeedback = (
  index: number,
  feedbackValue: number,
): string =>
  [
    `This light level would not suppress melatonin by any meaningful amount. This would allow you to fall asleep easily and get good sleep quality. This would also mean your circadian rhythm is not shifted to a later time.`,
    `This light level would suppress melatonin by approximately ${feedbackValue}%. This would allow you to fall asleep easily and get good sleep quality. This would also mean your circadian rhythm is not shifted to a later time.`,
    `This light level would suppress melatonin by approximately ${feedbackValue}%. This would only slightly affect how easily you fall asleep, your sleep quality and your circadian rhythm.`,
    `This light level would suppress melatonin by approximately ${feedbackValue}%. This would make it a bit harder to fall asleep, somewhat reduce your sleep quality and shift your circadian rhythm to a later time.`,
    `This light level would suppress melatonin by approximately ${feedbackValue}%. This would make it harder to fall asleep, reduce your sleep quality and shift your circadian rhythm to a later time.`,
    `This light level would suppress melatonin by approximately ${feedbackValue}%+. This would make it harder to fall asleep, reduce your sleep quality and shift your circadian rhythm to a later time.`,
  ][index];

export const phaseShiftFeedback = (
  // Consider removing the percentages, they seem strange
  index: number,
  feedbackValue: number,
): string =>
  [
    'This light intensity would actively delay your circadian rhythm, making it harder to wake up in the morning and fall asleep at night.',
    `This light intensity would give ${(feedbackValue / -0.03).toFixed(
      0, // Clumsy description below
    )}% of the maximum phase shift possible. This means your circadian rhythm would not be affected much. In other words, it would not be actively detrimental but it would not restore it either if you had too much light at night or not enough another morning.`,
    `This light intensity would give ${(feedbackValue / -0.03).toFixed(
      0,
    )}% of the maximum phase shift possible. This would somewhat restore your circadian rhythm if you had too much light at night or not enough another morning.`,
    `This light intensity would give ${(feedbackValue / -0.03).toFixed(
      0,
    )}% of the maximum phase shift possible. This would have a significant positive effect on your circadian rhythm.`,
    `This light intensity would give ${(feedbackValue / -0.03).toFixed(
      0,
    )}% of the maximum phase shift possible. This means your circadian rhythm would adjust to the wake up time very quickly.`,
    `This light intensity would give ${(feedbackValue / -0.03).toFixed(
      0,
    )}%+ of the maximum phase shift possible. This means your circadian rhythm would adjust to the wake up time very quickly.`,
  ][index];

export const alertnessFeedback = (
  index: number,
  feedbackValue: number,
): string =>
  [
    'This light level would make you feel sleepy, and make you very sensitive to light at night (in terms of melatonin suppression).',
    'This light level would not help your alertness.',
    'This light level would have a somewhat positive effect on your alertness, and somewhat reduce your sensitivity to light at night (in terms of melatonin suppression).',
    'This light level would have a significant positive effect on your alertness, and significantly reduce your sensitivity to light at night (in terms of melatonin suppression).',
  ][index] +
  ` It would give you approximately ${Math.round(
    feedbackValue * 100,
  )}% of the maximum possible effect in terms of alertness.`;

const luxReference = [
  {maxLux: 1, description: 'a night sky.'},
  {
    maxLux: 4,
    description:
      'dark twilight, or a phone screen at lowest brightness a meter away.',
  }, // TODO check this
  {
    // TODO fill in one for 10 lux
    maxLux: 50,
    description: 'public areas with dark surroundings.',
  },
  {maxLux: 80, description: 'an office building hallway/toilet lighting.'},
  {
    maxLux: 250,
    description: 'a dark overcast day or somewhat weak indoor light.',
  },
  {
    maxLux: 500,
    description: 'office lighting or sunrise/sunset on a clear day.',
  },
  {maxLux: 1000, description: 'an overcast day or strong artificial light.'},
  {maxLux: Infinity, description: 'Lightly overcast daylight or brighter'},
];

export const referenceValues = (lux: number): string => {
  for (let i = 0; i < luxReference.length; i++) {
    if (lux < luxReference[i].maxLux) {
      return (
        'this light intensity is roughly equivalent to ' +
        luxReference[i].description
      );
    }
  }
  return 'Invalid lux value';
};
// Adjust this
