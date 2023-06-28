import { Image, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useNavigation, NavigationProp, RouteProp } from '@react-navigation/native';
import { List, Text, useTheme } from 'react-native-paper';
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import ViewWrapper from '../ViewWrapper/ViewWrapper';
import { FC } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PassCodeFields from './PassCodeFields';


const PassCodeContent: FC<PassCodeContentProps> = (props) => {
	const { data } = props.route.params;
  const navigation = useNavigation<Nav>();

  const { colors } = useTheme();

  const numberofFields: { [key: string]: number } = {
    PASSWORD: 6,
    CREDITCARD: 12,
    SECURENOTE: 7
  };
  
	const styles = themeStyle(colors, numberofFields[data.securityType]);


  const gotoTestStackScreen = () => {
		navigation.navigate("Home");
	};

	console.log('props->', props);
	console.log('data->', data)

	return (
    <ViewWrapper notchProtection>
      <View style={styles.navIcons}>
        <TouchableWithoutFeedback onPress={gotoTestStackScreen}>
          <View style={styles.navIcons.back}>
            <MaterialCommunityIcons name="arrow-left" size={30} color={colors.onSecondaryContainer} />
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={gotoTestStackScreen}>
          <View style={styles.navIcons.edit}>
            <MaterialCommunityIcons name="pencil-outline" size={30} color={colors.onSecondaryContainer} />
          </View>
        </TouchableWithoutFeedback>
      </View>

      <View style={styles.logoIcon}>
        <Image
          style={styles.logoIcon.logo}
          source={require('../../Assets/amex.jpeg')}
          defaultSource={require('../../Assets/amex.jpeg')} />
      </View>

      <View style={styles.title}>
        <Text variant="headlineLarge">{data.title}</Text>
      </View>

      <View style={styles.actionButtons}>
        <View>
          <TouchableWithoutFeedback onPress={gotoTestStackScreen}>
            <View style={styles.actionButton}>
              <MaterialCommunityIcons name="attachment" size={30} color={colors.onSecondaryContainer} />
              <Text>Attach File</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View>
          <TouchableWithoutFeedback onPress={gotoTestStackScreen}>
            <View style={styles.actionButton}>
              <MaterialCommunityIcons name="account-plus-outline" size={30} color={colors.onSecondaryContainer} />
              <Text>Share</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View>
          <TouchableWithoutFeedback onPress={gotoTestStackScreen}>
            <View style={styles.actionButton}>
              <MaterialCommunityIcons name="dots-vertical" size={30} color={colors.onSecondaryContainer} />
              <Text>More</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>

      <View style={styles.content}>
        <PassCodeFields data={data}/>
      </View>

      {Boolean(data.passData.website) && <View style={styles.webApp}>
        <List.Item
          titleStyle={{ fontSize: 15, color: 'grey' }}
          descriptionStyle={{ fontSize: 15 }}
          title="Website or App Name"
          description={data.passData.website} />
      </View>
      }  
    </ViewWrapper>
	);
}

const themeStyle = (colors: MD3Colors, totalFields: number) => StyleSheet.create({
	navIcons: {
		flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: 'red',
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 7.5,
    back: {
      // width: '50%'
      height:30
    },
    edit: {
      height:30
      // width: '50%'
    }
	},
  logoIcon: {
		flex: 3,
    // backgroundColor: 'blue',
    // backgroundColor: colors.onPrimary,
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 7.5,
    marginBottom: 7.5,
    alignItems: 'center',
    justifyContent: 'center',
    logo: {
      width: undefined,
      height: '100%',
      aspectRatio: 1,
      borderRadius: 10,
    }
  },
  title: {
		flex: 2,
    // backgroundColor: 'yellow',
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 7.5,
    marginBottom: 7.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtons: {
		flex: 2.8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: colors.onPrimary,
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 7.5,
    marginBottom: 7.5,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.onPrimary,
    height: '100%',
    width: 125,
    fontSize: '20px',
    borderRadius: 10,
    gap: 10,
  },
  content: {
		flex: totalFields,
    // backgroundColor: 'pink',
    backgroundColor: colors.onPrimary,
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 7.5,
    marginBottom: 7.5,
  },
  webApp: {
		flex: 2,
    // backgroundColor: 'green',
    backgroundColor: colors.onPrimary,
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 7.5,
  },
  icon: {
    color: colors.onSecondaryContainer,
    fontSize: 20,
  }
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

export interface PassCodeProps {
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
