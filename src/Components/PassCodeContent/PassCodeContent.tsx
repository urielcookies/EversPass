import { useNavigation, NavigationProp, RouteProp } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import ViewWrapper from '../ViewWrapper/ViewWrapper';
import { FC } from 'react';


const PassCodeContent: FC<PassCodeContentProps> = (props) => {
	const { data } = props.route.params;
  const navigation = useNavigation<Nav>();

  const gotoTestStackScreen = () => {
		navigation.navigate("Home");
	};

	console.log('props->', props);
	console.log('data->', data);

	return (
    <ViewWrapper notchProtection>
			<Button onPress={gotoTestStackScreen}>PASS CODE CONTENT</Button>
    </ViewWrapper>
	);
}

type RootStackParamList = {
  // Home: undefined;
  PassCodeContent: { data: PassCodeProps };
};


interface PassCodeContentProps {
	navigation: NavigationProp<Nav>;
	route: RouteProp<RootStackParamList, 'PassCodeContent'>;
}

type Nav = {
  navigate: (value: string) => void;
}

interface PassCodeProps {
  id: number;
  securityType: string;
  title: string;
  passData: PassData;
}

interface PassData {
  firstName?: string;
  lastName?: string;
  username?: string;
  password?: string;
  phone?: string;
  email?: string;
  website?: string;
  note?: string;
  cardholder?: string;
  cardNumber?: string;
  expirationDate?: string;
  CVV?: string;
  zipCode?: string;
  customFields?: CustomField[];
}

interface CustomField {
  [key: string]: string;
}

export default PassCodeContent;
