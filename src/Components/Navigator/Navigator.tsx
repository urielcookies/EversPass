import { useState } from "react";
import { View, Text } from "react-native";
import { Searchbar } from 'react-native-paper';
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const {Navigator, Screen} = createNativeStackNavigator();

const Home = () => {

  const onChangeSearch = (query: any) => setSearchQuery(query)
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>

    </View>
  );
}

export default Home;