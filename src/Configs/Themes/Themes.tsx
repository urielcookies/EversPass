import { ReactNode, useContext } from "react";
import {
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import { ThemesContext } from '../../Context/ThemesContext';
import lightTheme from './lightColors.json';
import darkTheme from './darkColors.json';

type ThemesProps = {
  children: ReactNode;
};

const Themes = ({ children }: ThemesProps) => {
  const { themeState } = useContext(ThemesContext);
  const activeTheme = themeState.darkMode ? darkTheme : lightTheme;
  const theme = {
    ...DefaultTheme,
    ...activeTheme
  };
  
  return (
    <PaperProvider theme={theme}>
      {children}
    </PaperProvider>
  );
}

export default Themes;
