import { FC, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import { List, Text, useTheme } from 'react-native-paper';
import { isEmpty, map } from 'lodash';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import PassCodeFields from './PassCodeFields';
import ViewWrapper from '../ViewWrapper/ViewWrapper';
import useSubscriptionPlanStore from '../../Store/useSubscriptionPlanStore';
import useActivePassCodeStore from '../../Store/useActivePassCodeStore';

const PassCodeContent = () => {
  const { activePassCode: data, resetActivePassCode } = useActivePassCodeStore();
  const navigation = useNavigation<Nav>();
  const { isSubscriber } = useSubscriptionPlanStore();
  const { colors } = useTheme();
  const styles = themeStyle(colors);

  const [navBarStyles, setNavBarStyles] = useState(styles.navIcons);
  const [showTitle, setShowTitle] = useState(false);

  const gotoTestStackScreen = () => {
    navigation.goBack();
    resetActivePassCode();
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
          backgroundColor: colors.background,
          borderBottomColor: colors.primary,
          borderBottomWidth: 2,
          // opacity: 0.5/* Change the opacity value as desired */
        },
      });
    } else {
      setShowTitle(false);
      setNavBarStyles(styles.navIcons);
    }
  };

  const offlineMode = false;
  const logoToken = 'pk_OLd8oa6tSJuxHARkGM-lew';
  const websiteIcons = `https://img.logo.dev/${data.passData.website}?token=${logoToken}`;
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
                  color={colors.primary}
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
                  color={colors.primary}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
        {(data.passData.website && !offlineMode) && (
          <View style={styles.logoIcon}>
            <FastImage
              style={styles.logo}
              source={{
                uri: websiteIcons,
              }}
              defaultSource={require('../../Assets/avatar.png')}
              resizeMode={FastImage.resizeMode.contain} />
        </View>)}

        <View style={styles.title}>
          <Text variant="headlineLarge">{data.title}</Text>
        </View>

        <View style={styles.actionButtons}>
          {isSubscriber && (
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
          )}
          <View>
            <TouchableWithoutFeedback onPress={gotoTestStackScreen}>
              <View style={styles.actionButton}>
                <MaterialCommunityIcons
                  name="account-plus-outline"
                  size={30}
                  color={colors.primary}
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
                  color={colors.primary}
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
              titleStyle={[styles.titleSize, styles.titleColor]}
              descriptionStyle={styles.titleSize}
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
                titleStyle={[styles.titleSize, styles.titleColor]}
                descriptionStyle={styles.titleSize}
                title={element.name}
                description={element.value}
              />
            ))}
          </View>
        )}
        {!isEmpty(data.passData.note) && (
          <View style={styles.note}>
            <List.Item
              titleStyle={[styles.titleSize, styles.titleColor]}
              descriptionStyle={styles.titleSize}
              descriptionNumberOfLines={
                data.passData.note?.length ? data.passData.note.length * 100 : 0
              }
              title="Note"
              description={data.passData.note}
            />
          </View>
        )}
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
    },
    logo: {
      width: undefined,
      height: '100%',
      aspectRatio: 1,
      borderRadius: 10,
    },
    titleColor: {
      color: 'grey',
    },
    titleSize: {
      fontSize: 15,
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
      backgroundColor: colors.background,
      height: '100%',
      width: 118.5,
      fontSize: 20,
      borderRadius: 10,
      gap: 10,
    },
    content: {
      // flex: totalFields,
      // height: '60%',
      // height: totalFields, // recent
      // backgroundColor: 'pink',
      backgroundColor: colors.background,
      borderColor: colors.secondary,
      borderWidth: 1,
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
      backgroundColor: colors.background,
      borderColor: colors.secondary,
      borderWidth: 1,
      borderRadius: 10,
      marginLeft: 10,
      marginRight: 10,
      marginTop: 7.5,
      marginBottom: 7.5,
    },
    customFields: {
      // flex: 2,
      // height: '15%',
      backgroundColor: colors.background,
      borderColor: colors.secondary,
      borderWidth: 1,
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
      backgroundColor: colors.background,
      borderColor: colors.secondary,
      borderWidth: 1,
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

// type RootStackParamList = {
//   PassCodeContent: {
//     data: PasswordData | CreditCardData | PersonalInfoData | SecureNoteData
//   };
// };

type Nav = {
  goBack: () => void;
  navigate: (screen: string, params?: object) => void;
};

export default PassCodeContent;
