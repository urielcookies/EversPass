import { useNavigation } from '@react-navigation/native';
import { filter, includes, isEmpty, isEqual, sortBy, toLower, upperCase } from 'lodash';
import { useRef, useState } from "react";
import { FlatList, StyleSheet, View } from 'react-native';
import { Divider, List, Searchbar, Text, useTheme } from 'react-native-paper';
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ViewWrapper from '../ViewWrapper/ViewWrapper';

const SearchList = ({ route }: any) => {
	const { data } = route.params;

  const navigation = useNavigation();
  const [search, setSearch] = useState<string>('');
  const [filteredList, setFilteredList] = useState<any[]>([]);
	const { colors } = useTheme();
	const styles = themeStyle(colors);

  const gotoTestStackScreen = () => {
		navigation.navigate("Home");
	};

	const searchHandler = (fieldValue: string) => {
		const filtered = filter(data, ({ title }) => includes(toLower(title), toLower(fieldValue)));

		setSearch(fieldValue);

    if (isEqual(fieldValue, '')) setFilteredList([]);
		else setFilteredList(filtered);
	};

	const prevChar = useRef('');
  const Item = ({ title, index }: any) => {
    const currentChar = title.charAt(0);
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
          title={title}
          left={() => (
            <MaterialCommunityIcons style={styles.threeDotIcon} name="image-outline" size={25} />
          )}
          right={() => (
            <MaterialCommunityIcons style={styles.threeDotIcon} name="dots-vertical" size={25} />
          )}/>
      </List.Section>
    )
  }

	return (
    <ViewWrapper notchProtection>
			<View style={styles.topContainer}>
				<Searchbar
					autoFocus
					placeholder="Search"
					onChangeText={(value) => searchHandler(value)}
					value={search}
					onIconPress={gotoTestStackScreen}
					icon={{ source: 'arrow-left', direction: 'auto' }}
					style={styles.searchbar} />
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
						data={sortBy(filteredList, ['title'])}
						renderItem={({ item, index }) => (
							<Item title={item.title} index={index} />
						)}
						keyExtractor={(item) => item.id.toString()} />
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
