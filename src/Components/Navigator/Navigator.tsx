import { ComponentType, useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SearchList from '../SearchList/SearchList';
import TestScreen from '../TestScreen';
import PassCodeContent from '../PassCodeContent/PassCodeContent';
import PassCodeContentEditor from '../PassCodeContentEditor/PassCodeContentEditor';
import Browse from '../../Views/Browse/Browse';
import Home from '../../Views/Home/Home';
import Menu from '../../Views/Menu/Menu';
import Tools from '../../Views/Tools/Tools';
import Login from '../../Views/Credentials/Login';
import Registration from '../../Views/Credentials/Registration';


const Navigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();

  // AsyncStorage.setItem('email', 'urielcookies@outlook');
  // AsyncStorage.setItem('password', 'Mercerst.13');

  useEffect(() => {
    const checkCredentials = async () => {
      const email = await AsyncStorage.getItem('email');
      const password = await AsyncStorage.getItem('password');
      // await AsyncStorage.removeItem('email');
      // await AsyncStorage.removeItem('password');
      console.log({ email, password });

      if (email && password) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };
    checkCredentials();
  }, []);

  function MyTabs() {
    const { colors } = useTheme();
    return (
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: {
            color: colors.secondary,
            fontSize: 20,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarStyle: {
            backgroundColor: colors.background,
          },
        }}>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => (
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
          component={Browse}
          options={{
            tabBarLabel: 'Browse',
            tabBarIcon: ({ color, size }) => (
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
          component={Tools}
          options={{
            tabBarLabel: 'Tools',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="tools" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Menu"
          component={Menu}
          options={{
            tabBarLabel: 'Menu',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="menu" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }

  console.log('isAuthenticated', isAuthenticated);
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={isAuthenticated ? 'Tabs' : 'login'}>
      <Stack.Screen name="searchList" component={SearchList} />
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="registration" component={Registration} />
      <Stack.Screen name="Tabs" component={MyTabs} />
      <Stack.Screen name="TestScreen" component={TestScreen} />
      {/* Screen takes props */}
      <Stack.Screen name="PassCodeContent" component={PassCodeContent as ComponentType} />
      <Stack.Screen name="PassCodeContentEditor" component={PassCodeContentEditor as ComponentType} />
    </Stack.Navigator>
  );
};

export default Navigator;
