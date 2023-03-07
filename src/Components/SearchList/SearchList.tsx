import { useNavigation } from '@react-navigation/native';
import { filter, includes, isEmpty, isEqual, sortBy, toLower, upperCase } from 'lodash';
import { useRef, useState } from "react";
import { FlatList, StyleSheet, View } from 'react-native';
import { Divider, List, Searchbar, Text, useTheme } from 'react-native-paper';
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ViewWrapper from '../ViewWrapper/ViewWrapper';

const SearchList = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState<string>('');
  const [filteredList, setFilteredList] = useState<any[]>([]);
	const { colors } = useTheme();
	const styles = themeStyle(colors);

  const gotoTestStackScreen = () => {
		navigation.navigate("EversPass");
	};

	const searchHandler = (fieldValue: string) => {
		setSearch(fieldValue);
		const filtered = filter(data, ({ name, email }) =>
			includes(toLower(name), toLower(fieldValue)) || includes(toLower(name), toLower(email)));
		setFilteredList(filtered);
	};

	const prevChar = useRef('');
  const Item = ({ name, index }: any) => {
    const currentChar = name.charAt(0);
    const showSubHeader = currentChar !== prevChar.current
    if (showSubHeader) prevChar.current = currentChar && currentChar !== prevChar.current;

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
			<View style={styles.topContainer}>
				<Searchbar
					autoFocus
					placeholder="Search"
					onChangeText={(value) => searchHandler(value)}
					value={search}
					onIconPress={gotoTestStackScreen}
					icon={{ source: 'arrow-left', direction: 'auto' }}
					style={styles.searchbar}
				/>
			</View>

			{isEmpty(filteredList) && (
				<View style={styles.bottomContainer} >
					<Text variant="titleLarge">
						{isEqual(search, '') ? 'Search to filter' : 'No results found'}
					</Text>
				</View>
			)}

			{!isEmpty(filteredList) && (
				<View style={styles.bottomContainerResults}>
					<FlatList
						data={sortBy(filteredList, ['name'])}
						renderItem={({ item, index }) => (
							<Item name={item.name} index={index} />
						)}
						keyExtractor={(item) => item.id.toString()}
					/>
				</View>
			)}
    </ViewWrapper>
	);
}


SearchList.title = 'Searchbar';

const themeStyle = (colors: MD3Colors) => StyleSheet.create({
	topContainer: {
		flex: 1,
	},
  searchbar: {
    margin: 4,
  },
	bottomContainer: {
		flex: 13,
    justifyContent: 'center',
    alignItems: 'center',
	},
	bottomContainerResults: {
		flex: 13
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

export default SearchList;

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

// - On new Screen
//   - Add search 
//   - Add button to go back
// - filter based on state on search
