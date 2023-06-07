import React from 'react';
import {LineSegment, Gradient} from './Gradient';

export const useGradients = (lineData: number[], barData: number[]) => {
  const gradientData = lineData.map((value, i) => value > barData[i]);

  const paths = lineData.map((value, i) => {
    const d = `M${i * 10},${value} L${(i + 1) * 10},${
      lineData[i + 1] || value
    }`;
    const gradientUrl = `url(#gradient${i})`;

    return <LineSegment key={i} d={d} gradientUrl={gradientUrl} />;
  });

  const gradients = gradientData.map((isGreen, i) => (
    <Gradient id={`gradient${i}`} isGreen={isGreen} key={i} />
  ));

  return {gradients, paths};
};
