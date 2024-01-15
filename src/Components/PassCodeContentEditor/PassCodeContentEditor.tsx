import React, { FC, useState } from 'react';
import {
  ScrollView,
  View,
  TouchableWithoutFeedback,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
} from 'react-native';
import { HelperText, Text, TextInput, useTheme } from 'react-native-paper';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';

import TranspBgrViewProps from '../../RenderProps/TranspBgrView';
import ViewWrapper from '../ViewWrapper/ViewWrapper';
import PassCodeFields from './PassCodeFields';
import { cloneDeep, find, isEqual, map } from 'lodash';

const PassCodeContentEditor: FC<PassCodeContentProps> = props => {
  const { data } = props.route.params;

  const navigation = useNavigation<Nav>();

  const { colors } = useTheme();
  const styles = themeStyle(colors);

  const [navBarStyles, setNavBarStyles] = useState(styles.navIcons);
  const [showTitle, setShowTitle] = useState(false);
  const [form, setForm] = useState<ExtendedPassData>({
    title: data.title,
    username: data.passData.username,
    password: data.passData.password,
    website: data.passData.website,
    customFields: data.passData.customFields,
  });

  const formHandler = (field: string, value: string | CustomField[]) =>
    setForm(prevForm => ({
      ...prevForm,
      [field]: value,
    }));

  const gotoPassCodeConentStackScreen = () => navigation.goBack();

  const gotoEditorStackScreen = () => {
    navigation.navigate('Home');
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
            <TouchableWithoutFeedback onPress={gotoPassCodeConentStackScreen}>
              <View style={styles.back}>
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={30}
                  color={colors.onSecondaryContainer}
                />
              </View>
            </TouchableWithoutFeedback>

            {/* {showTitle && (
              <View>
                <Text variant="headlineLarge">{data.title}</Text>
              </View>
            )} */}

            <View style={styles.title}>
              <Text variant="headlineSmall">Edit Password</Text>
            </View>

            <TouchableWithoutFeedback onPress={gotoEditorStackScreen}>
              <View style={styles.edit}>
                <MaterialCommunityIcons
                  name="check"
                  size={30}
                  color={colors.onSecondaryContainer}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>

        {/* <View style={styles.title}>
          <Text variant="headlineLarge">{data.title}</Text>
        </View> */}

        <View style={styles.content}>
          <TextInput
            label="Title*"
            value={form.title}
            onChangeText={value => formHandler('title', value)}
          />
          <HelperText
            style={styles.transpBgrView}
            type="info"
            padding="none"
            visible>
            * Required
          </HelperText>

          <PassCodeFields
            form={form}
            formHandler={formHandler}
            securityType={data.securityType}
          />

          <TranspBgrViewProps paddingVertical={5} />
          <Text style={styles.transpBgrView} variant="titleMedium">
            Websites and Apps
          </Text>
          <TranspBgrViewProps paddingVertical={5} />
          <TextInput
            label="Website or App Name"
            value={form.website}
            onChangeText={value => formHandler('website', value)}
          />

          <TranspBgrViewProps paddingVertical={5} />
          <Text style={styles.transpBgrView} variant="titleMedium">
            Custom Fields
          </Text>
          <TranspBgrViewProps paddingVertical={5} />
          {map(form.customFields, (customFields, index) => (
            <React.Fragment key={index}>
              <TranspBgrViewProps paddingVertical={5} />
              <TextInput
                label={customFields.name}
                value={customFields.value}
                onChangeText={value => {
                  const clonedCustomFields = cloneDeep(
                    form.customFields,
                  ) as CustomField[];
                  clonedCustomFields[index].value = value;
                  formHandler('customFields', clonedCustomFields);
                }}
              />
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
    </ViewWrapper>
  );
};

const themeStyle = (colors: MD3Colors) =>
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
    title: {
      height: 40,
      // fontSize: 10,
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
    },
    transpBgrView: {
      backgroundColor: colors.background,
    },
  });

type RootStackParamList = {
  // Home: undefined;
  PassCodeContent: { data: PassCodeProps };
};

interface PassCodeContentProps {
  navigation: NavigationProp<Nav>;
  route: RouteProp<RootStackParamList, 'PassCodeContent'>;
}

type Nav = {
  navigate: (
    value: string,
    data?: { data: PassCodeProps } | { data: PassCodeProps[] },
  ) => void;
  goBack: () => void;
};

export interface PassCodeProps {
  id: number;
  securityType: string;
  title: string;
  passData: PassData;
}

interface ExtendedPassData extends PassData {
  title?: string;
}

interface PassData {
  firstName?: string;
  lastName?: string;
  username: string;
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
