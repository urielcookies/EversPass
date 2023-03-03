import { View, TouchableWithoutFeedback, FlatList } from "react-native";
import { useTheme } from 'react-native-paper';

import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { List, Divider, Text, } from 'react-native-paper';
import { sortBy, upperCase } from "lodash";
import { useRef } from "react";
import ViewWrapper from "../../Components/ViewWrapper/ViewWrapper";

const Home = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const styles = themeStyle(colors);

	const gotoTestStackScreen = () => {
		navigation.navigate('Test');
	};

  const prevChar = useRef('');
  const Item = ({ name, index }: any) => {
    const currentChar = name.charAt(0);
    const showSubHeader = currentChar !== prevChar.current
    if (showSubHeader) prevChar.current = currentChar;

    return (
      <List.Section>
        {showSubHeader && (
          <>
            <List.Subheader
              style={styles.ListSubHeader}>
                {upperCase(currentChar)}
            </List.Subheader>
            <Divider />
          </>
        )}
        <List.Item
          titleStyle={styles.ListItem}
          title={name}
          left={() => (
            <MaterialCommunityIcons style={styles.threeDotIcon} name="image-outline" size={25} />
          )}
          right={() => (
            <MaterialCommunityIcons style={styles.threeDotIcon} name="dots-vertical" size={25} />
          )}
      />
      </List.Section>
    )
  }

  return (
    <ViewWrapper>
      <TouchableWithoutFeedback onPress={gotoTestStackScreen}>
        <View  style={styles.searchBar}>
          <MaterialCommunityIcons style={styles.icon} name="magnify" size={30} />
          <Text style={styles.searchText}>Search</Text>
        </View>
      </TouchableWithoutFeedback>

      <View style={{ flex: 13 }}>
        <FlatList
          data={sortBy(data, ['name'])}
          renderItem={({ item, index }) => (
            <Item name={item.name} index={index} />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </ViewWrapper>
  );
}
const themeStyle = (colors: MD3Colors) => StyleSheet.create({
  searchBar: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingLeft: 30,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: colors.secondaryContainer,
    elevation: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: '#000',
  },
  icon: {
    width: "15%",
    color: colors.onSecondaryContainer,
  },
  searchText: {
    width: "85%",
    fontSize: 20,
    color: colors.onSecondaryContainer,
  },
  ListSubHeader: {
    fontSize: 15,
  },
  ListItem: {
    fontSize: 25,
  },
  threeDotIcon: {
    fontSize: 32,
    color: colors.onSecondaryContainer,
  }
});

export default Home;



const data = [
  {
    id: 1,
    name: 'John',
    age: 25,
    email: 'john@example.com',
    phone: '555-555-5555'
  },
  {
    id: 2,
    name: 'Jane',
    age: 30,
    email: 'jane@example.com',
    phone: '555-555-5555'
  },
  {
    id: 3,
    name: 'Bob',
    age: 40,
    email: 'bob@example.com',
    phone: '555-555-5555'
  },
  {
    id: 4,
    name: 'Alice',
    age: 35,
    email: 'alice@example.com',
    phone: '555-555-5555'
  },
  {
    id: 5,
    name: 'David',
    age: 28,
    email: 'david@example.com',
    phone: '555-555-5555'
  },
  {
    id: 6,
    name: 'Emily',
    age: 32,
    email: 'emily@example.com',
    phone: '555-555-5555'
  },
  {
    id: 7,
    name: 'Mark',
    age: 27,
    email: 'mark@example.com',
    phone: '555-555-5555'
  },
  {
    id: 8,
    name: 'Sarah',
    age: 45,
    email: 'sarah@example.com',
    phone: '555-555-5555'
  },
  {
    id: 9,
    name: 'Tom',
    age: 36,
    email: 'tom@example.com',
    phone: '555-555-5555'
  },
  {
    id: 10,
    name: 'Karen',
    age: 31,
    email: 'karen@example.com',
    phone: '555-555-5555'
  },
  {
    id: 11,
    name: 'Tim',
    age: 42,
    email: 'tim@example.com',
    phone: '555-555-5555'
  },
  {
    id: 12,
    name: 'Linda',
    age: 55,
    email: 'linda@example.com',
    phone: '555-555-5555'
  },
  {
    id: 13,
    name: 'Sam',
    age: 29,
    email: 'sam@example.com',
    phone: '555-555-5555'
  },
  {
    id: 14,
    name: 'Rachel',
    age: 37,
    email: 'rachel@example.com',
    phone: '555-555-5555'
  },
  {
    id: 15,
    name: 'Peter',
    age: 33,
    email: 'peter@example.com',
    phone: '555-555-5555'
  },
]