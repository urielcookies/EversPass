import { FlatList, Image, TouchableWithoutFeedback, View } from 'react-native';
import { FAB, useTheme } from 'react-native-paper';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { isEmpty, sortBy, toUpper, upperCase } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Divider, List, Text } from 'react-native-paper';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ViewWrapper from '../../Components/ViewWrapper/ViewWrapper';
import fakeData from '../../Configs/constants/fakeData';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CreatePassDrawer from '../../Components/PassEditor/CreatePassDrawer';
import UpdatePassDrawer from '../../Components/PassEditor/UpdatePassDrawer';
import { PassCodeType } from '../../Configs/interfaces/PassCodeData';
import useStoredDataStore from '../../Store/useStoredDataStore';
import FastImage from 'react-native-fast-image';

const Home = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<Nav>();
  const styles = themeStyle(colors);
  const { storedSecrets } = useStoredDataStore();

  const [data, setData] = useState<PassCodeType[]>([]);
  const [isCreateActive, setIsCreateActive] = useState(false);
  const [isEditActive, setIsEditActive] = useState({});

  useFocusEffect(() => {
      setData(storedSecrets);
  });

  const drawerActions = {
    createDrawerClose: () => setIsCreateActive(false),
    createDrawerOpen: () => setIsCreateActive(true),
    updateDrawerClose: () => setIsEditActive({}),
    updateDrawerOpen: (pass: PassCodeType) => setIsEditActive(pass),
  };

  const gotoTestStackScreen = () =>
    navigation.navigate('searchList', {
      data,
    });

  const gotoPassCodeConentStackScreen = (data: PassCodeType) =>
    navigation.navigate('PassCodeContent', {
      data,
    });

  const gotoTestScreen = () => {
    drawerActions.createDrawerClose();
    navigation.navigate('TestScreen');
  };

  const prevChar = useRef('');
  const Item = ({ data }: { data: PassCodeType }) => {
    const currentChar = toUpper(data.title.charAt(0));
    const showSubHeader = currentChar !== prevChar.current;
    if (showSubHeader) {
      prevChar.current = currentChar;
    }

    const offlineMode = false;
    const logoToken = 'pk_OLd8oa6tSJuxHARkGM-lew';
    const websiteIcons = `https://img.logo.dev/${data.passData.website}?token=${logoToken}`;

    return (
      <List.Section>
        {showSubHeader && (
          <>
            <List.Subheader style={styles.ListSubHeader}>
              {upperCase(currentChar)}
            </List.Subheader>
            <Divider />
          </>
        )}
        <List.Item
          onPress={() => gotoPassCodeConentStackScreen(data)}
          titleStyle={styles.ListItem}
          title={data.title}
          left={() => (
            data.passData.website && !offlineMode
            ? <FastImage
                style={styles.avatar}
                source={{
                  uri: websiteIcons,
                }}
                defaultSource={require('../../Assets/avatar.png')}
                resizeMode={FastImage.resizeMode.cover} />
            : <MaterialCommunityIcons
                style={styles.iconAvatar}
                name={iconMap[data.securityType as keyof typeof iconMap]} />
          )}
          right={() => (
            <MaterialCommunityIcons
              style={styles.threeDotIcon}
              name="dots-vertical"
              onPress={() => drawerActions.updateDrawerOpen(data)}
            />
          )}
        />
      </List.Section>
    );
  };

  return (
    <ViewWrapper>
      <TouchableWithoutFeedback onPress={gotoTestStackScreen}>
        <View style={styles.searchBar}>
          <MaterialCommunityIcons
            style={styles.icon}
            name="magnify"
            size={30} />
          <Text style={styles.searchText}>Search</Text>
        </View>
      </TouchableWithoutFeedback>
      <View style={{ flex: 13 }}>
        <FlatList
          data={sortBy(data, item => toUpper(item.title))}
          renderItem={({ item }) => <Item data={item} />}
          keyExtractor={item => item.id.toString()} />
      </View>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={drawerActions.createDrawerOpen} />

      {isCreateActive && (
        <CreatePassDrawer
          closeDrawer={drawerActions.createDrawerClose}
          gotoTestScreen={gotoTestScreen} />
      )}

      {!isEmpty(isEditActive) && (
        <UpdatePassDrawer
          closeDrawer={drawerActions.updateDrawerClose}
          gotoTestScreen={gotoTestScreen}
          data={isEditActive as PassCodeType} />
      )}
    </ViewWrapper>
  );
};
const themeStyle = (colors: MD3Colors) =>
  StyleSheet.create({
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
      width: '15%',
      color: colors.onSecondaryContainer,
    },
    searchText: {
      width: '85%',
      fontSize: 20,
      color: colors.onSecondaryContainer,
    },
    ListSubHeader: {
      fontSize: 15,
      paddingVertical: 5,
    },
    ListItem: {
      fontSize: 18,
    },
    threeDotIcon: {
      fontSize: 25,
      marginTop: 8,
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
      marginTop: 8,
      marginLeft: 10,
      width: 23.5,
      height: 23.5,
      borderRadius: 400 / 2,
    },
    iconAvatar: {
      fontSize: 25,
      marginTop: 8,
      marginLeft: 10,
      width: 23.5,
      height: 23.5,
      color: colors.onSecondaryContainer,
    },
  });

const iconMap = {
  PASSWORD: 'form-textbox-password',
  CREDITCARD: 'credit-card-outline',
  PERSONALINFO: 'badge-account-horizontal-outline',
  SECURENOTE: 'note-edit-outline',
};

// interface PassCodeProps {
//   id: number;
//   securityType: string;
//   title: string;
//   passData: PassData;
// }

// interface PassData {
//   firstName?: string;
//   lastName?: string;
//   username?: string;
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

type Nav = {
  navigate: (
    value: string,
    data?: { data: PassCodeType } | { data: PassCodeType[] },
  ) => void;
};

export default Home;
