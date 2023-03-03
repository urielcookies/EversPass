import { Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import React from "react";
import { StyleSheet, View } from 'react-native';
import ViewWrapper from '../ViewWrapper/ViewWrapper';

const SearchList = () => {
  const navigation = useNavigation();
  const [secondQuery, setSecondQuery] = React.useState<string>('');

  const gotoTestStackScreen = () => {
		navigation.navigate("EversPass");
	};
	return (
    <ViewWrapper>
			<View>
				<Searchbar
					autoFocus
					placeholder="Search"
					onChangeText={(query: string) => setSecondQuery(query)}
					value={secondQuery}
					onIconPress={gotoTestStackScreen}
					icon={{ source: 'arrow-left', direction: 'auto' }}
					style={styles.searchbar}
				/>
			</View>
    </ViewWrapper>
	);
}


SearchList.title = 'Searchbar';

const styles = StyleSheet.create({
  searchbar: {
    margin: 4,
  },
});

export default SearchList;


// - On new Screen
//   - Add search 
//   - Add button to go back
// - filter based on state on search