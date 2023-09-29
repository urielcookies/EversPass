import React, { FC, useState } from 'react';
import { ScrollView, View, TouchableWithoutFeedback, NativeScrollEvent, NativeSyntheticEvent, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { NavigationProp, RouteProp, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MD3Colors } from "react-native-paper/lib/typescript/types";

import ViewWrapper from '../ViewWrapper/ViewWrapper';

const PassCodeContentEditor: FC<PassCodeContentProps> = (props) => {
  const { data } = props.route.params;

  const navigation = useNavigation<Nav>();

  const { colors } = useTheme();
  const styles = themeStyle(colors);

  const [navBarStyles, setNavBarStyles] = useState(styles.navIcons);
  const [showTitle, setShowTitle] = useState(false);

  const gotoPassCodeConentStackScreen = () =>
    navigation.goBack();

  const gotoEditorStackScreen = () => {
		navigation.navigate("Home");
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
          }
      })
    } else {
      setShowTitle(false);
      setNavBarStyles(styles.navIcons)
    }
  }
  return (
    <ViewWrapper notchProtection>
      <ScrollView stickyHeaderIndices={[ 0 ]} onScroll={onScrollHandler}>
        <View>
          <View style={navBarStyles}>
            <TouchableWithoutFeedback onPress={gotoPassCodeConentStackScreen}>
              <View style={styles.back}>
                <MaterialCommunityIcons name="arrow-left" size={30} color={colors.onSecondaryContainer} />
              </View>
            </TouchableWithoutFeedback>

            {showTitle && (
              <View>
                <Text variant="headlineLarge">{data.title}</Text>
              </View>
            )}

            <TouchableWithoutFeedback onPress={gotoEditorStackScreen}>
              <View style={styles.edit}>
                <MaterialCommunityIcons name="pencil-outline" size={30} color={colors.onSecondaryContainer} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>

        <View style={styles.title}>
          <Text variant="headlineLarge">{data.title}</Text>
        </View>
      </ScrollView>
    </ViewWrapper>
  )
}

const themeStyle = (colors: MD3Colors) => StyleSheet.create({
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
  title: {
    height: 40,
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 7.5,
    marginBottom: 7.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
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
  navigate: (value: string, data?: { data: PassCodeProps } | { data: PassCodeProps[] }) => void;
  goBack: () => void;
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

export default PassCodeContentEditor;
