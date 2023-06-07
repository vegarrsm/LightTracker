import React from 'react';
import {View} from 'react-native';
import {BarChart, LineChart, XAxis, YAxis} from 'react-native-svg-charts';
import {useTheme} from '../../contexts/ThemeContext';
import {toHourMinute} from '../../util/formatting';
import {Defs, LinearGradient, Stop} from 'react-native-svg';
import {TimeSections, gradientCalculator} from './util/gradientCalculator';

type Props = {
  barData: TimeSections;
  lineData: number[];
};

export const scalePower = 0.2;

const Chart: React.FC<Props> = ({barData, lineData}) => {
  const sortedBarData = barData.sort((a, b) => a.startTime - b.startTime);
  const transformedBarData = Array.from({length: 24}, (_, i) => {
    const dat =
      sortedBarData.findLast(value => value.startTime <= i)?.goal ||
      sortedBarData[sortedBarData.length - 1].goal;
    return dat ** scalePower;
  });
  const transformedLineData = lineData.map(value =>
    value > 0 ? value ** scalePower : value,
  );

  const {currentTheme} = useTheme();

  // [23, 7, 10, 21, 23];
  const ranges = barData.map(({startTime}) => startTime); // [23, 7, 10, 21, 23];

  const labels: string[] = [];
  for (let i = 0; i <= 24; i++) {
    const labelIndex = ranges.findIndex(value => Math.floor(value) === i);
    labels.push(labelIndex !== -1 ? toHourMinute(ranges[labelIndex]) : '');
  }
  /*   transformedLineData[3] = 0;
   */ return (
    <View style={{flexDirection: 'row', height: 350}}>
      <YAxis
        data={transformedLineData}
        contentInset={{top: 30, bottom: 30}}
        svg={{
          fill: currentTheme.textPrimary,
          fontSize: 10,
        }}
        numberOfTicks={10}
        max={Math.max(...transformedBarData.concat(transformedLineData)) * 1.1} // Use the logarithmic scale here
        min={0}
        //scale={() => scale.scalePow().exponent(0.5)}
        formatLabel={value =>
          `${value >= 1 ? Math.round(value ** (1 / scalePower)) : value}`
        } // You might want to adjust the label accordingly
      />
      <View style={{flex: 1}}>
        <BarChart
          style={{
            position: 'absolute',
            top: 0,
            left: 15,
            right: 15,
            bottom: 0,
            height: '100%',
          }}
          data={transformedBarData}
          svg={{
            fill: currentTheme.accent,
            scaleX: 1,
          }}
          contentInset={{top: 30, bottom: 30}}
          yMax={
            Math.max(...transformedLineData.concat(transformedBarData)) * 1.1
          }
          yMin={0}

          /* spacingInner={0}
          spacingOuter={0} */
          //yScale={() => yScale} // Use the logarithmic scale here
        />
        <LineChart
          style={{
            position: 'absolute',
            left: 21,
            right: 21,
            bottom: 0,
            top: 0,
            height: '100%',
          }}
          yMax={
            Math.max(...transformedLineData.concat(transformedBarData)) * 1.1
          }
          yMin={0}
          data={transformedLineData}
          svg={{stroke: 'url(#gradient)', strokeWidth: 3, scaleY: 1}}
          contentInset={{top: 30, bottom: 30}}
          //yScale={() => yScale} // Use the logarithmic scale here
        >
          <Defs key={'gradient'}>
            <LinearGradient id={'gradient'} x1={'0'} y1={'0'} x2={'1'} y2={'0'}>
              {lineData.map((value, index) => {
                return (
                  <Stop
                    key={index.toString() + value.toString()}
                    offset={index / 24}
                    stopColor={gradientCalculator(
                      barData,
                      transformedLineData[index],
                      transformedBarData[index],
                      index,
                    )}
                  />
                );
              })}
            </LinearGradient>
          </Defs>
        </LineChart>
        <XAxis
          style={{position: 'absolute', bottom: 0, left: 0, right: 0}}
          data={Array.from({length: 24})} // Why do these values not matter?
          //scale={xScale}
          formatLabel={(value, i) => {
            return labels[Math.round(value)];
          }}
          contentInset={{left: 15, right: 30}}
          svg={{fontSize: 10, fill: currentTheme.textPrimary}}
        />
      </View>
    </View>
  );
};

export default Chart;
