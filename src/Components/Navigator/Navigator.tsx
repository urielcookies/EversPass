import { ComponentType } from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from 'react-native-paper';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Browse from "../../Views/Browse/Browse";
import Home from "../../Views/Home/Home";
import Menu from "../../Views/Menu/Menu";
import Tools from "../../Views/Tools/Tools";
import SearchList from "../SearchList/SearchList";
import TestScreen from "../TestScreen";
import PassCodeContent from "../PassCodeContent/PassCodeContent";

const Navigator = () => {
  const Tab = createBottomTabNavigator();

  function MyTabs() {
    const { colors } = useTheme();
    return (
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: colors.background},
          headerTitleStyle: {
            color: colors.secondary,
            fontSize: 20,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarStyle: {
            backgroundColor: colors.background
          }
        }}>
        <Tab.Screen
          name="Home"
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
          component={Browse}
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
          component={Tools}
          options={{
            tabBarLabel: 'Tools',
            tabBarIcon: ({color, size}) => (
              <MaterialCommunityIcons name="tools" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Menu"
          component={Menu}
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

  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Tabs">
      <Stack.Screen name="searchList" component={SearchList} />
      <Stack.Screen name="Tabs" component={MyTabs} />
      <Stack.Screen name="TestScreen" component={TestScreen} />
      <Stack.Screen name="PassCodeContent" component={PassCodeContent as ComponentType} /> {/* Screen takes props */}
    </Stack.Navigator>
  );
}

export default Navigator;