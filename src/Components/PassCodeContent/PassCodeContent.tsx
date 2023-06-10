import { StyleSheet, Text, View } from 'react-native';
import { useNavigation, NavigationProp, RouteProp } from '@react-navigation/native';
import { Button, MD3Colors, useTheme } from 'react-native-paper';
import ViewWrapper from '../ViewWrapper/ViewWrapper';
import { FC } from 'react';


const PassCodeContent: FC<PassCodeContentProps> = (props) => {
	const { data } = props.route.params;
  const navigation = useNavigation<Nav>();

  const { colors } = useTheme();
	const styles = themeStyle(colors);


  const gotoTestStackScreen = () => {
		navigation.navigate("Home");
	};

	console.log('props->', props);
	console.log('data->', data);

	return (
    <ViewWrapper notchProtection>
      <View style={styles.navIcons}>
        <Text>Navigation Icons</Text>
        <Button onPress={gotoTestStackScreen}>PASS CODE CONTENT</Button>
      </View>

      <View style={styles.logoIcon}>
        <Text>Logo</Text>
      </View>

      <View style={styles.title}>
        <Text>Title</Text>
      </View>

      <View style={styles.actionButtons}>
        <Text>Action Buttons</Text>
      </View>

      <View style={styles.content}>
        <Text>Action Buttons</Text>
      </View>

      <View style={styles.webApp}>
        <Text>Web App</Text>
      </View>
    </ViewWrapper>
	);
}

const themeStyle = (colors: MD3Colors) => StyleSheet.create({
	navIcons: {
		flex: 2,
    // backgroundColor: 'red',
    backgroundColor: colors.onPrimary,
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 7.5,
	},
  logoIcon: {
		flex: 3,
    // backgroundColor: 'blue',
    backgroundColor: colors.onPrimary,
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 7.5,
    marginBottom: 7.5,
  },
  title: {
		flex: 2,
    // backgroundColor: 'yellow',
    backgroundColor: colors.onPrimary,
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 7.5,
    marginBottom: 7.5,
  },
  actionButtons: {
		flex: 3.5,
    // backgroundColor: 'brown',
    backgroundColor: colors.onPrimary,
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 7.5,
    marginBottom: 7.5,
  },
  content: {
		flex: 10,
    // backgroundColor: 'pink',
    backgroundColor: colors.onPrimary,
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 7.5,
    marginBottom: 7.5,
  },
  webApp: {
		flex: 5,
    // backgroundColor: 'green',
    backgroundColor: colors.onPrimary,
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 7.5,
  },
});

type RootStackParamList = {
  // Home: undefined;
  PassCodeContent: { data: PassCodeProps };
}


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
