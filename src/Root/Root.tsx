import { NavigationContainer } from '@react-navigation/native';

import Navigator from '../Components/Navigator/Navigator';
import ThemeProvider from '../Context/ThemesContext';
import Themes from '../Configs/Themes/Themes';

import useStoredDataStore from '../Store/useStoredDataStore';
import { useEffect } from 'react';

const Root = () => {
  const { setStoredSecrets } = useStoredDataStore();
  useEffect(() => {
    setStoredSecrets();
  }, [setStoredSecrets]);

  return (
    <NavigationContainer>
      <ThemeProvider>
        <Themes>
          <Navigator />
        </Themes>
      </ThemeProvider>
    </NavigationContainer>
  );
};

export default Root;
