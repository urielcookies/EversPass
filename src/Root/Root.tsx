import { NavigationContainer } from '@react-navigation/native';

import Navigator from '../Components/Navigator/Navigator';
import ThemeProvider from '../Context/ThemesContext';
import Themes from '../Configs/Themes/Themes';

const Root = () => (
  <NavigationContainer>
    <ThemeProvider>
      <Themes>
        <Navigator />
      </Themes>
    </ThemeProvider>
  </NavigationContainer>
)

export default Root;
