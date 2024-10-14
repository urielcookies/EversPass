import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  useNavigation,
  NavigationProp,
  RouteProp,
} from '@react-navigation/native';
import { List, Text, useTheme } from 'react-native-paper';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import ViewWrapper from '../ViewWrapper/ViewWrapper';
import { FC, useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PassCodeFields from './PassCodeFields';
import { isEmpty, isUndefined, map } from 'lodash';
import { PassCodeType } from '../../Configs/interfaces/PassCodeData';

const PassCodeContent: FC<PassCodeContentProps> = props => {
  const { data } = props.route.params;

  const navigation = useNavigation<Nav>();

  const { colors } = useTheme();

  const numberofFields: { [key: string]: number } = {
    PASSWORD: 210,
    CREDITCARD: 350,
    PERSONALINFO: 280,
    SECURENOTE: 0,
  };

  const styles = themeStyle(colors, numberofFields[data.securityType]);

  const [navBarStyles, setNavBarStyles] = useState(styles.navIcons);
  const [showTitle, setShowTitle] = useState(false);

  const gotoTestStackScreen = () => {
    navigation.navigate('Home');
  };

  const gotoEditorStackScreen = () => {
    navigation.navigate('PassCodeContentEditor', { data });
  };

  const onScrollHandler = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (event.nativeEvent.contentOffset.y > 200) {
      setShowTitle(true);
      setNavBarStyles({
        ...styles.navIcons,
        ...{
          backgroundColor: colors.onPrimary,
          borderBottomColor: colors.onSecondaryContainer,
          borderBottomWidth: 2,
          // opacity: 0.5/* Change the opacity value as desired */
        },
      });
    } else {
      setShowTitle(false);
      setNavBarStyles(styles.navIcons);
    }
  };

  return (
    <ViewWrapper notchProtection>
      <ScrollView
        stickyHeaderIndices={[0]}
        scrollEventThrottle={16}
        onScroll={onScrollHandler}>
        <View>
          <View style={navBarStyles}>
            <TouchableWithoutFeedback onPress={gotoTestStackScreen}>
              <View style={styles.back}>
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={30}
                  color={colors.onSecondaryContainer}
                />
              </View>
            </TouchableWithoutFeedback>

            {showTitle && (
              <View>
                <Text variant="headlineLarge">{data.title}</Text>
              </View>
            )}

            <TouchableWithoutFeedback onPress={gotoEditorStackScreen}>
              <View style={styles.edit}>
                <MaterialCommunityIcons
                  name="pencil-outline"
                  size={30}
                  color={colors.onSecondaryContainer}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>

        <View style={styles.logoIcon}>
          <Image
            style={styles.logoIcon.logo}
            source={require('../../Assets/amex.jpeg')}
            defaultSource={require('../../Assets/amex.jpeg')}
          />
        </View>

        <View style={styles.title}>
          <Text variant="headlineLarge">{data.title}</Text>
        </View>

        <View style={styles.actionButtons}>
          <View>
            <TouchableWithoutFeedback onPress={gotoTestStackScreen}>
              <View style={styles.actionButton}>
                <MaterialCommunityIcons
                  name="attachment"
                  size={30}
                  color={colors.onSecondaryContainer}
                />
                <Text>Attach File</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View>
            <TouchableWithoutFeedback onPress={gotoTestStackScreen}>
              <View style={styles.actionButton}>
                <MaterialCommunityIcons
                  name="account-plus-outline"
                  size={30}
                  color={colors.onSecondaryContainer}
                />
                <Text>Share</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View>
            <TouchableWithoutFeedback onPress={gotoTestStackScreen}>
              <View style={styles.actionButton}>
                <MaterialCommunityIcons
                  name="dots-vertical"
                  size={30}
                  color={colors.onSecondaryContainer}
                />
                <Text>More</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>

        <View style={styles.content}>
          <PassCodeFields data={data} />
        </View>

        {Boolean(data.passData.website) && (
          <View style={styles.webApp}>
            <List.Item
              titleStyle={{ fontSize: 15, color: 'grey' }}
              descriptionStyle={{ fontSize: 15 }}
              title="Website or App Name"
              description={data.passData.website}
            />
          </View>
        )}

        {!isEmpty(data.passData.customFields) && (
          <View style={styles.customFields}>
            {map(data.passData.customFields, element => (
              <List.Item
                key={element.name}
                titleStyle={{ fontSize: 15, color: 'grey' }}
                descriptionStyle={{ fontSize: 15 }}
                title={element.name}
                description={element.value}
              />
            ))}
          </View>
        )}
        {!isUndefined(data.passData.note) && (
          <View style={styles.note}>
            <List.Item
              titleStyle={{ fontSize: 15, color: 'grey' }}
              descriptionStyle={{ fontSize: 15 }}
              descriptionNumberOfLines={data.passData.note.length * 100}
              title="Note"
              description={data.passData.note}
            />
          </View>
        )}
      </ScrollView>
    </ViewWrapper>
  );
};

const themeStyle = (colors: MD3Colors, totalFields: number) =>
  StyleSheet.create({
    navIcons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: 10,
      marginLeft: 10,
      marginRight: 10,
      marginBottom: 7.5,
    },
    back: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 50,
      width: '15%',
      justifyContent: 'flex-start',
    },
    edit: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 50,
      width: '15%',
      justifyContent: 'flex-end',
    },
    logoIcon: {
      // flex: 3,
      // height: '20%',
      height: 100,
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
      },
    },
    title: {
      // flex: 2,
      // height: '10%',
      height: 40,
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
      // flex: 2.8,
      // height: '15%',
      height: 80,
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
      width: 118.5,
      fontSize: '20px',
      borderRadius: 10,
      gap: 10,
    },
    content: {
      // flex: totalFields,
      // height: '60%',
      height: totalFields,
      // backgroundColor: 'pink',
      backgroundColor: colors.onPrimary,
      borderRadius: 10,
      marginLeft: 10,
      marginRight: 10,
      marginTop: 7.5,
      marginBottom: 7.5,
    },
    webApp: {
      // flex: 2,
      // height: '15%',
      // backgroundColor: 'green',
      backgroundColor: colors.onPrimary,
      borderRadius: 10,
      marginLeft: 10,
      marginRight: 10,
      marginTop: 7.5,
      marginBottom: 7.5,
    },
    customFields: {
      // flex: 2,
      // height: '15%',
      backgroundColor: colors.onPrimary,
      borderRadius: 10,
      marginLeft: 10,
      marginRight: 10,
      marginTop: 7.5,
      marginBottom: 7.5,
    },
    note: {
      // flex: 2,
      // height: '15%',
      // backgroundColor: 'green',
      backgroundColor: colors.onPrimary,
      borderRadius: 10,
      marginLeft: 10,
      marginRight: 10,
      marginTop: 7.5,
      marginBottom: 7.5,
    },
    icon: {
      color: colors.onSecondaryContainer,
      fontSize: 20,
    },
  });

type RootStackParamList = {
  // Home: undefined;
  PassCodeContent: { data: PassCodeType };
};

interface PassCodeContentProps {
  navigation: NavigationProp<Nav>;
  route: RouteProp<RootStackParamList, 'PassCodeContent'>;
}

type Nav = {
  navigate: (value: string, data?: { data: PassCodeType }) => void;
};

// export interface PassCodeProps {
//   id: number;
//   securityType: string;
//   title: string;
//   passData: PassData;
// }

// interface PassData {
//   firstName?: string;
//   lastName?: string;
//   username: string;
//   password?: string;
//   phone?: string;
//   email?: string;
//   website?: string;
//   note?: string;
//   cardholder?: string;
//   cardNumber?: string;
//   expirationDate?: string;
//   CVV?: string;
//   zipCode?: string;
//   customFields?: CustomField[];
// }

// interface CustomField {
//   [key: string]: string;
// }

export default PassCodeContent;
