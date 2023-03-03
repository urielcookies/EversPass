import { View, Text } from "react-native";
import { Button } from 'react-native-paper';

import { useNavigation } from '@react-navigation/native';

const SearchList = () => {
  const navigation = useNavigation();

  const gotoTestStackScreen = () => {
		navigation.navigate("EversPass");
	};
	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>TEST!</Text>
        <Button onPress={gotoTestStackScreen}>Back Home</Button>
      </View>
		</View>
	);
}
export default SearchList;


// - On new Screen
//   - Add search 
//   - Add button to go back
// - filter based on state on search