import { PropsWithChildren, useCallback, useContext, useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View } from "react-native";
import { Colors, DebugInstructions, Header, LearnMoreLinks, ReloadInstructions } from "react-native/Libraries/NewAppScreen";
import { ThemesContext } from '../../Context/ThemesContext';
import { List, Divider } from 'react-native-paper';
import { Button } from "react-native-paper";
import TranspBgrViewProps from '../../RenderProps/TranspBgrView';
import AsyncStorage from '@react-native-async-storage/async-storage';

import fakeData from '../../Configs/constants/fakeData';
import { useFocusEffect } from "@react-navigation/native";

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}
function HomeScreen() {
  const { themeState, updateThemeState } = useContext(ThemesContext);
  const isDarkMode = useColorScheme() === 'dark';
  const [storedSecrets, setStoredSecrets] = useState(false);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const storeData = async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      console.log('key', key)
      console.log('jsonValue', jsonValue)
      console.log('typeof', typeof jsonValue)
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.error(e);
    }
  };

  // Function to retrieve data
  const getData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error(e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const init = async () => {
      const data = await getData('stored-secrets') || [];
      setStoredSecrets(Boolean(data.length));
        };
        init();
      }, [])
  );

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
					<View>
						<Button
							mode="outlined"
							onPress={updateThemeState}>
							Dark mode is currently {themeState.darkMode ? 'on' : 'off'}
						</Button>
					</View>
          {storedSecrets
          ? (
            <>
              <TranspBgrViewProps paddingVertical={5} />
              <View>
                <Button
                  mode="outlined"
                  onPress={() => {
                    storeData('stored-secrets', []);
                    setStoredSecrets(false);
                  }}>
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
                  onPress={() => {
                    storeData('stored-secrets', fakeData);
                    setStoredSecrets(true);
                  }}>
                  Create Data Unto Phone Storage
                </Button>
              </View>
            </>
        )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default HomeScreen;
