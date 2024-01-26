import { createContext, ReactNode, useState } from 'react';
import { noop } from 'lodash';

interface ThemeState {
  darkMode: boolean;
}

interface StateHandlers {
  themeState: ThemeState;
  updateThemeState: () => void;
}

interface Props {
  children: ReactNode;
}

export const ThemesContext = createContext<StateHandlers>({
  themeState: {
    darkMode: false,
  },
  updateThemeState: () => noop(),
});

const ThemeProvider = ({ children }: Props) => {
  const [themeState, setThemeState] = useState<ThemeState>({
    darkMode: false,
  });

  const updateThemeState = () =>
    setThemeState(prevState => ({
      ...prevState,
      darkMode: !prevState.darkMode,
    }));

  const stateHandlers: StateHandlers = {
    themeState,
    updateThemeState,
  };

  return (
    <ThemesContext.Provider value={stateHandlers}>
      {children}
    </ThemesContext.Provider>
  );
};

export default ThemeProvider;
