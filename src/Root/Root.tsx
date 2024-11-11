import { useEffect } from 'react';
import { isEqual, isNil } from 'lodash';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Navigator from '../Components/Navigator/Navigator';
import ThemeProvider from '../Context/ThemesContext';
import Themes from '../Configs/Themes/Themes';
import useStoredDataStore from '../Store/useStoredDataStore';
import useAuthenticatedStore from '../Store/useAuthenticatedStore';

const Root = () => {
  const { setStoredSecrets, setTrashSecrets  } = useStoredDataStore();
  const { setIsAuthenticated } = useAuthenticatedStore();
  useEffect(() => {
    setStoredSecrets();
    setTrashSecrets();
  }, [setStoredSecrets, setTrashSecrets]);

  useEffect(() => {
    const checkCredentials = async () => {
      const isAuthenticatedLocal = await AsyncStorage.getItem('isAuthenticated');
      if(!isNil(isAuthenticatedLocal)) {
        setIsAuthenticated(isEqual(isAuthenticatedLocal, 'true'));
      } else {
        AsyncStorage.setItem('isAuthenticated', 'false');
        setIsAuthenticated(false);
      }
    };
    checkCredentials();
  }, [setIsAuthenticated]);


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
