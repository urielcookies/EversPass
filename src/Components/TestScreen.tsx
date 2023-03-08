import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import ViewWrapper from './ViewWrapper/ViewWrapper';

const TestScreen = () => {
  const navigation = useNavigation();

  const gotoTestStackScreen = () => {
		navigation.navigate("Tabs");
	};

	return (
    <ViewWrapper notchProtection>
			<Button onPress={gotoTestStackScreen}>GO BACK</Button>
    </ViewWrapper>
	);
}


TestScreen.title = 'TestScreen';

export default TestScreen;
