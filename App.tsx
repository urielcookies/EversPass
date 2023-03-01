import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {PropsWithChildren, useContext} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {Button, Provider as PaperProvider} from 'react-native-paper'; //https://reactnativepaper.com/
import Themes from './src/Configs/Themes/Themes';
import Home from './src/Components/Home/Home';
import { useNavigation } from '@react-navigation/native';
import ThemeProvider, { ThemesContext } from './src/Context/ThemesContext';

function TestScreen() {
  const navigation = useNavigation();

  const gotoTestStackScreen = () => {
		navigation.navigate("EversPass");
	};
	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>TEST!</Text>
        <Button onPress={gotoTestStackScreen}>Back Home</Button>
      </View>
		</View>
	);
}

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

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
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
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
        <View>
        <Button
          mode="outlined"
          onPress={updateThemeState}>
          Turn Dark mode {themeState.darkMode ? 'off' : 'on'}
        </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Profile() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Profile!</Text>
    </View>
  );
}

function Notifications() {
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1, alignItems: 'center'}}>
        <Button
          icon="camera"
          mode="outlined"
          onPress={() => console.log('Pressed')}>
          Press me
        </Button>
      </View>
      <View style={{flex: 9}}>
        <Button
          icon="camera"
          mode="outlined"
          onPress={() => console.log('Pressed')}>
          Press me
        </Button>
      </View>
    </View>
  );
}
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: '#00a9a9',
      }}>
      <Tab.Screen
        name="EversPass"
        component={Home}
        options={{
          tabBarLabel: 'Home', 
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="home-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Browse"
        component={Notifications}
        options={{
          tabBarLabel: 'Browse',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="dots-grid"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Tools"
        component={Profile}
        options={{
          tabBarLabel: 'Tools',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="tools" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Menu"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Menu',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="menu" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return(
		<NavigationContainer>
      <ThemeProvider>
        <Themes>
          <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Tabs">
            <Stack.Screen name="Test" component={TestScreen} />
            <Stack.Screen name="Tabs" component={MyTabs} />
          </Stack.Navigator>
        </Themes>
      </ThemeProvider>
		</NavigationContainer>
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