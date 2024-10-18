import { useNavigation } from '@react-navigation/native';
import { filter, includes, isEmpty, isEqual, sortBy, toLower, toUpper, upperCase } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import { Divider, List, Searchbar, Text, useTheme } from 'react-native-paper';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ViewWrapper from '../ViewWrapper/ViewWrapper';
import { PassCodeType } from '../../Configs/interfaces/PassCodeData';
import CreatePassDrawer from '../PassEditor/CreatePassDrawer';
import UpdatePassDrawer from '../PassEditor/UpdatePassDrawer';
import useStoredDataStore from '../../Store/useStoredDataStore';

const SearchList = () => {
  const { storedSecrets } = useStoredDataStore();
  const navigation = useNavigation<Nav>();
  const [search, setSearch] = useState<string>('');
  const [filteredList, setFilteredList] = useState<any[]>([]);
	const { colors } = useTheme();
	const styles = themeStyle(colors);

  const searchHandler = useCallback((fieldValue: string) => {
    const filtered = filter(
      storedSecrets,
      ({ title }) => includes(toLower(title), toLower(fieldValue))
    );

    setSearch(fieldValue);

    if (isEqual(fieldValue, '')) {setFilteredList([]);}
    else {setFilteredList(filtered);}
  }, [storedSecrets]);

  useEffect(() => {
    searchHandler(search);
  }, [search, searchHandler, storedSecrets]);

  const gotoTestStackScreen = () => {
    navigation.navigate('Home');
  };

  const [isCreateActive, setIsCreateActive] = useState(false);
  const [isEditActive, setIsEditActive] = useState({});

  const drawerActions = {
    createDrawerClose: () => setIsCreateActive(false),
    createDrawerOpen: () => setIsCreateActive(true),
    updateDrawerClose: () => setIsEditActive({}),
    updateDrawerOpen: (pass: PassCodeType) => setIsEditActive(pass),
  };

  const prevChar = useRef('');
  const Item = ({ data }: { data: PassCodeType }) => {
    const currentChar = toUpper(data.title.charAt(0));
    const showSubHeader = currentChar !== prevChar.current;
    if (showSubHeader) {
      prevChar.current = currentChar;
    }

    const offlineMode = false;
    const logoToken = 'pk_OLd8oa6tSJuxHARkGM-lew';
    const websiteIcons = `https://img.logo.dev/${data.passData.website}?token=${logoToken}`;

    const gotoPassCodeConentStackScreen = (data: PassCodeType) =>
      navigation.navigate('PassCodeContent', {
        data,
      });

    return (
      <List.Section>
        {showSubHeader && (
          <>
            <List.Subheader style={styles.ListSubHeader}>
              {upperCase(currentChar)}
            </List.Subheader>
            <Divider />
          </>
        )}
        <List.Item
          onPress={() => gotoPassCodeConentStackScreen(data)}
          titleStyle={styles.ListItem}
          title={data.title}
          left={() => (
            data.passData.website && !offlineMode
            ? <Image
                style={styles.avatar}
                source={{
                  uri: websiteIcons,
                }}
                defaultSource={require('../../Assets/avatar.png')}
              />
            : <MaterialCommunityIcons
                style={styles.iconAvatar}
                name={iconMap[data.securityType as keyof typeof iconMap]}
            />
          )}
          right={() => (
            <MaterialCommunityIcons
              style={styles.threeDotIcon}
              name="dots-vertical"
              onPress={() => drawerActions.updateDrawerOpen(data)}
            />
          )}
        />
      </List.Section>
    );
  };

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
            data={sortBy(filteredList, item => toUpper(item.title))}
            renderItem={({ item }) => <Item data={item} />}
            keyExtractor={item => item.id.toString()} />
					{/* <FlatList
						data={sortBy(filteredList, ['title'])}
						renderItem={({ item, index }) => (
							<Item title={item.title} index={index} />
						)}
						keyExtractor={(item) => item.id.toString()} /> */}
				</View>
			)}

      {isCreateActive && (
        <CreatePassDrawer
          closeDrawer={drawerActions.createDrawerClose}
          gotoTestScreen={gotoTestScreen}
        />
      )}

      {!isEmpty(isEditActive) && (
        <UpdatePassDrawer
          closeDrawer={drawerActions.updateDrawerClose}
          data={isEditActive as PassCodeType}
        />
      )}
    </ViewWrapper>
	);
};


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
		flex: 13,
	},

  icon: {
    width: '15%',
    color: colors.onSecondaryContainer,
  },
  searchText: {
    width: '85%',
    fontSize: 20,
    color: colors.onSecondaryContainer,
  },
  ListSubHeader: {
    fontSize: 15,
    paddingVertical: 5,
  },
  ListItem: {
    fontSize: 18,
  },
  threeDotIcon: {
    fontSize: 25,
    marginTop: 8,
    color: colors.onSecondaryContainer,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.secondaryContainer,
  },
  avatar: {
    marginTop: 8,
    marginLeft: 10,
    width: 23.5,
    height: 23.5,
    borderRadius: 400 / 2,
  },
  iconAvatar: {
    fontSize: 25,
    marginTop: 8,
    marginLeft: 10,
    width: 23.5,
    height: 23.5,
    color: colors.onSecondaryContainer,
  },
});

const iconMap = {
  PASSWORD: 'form-textbox-password',
  CREDITCARD: 'credit-card-outline',
  PERSONALINFO: 'badge-account-horizontal-outline',
  SECURENOTE: 'note-edit-outline',
};

type Nav = {
  navigate: (
    value: string,
    data?: { data: PassCodeType } | { data: PassCodeType[] },
  ) => void;
};

export default SearchList;
