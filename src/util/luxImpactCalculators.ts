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

export const calculateAlertness = (luxValue: number): number => {
  return luxValue / 1000;
};
