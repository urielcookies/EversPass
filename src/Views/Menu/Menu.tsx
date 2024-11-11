import { useContext } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Switch, Text } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import { ThemesContext } from '../../Context/ThemesContext';
import { clearLocalData } from '../../Configs/utils/storeData';
import TranspBgrViewProps from '../../RenderProps/TranspBgrView';
import ViewWrapper from '../../Components/ViewWrapper/ViewWrapper';
import useAuthenticatedStore from '../../Store/useAuthenticatedStore';
import useStoredDataStore from '../../Store/useStoredDataStore';
import { isEmpty } from 'lodash';


function HomeScreen() {
  const styles = themeStyle();
  const { themeState, updateThemeState } = useContext(ThemesContext);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { setIsAuthenticated } = useAuthenticatedStore();
  const { storedSecrets, setMockSecrets, setClearSecrets } = useStoredDataStore();

  const resetApp = async () => {
    // await AsyncStorage.removeItem('isDatabaseInitialized');
    clearLocalData();
    setIsAuthenticated(false); // Should reset all state
    // resetDatabase();
    console.log('App reset: database and initialization flag cleared');
    navigation.navigate('registration');
  };

  return (
    <ViewWrapper>
      <ScrollView>
        <View>
          <View style={styles.container}>
            <Text style={styles.label}>Dark mode</Text>
            <Switch value={themeState.darkMode} onValueChange={updateThemeState} />
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>Always Log In After Close</Text>
            <Switch value={themeState.darkMode} onValueChange={updateThemeState} />
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>Biometrics</Text>
            <Switch value={themeState.darkMode} onValueChange={updateThemeState} />
          </View>
        </View>

        <View>
          <TranspBgrViewProps paddingVertical={5} />
          <View>
            <Button
              mode="outlined"
              onPress={resetApp}>
              Clear All Data
            </Button>
          </View>
          {!isEmpty(storedSecrets)
            ? (
              <>
                <TranspBgrViewProps paddingVertical={5} />
                <View>
                  <Button
                    mode="outlined"
                    onPress={setClearSecrets}>
                    Delete data in Phone Storage
                  </Button>
                </View>
              </>
            )
            : (
              <>
                <TranspBgrViewProps paddingVertical={5} />
                <View>
                  <Button
                    mode="outlined"
                    onPress={setMockSecrets}>
                    Create Fake Data Unto Phone Storage
                  </Button>
                </View>
              </>
          )}
        </View>
      </ScrollView>
    </ViewWrapper>
  );
}

export type RootStackParamList = {
  registration: undefined;
};

const themeStyle = () => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Aligns text and switch to opposite ends
    padding: 16,
  },
  label: {
    fontSize: 16,
  },
});

export default HomeScreen;
