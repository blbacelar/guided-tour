/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const torontoColors = {
  primary: "#2D3F7D", // Toronto Blue
  secondary: "#ED2939", // Toronto Red
  background: "#FFFFFF", // White
  text: "#2D3F7D", // Using blue for text
  tint: "#ED2939", // Using red for accents/tints
};

export const Colors = {
  light: {
    text: torontoColors.text,
    background: torontoColors.background,
    tint: torontoColors.tint,
    tabIconDefault: torontoColors.primary + "80", // 50% opacity
    tabIconSelected: torontoColors.tint,
  },
  dark: {
    text: torontoColors.background,
    background: torontoColors.primary,
    tint: torontoColors.tint,
    tabIconDefault: torontoColors.background + "80", // 50% opacity
    tabIconSelected: torontoColors.tint,
  },
};
