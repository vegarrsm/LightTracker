import {TextStyle} from 'react-native';

const darkColors = {
  backgroundColor: '#1A2421',
  contrast: '#FCFCFC',
  primary: '#F1DAC4',
  secondary: '#5C8F77', // Make secondary or accent suitable for dial
  accent: '#8AC1A2',
  border: '#5C8F77',
};
const lightColors = {
  backgroundColor: '#F0F8FF',
  contrast: '#002A32',
  primary: '#8075FF', //MAKE THIS SOMETHING ELSE (SUITABLE FOR BUTTONS)
  secondary: '#3D6A5B',
  accent: '#5C8F77',
  border: '#D1D1D1',
};

const fontStyles = {
  fonts: {
    primary: 'sans-serif',
    strong: 'Lato',
  },
  fontSizes: {
    small: 12,
    medium: 16,
    large: 20,
    xLarge: 32,
  },
};

const bodyText = (color: string): TextStyle => ({
  fontFamily: fontStyles.fonts.primary,
  fontSize: fontStyles.fontSizes.small,
  color: color,
});

const h1 = (color: string): TextStyle => ({
  fontFamily: fontStyles.fonts.strong,
  fontSize: fontStyles.fontSizes.xLarge,
  fontWeight: 'normal',
  textAlign: 'center',
  textAlignVertical: 'center',
  color: color,
});

const h2 = (color: string): TextStyle => ({
  fontFamily: fontStyles.fonts.primary,
  fontSize: fontStyles.fontSizes.large,
  color: color,
});
const h3 = (color: string): TextStyle => ({
  fontFamily: fontStyles.fonts.primary,
  fontSize: fontStyles.fontSizes.medium,
  color: color,
});

export const generalStyle = (textColor: string) => ({
  bodyText: bodyText(textColor),
  h1: h1(textColor),
  h2: h2(textColor),
  h3: h3(textColor),
  ...fontStyles,
  standardPadding: 10,
  standardTopMargin: 45,
  standardIndent: 30,
  bottomButtonMargin: 40,
});

export const darkTheme = {
  textPrimary: darkColors.contrast,
  textSecondary: darkColors.backgroundColor,
  borderColor: darkColors.border,
  ...generalStyle(darkColors.contrast),
  ...darkColors,
};

export const lightTheme = {
  textPrimary: lightColors.primary,
  textSecondary: lightColors.backgroundColor,
  borderColor: lightColors.border,
  ...generalStyle(lightColors.contrast),
  ...lightColors,
};

export type Theme = typeof lightTheme;
