import { ReactNode, useContext } from "react";
import {
  MD3DarkTheme,
  MD3LightTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import { ThemesContext } from '../../Context/ThemesContext';

// #00f0f0
import lightTheme from './lightColors.json';
import darkTheme from './darkColors.json';

type ThemesProps = {
  children: ReactNode;
};

export const colorThemes = {
  light: {
    ...MD3LightTheme,
    ...lightTheme,
    roundness: 5,
  },
  dark: {
    ...MD3DarkTheme,
    ...darkTheme,
    roundness: 5,
  },
}

const Themes = ({ children }: ThemesProps) => {
  const { themeState } = useContext(ThemesContext);
  const activeTheme = themeState.darkMode ? colorThemes["dark"] : colorThemes["light"];
  return (
    <PaperProvider theme={activeTheme}>
      {children}
    </PaperProvider>
  );
}

export default Themes;
