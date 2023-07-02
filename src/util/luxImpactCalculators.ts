export const calculateShift = (luxValue: number): number => {
  //
  const zeroLightResponse = 0.24; // a
  const luxForHalfMaximalShift = 120.0; // b
  const maxSystemResponsiveness = -3.0; // c
  return (
    (zeroLightResponse - maxSystemResponsiveness) /
      (1 + luxValue / luxForHalfMaximalShift) +
    maxSystemResponsiveness
  );
};

export const calculateMelatonin = (luxValue: number): number => {
  const zeroLightResponsea = -0.0156;
  const luxForHalfMaximalShift = 106;
  const maxSystemResponsiveness = 0.936;
  const curveSteepness = 3.55;

  return (
    (zeroLightResponsea - maxSystemResponsiveness) /
      (1 + luxValue / luxForHalfMaximalShift) ** curveSteepness +
    maxSystemResponsiveness
  );
};

export const calculateAlertness = (lux: number): number => {
  const a = -24.4;
  const b = 94.8;
  const c = 3.7;
  const d = -8.11;

  let result = (a - d) / (1 + Math.pow(lux / b, c)) + d;

  // Normalize to 0-1
  result = (result - a) / (d - a);

  return result;
};
