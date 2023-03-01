import { useState } from "react";
import { View, Text, Button, TouchableWithoutFeedback } from "react-native";
import { Searchbar } from 'react-native-paper';

import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Home = () => {
  const navigation = useNavigation();
  // const [searchQuery, setSearchQuery] = useState('');
	const gotoTestStackScreen = () => {
		navigation.navigate('Test');
	};
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={gotoTestStackScreen}>
        <View  style={styles.searchBar}>
          <MaterialCommunityIcons style={styles.icon} name="magnify" size={30} />
          <Text style={styles.searchText}>Search</Text>
        </View>
      </TouchableWithoutFeedback>


      <View style={{flex: 10, justifyContent: 'center', alignItems: 'center'}}>
        <Searchbar
          placeholder="Search"
          onFocus={gotoTestStackScreen}
          value={''}/>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingLeft: 30,
    display: 'flex',
    flexDirection: 'row',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 5,
    // },
    // shadowOpacity: 0.5,
    // shadowRadius: 10,
    // elevation: 5,
  },
  icon: {
    width: "15%"
  },
  searchText: {
    width: "85%",
    fontSize: 20
  }
});


export default Home;