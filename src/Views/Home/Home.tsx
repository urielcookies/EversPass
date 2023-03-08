import { FlatList, Image, TouchableWithoutFeedback, View } from "react-native";
import { FAB, useTheme } from 'react-native-paper';

import { useNavigation } from '@react-navigation/native';
import { sortBy, upperCase } from "lodash";
import { useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { Divider, List, Text } from 'react-native-paper';
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ViewWrapper from "../../Components/ViewWrapper/ViewWrapper";
import fakeData from '../../Configs/constants/fakeData';

import CreatePassDrawer from "../../Components/PassEditor/CreatePassDrawer";
import UpdatePassDrawer from "../../Components/PassEditor/UpdatePassDrawer";

const Home = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const styles = themeStyle(colors);

  const [data, setData] = useState<any>([]);
  const [isCreateActive, setIsCreateActive] = useState(false);
  const [isEditActive, setIsEditActive] = useState(false);
  
	useEffect(() => {
		const fetchData = async () => {
			const data = await mockApi();
			setData(data);
		};
		fetchData();
	}, []);

	const createPassDrawerCloseHandler = () =>
		setIsCreateActive(false);

	const createPassDrawerOpenHandler = () =>
		setIsCreateActive(true);

	const updatePassDrawerCloseHandler = () =>
		setIsEditActive(false);

	const updatePassDrawerOpenHandler = () =>
		setIsEditActive(true);
	
	const gotoTestStackScreen = () =>
		navigation.navigate('searchList', {
			data
		});
  
	const gotoTestScreen = () => {
		createPassDrawerCloseHandler()
		navigation.navigate('TestScreen');
	};

  const prevChar = useRef('');
  const Item = ({ title, index }: any) => {
    const currentChar = title.charAt(0);
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
          title={title}
          left={() => (
            <Image
              style={styles.avatar}
              source={require('../../Assets/avatar.png')}
              defaultSource={require('../../Assets/avatar.png')} />
          )}
          right={() => (
            <MaterialCommunityIcons
              style={[styles.threeDotIcon]}
              name="dots-vertical"
              size={40}
							onPress={updatePassDrawerOpenHandler}/>
          )} />
      </List.Section>
    )
  }

  return (
    <ViewWrapper>
      <TouchableWithoutFeedback onPress={gotoTestStackScreen}>
        <View style={styles.searchBar}>
          <MaterialCommunityIcons style={styles.icon} name="magnify" size={30} />
          <Text style={styles.searchText}>Search</Text>
        </View>
      </TouchableWithoutFeedback>

      <View style={{ flex: 13 }}>
        <FlatList
          data={sortBy(data, ['title'])}
          renderItem={({ item, index }) => (
            <Item title={item.title} index={index} />
          )}
          keyExtractor={(item) => item.id.toString()} />
      </View>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={createPassDrawerOpenHandler} />

      {isCreateActive && (
        <CreatePassDrawer
					closeDrawer={createPassDrawerCloseHandler}
					gotoTestScreen={gotoTestScreen} />
      )}

			{isEditActive && (
        <UpdatePassDrawer
					closeDrawer={updatePassDrawerCloseHandler}
					gotoTestScreen={gotoTestScreen} />
      )}
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
    margin: 8,
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
    margin: 8,
		width: 45, height: 45, borderRadius: 400 / 2,
  }, 
});

const mockApi = () => {
  return new Promise(resolve => {
    // Mock API call response
    const data = fakeData;
    resolve(data);
  });
};

export default Home;
