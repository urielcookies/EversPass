import { FlatList, Image, TouchableWithoutFeedback, View } from "react-native";
import { FAB, useTheme } from 'react-native-paper';

import { useNavigation } from '@react-navigation/native';
import { sortBy, upperCase } from "lodash";
import { useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { Divider, List, Text } from 'react-native-paper';
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ViewWrapper from "../../Components/ViewWrapper/ViewWrapper";

import BottomDrawer from '../../Components/BottomDrawer/BottomDrawer';

const Home = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const styles = themeStyle(colors);

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  
  const handleOpenBottomSheet = () => {
    setIsBottomSheetOpen(true);
  };
  
  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(false);
  };

	const gotoTestStackScreen = () => {
		navigation.navigate('searchList');
	};
  
	const gotoTestScreen = () => {
		handleCloseBottomSheet();
		navigation.navigate('TestScreen');
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
            <Image
              style={styles.avatar}
              source={require('../../Assets/avatar.png')}
              defaultSource={require('../../Assets/avatar.png')} />
          )}
          right={() => (
            <MaterialCommunityIcons
              style={[styles.threeDotIcon]}
              name="dots-vertical"
              size={40} />
          )}
      />
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
          data={sortBy(data, ['name'])}
          renderItem={({ item, index }) => (
            <Item name={item.name} index={index} />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleOpenBottomSheet}
      />

      {isBottomSheetOpen && (
        <BottomDrawer
          handleCloseBottomSheet={handleCloseBottomSheet}
          height={0.35}
          children={(
						<View style={styles.bottomDrawerContent}>
							<View>
								<Text style={styles.bottomDrawerTitle} variant="headlineSmall">Add New</Text>
							</View>

							<View style={styles.bottomDrawerOptions}>
								<TouchableWithoutFeedback onPress={gotoTestScreen}>
									<View style={styles.bottomDrawerOption}>
										<MaterialCommunityIcons
											name="form-textbox-password"
											style={styles.bottomDrawerOptionIcons}
											size={25} />
										<Text variant="titleMedium">&nbsp;Password</Text>
									</View>
								</TouchableWithoutFeedback>

								<TouchableWithoutFeedback onPress={gotoTestScreen}>
									<View style={styles.bottomDrawerOption}>
										<MaterialCommunityIcons
											name="note-text-outline"
											style={styles.bottomDrawerOptionIcons}
											size={25} />
										<Text variant="titleMedium">&nbsp;Secure Note</Text>
									</View>
								</TouchableWithoutFeedback>

								<TouchableWithoutFeedback onPress={gotoTestScreen}>
									<View style={styles.bottomDrawerOption}>
										<MaterialCommunityIcons
											name="credit-card-outline"
											style={styles.bottomDrawerOptionIcons}
											size={25} />
										<Text variant="titleMedium">&nbsp;Credit Card</Text>
									</View>
								</TouchableWithoutFeedback>

								<TouchableWithoutFeedback onPress={gotoTestScreen}>
									<View style={styles.bottomDrawerOption}>
										<MaterialCommunityIcons
											name="badge-account-horizontal-outline"
											style={styles.bottomDrawerOptionIcons}
											size={25} />
										<Text variant="titleMedium">&nbsp;Personal Info</Text>
									</View>
								</TouchableWithoutFeedback>

								<TouchableWithoutFeedback onPress={gotoTestScreen}>
									<View style={styles.bottomDrawerOption}>
										<MaterialCommunityIcons
											name="folder-outline"
											style={styles.bottomDrawerOptionIcons}
											size={25} />
										<Text variant="titleMedium">&nbsp;Folder</Text>
									</View>
								</TouchableWithoutFeedback>
							</View>
						</View>
          )} />
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
	bottomDrawerContent: {
		// flex: 1,
		height: '90%',
		// backgroundColor: 'blue',
		justifyContent: "space-between"
	},
	bottomDrawerTitle: {
		// height: '20%',
		// width: '90%',
		// backgroundColor: 'yellow'
	},
	bottomDrawerOptions: {
		justifyContent: "space-evenly",
		// flex: 1,
		height: '80%',
		// width: '90%',
		// backgroundColor: 'red'
	},
	bottomDrawerOption: {
    flexDirection: 'row',
		// alignItems: ""
		// justifyContent: "space-evenly"
		// height: '90%',
    // paddingVertical: 8,
    // paddingHorizontal: 16,
  },
		bottomDrawerOptionIcons: {
			color: colors.onSecondaryContainer,
  },
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