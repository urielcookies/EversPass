import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomDrawer from '../BottomDrawer/BottomDrawer';
import { useNavigation } from '@react-navigation/native';
import {
  PassCodeType,
  SecurityType
} from '../../Configs/interfaces/PassCodeData';

type Props = {
  closeDrawer: any;
  gotoTestScreen: any;
};

const CreatePassDrawer = (props: Props) => {
  const { closeDrawer } = props;

  const navigation = useNavigation<Nav>();

  const { colors } = useTheme();
  const styles = themeStyle(colors);

  const gotoEditorStackScreen = (securityType: string) => {
    const securityTypeObj: SecurityType = {
      PASSWORD: {
        username: '',
        password: '',
        website: '',
        note: '',
        customFields: [],
      },
      CREDITCARD: {
        cardholder: '',
        cardNumber: '',
        expirationDate: '',
        CVV: '',
        zipCode: '',
        website: '',
        note: '',
        customFields: [],
      },
      PERSONALINFO: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        website: '',
        note: '',
        customFields: [],
      },
      SECURENOTE: {
        note: '',
        customFields: [],
      },
    };
    const data: PassCodeType = {
      id: 0,
      securityType,
      title: '',
      passData: securityTypeObj[securityType],
    };

    navigation.navigate('PassCodeContentEditor', { data });
    closeDrawer();
  };

  return (
    <BottomDrawer handleCloseBottomSheet={closeDrawer} height={0.35}>
      <View style={styles.bottomDrawerContent}>
        <View style={styles.bottomDrawerTitle}>
          <Text style={styles.bottomDrawerTitleText} variant="headlineSmall">
            Add New
          </Text>
        </View>

        <View style={styles.bottomDrawerOptions}>
          <TouchableWithoutFeedback
            onPress={() => gotoEditorStackScreen('PASSWORD')}>
            <View style={styles.bottomDrawerOption}>
              <MaterialCommunityIcons
                name="form-textbox-password"
                style={styles.bottomDrawerOptionIcons}
                size={25}
              />
              <Text variant="titleMedium" style={styles.bottomDrawerOptionFont}>
                &nbsp;Password
              </Text>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => gotoEditorStackScreen('CREDITCARD')}>
            <View style={styles.bottomDrawerOption}>
              <MaterialCommunityIcons
                name="credit-card-outline"
                style={styles.bottomDrawerOptionIcons}
                size={25}
              />
              <Text variant="titleMedium" style={styles.bottomDrawerOptionFont}>
                &nbsp;Credit Card
              </Text>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => gotoEditorStackScreen('PERSONALINFO')}>
            <View style={styles.bottomDrawerOption}>
              <MaterialCommunityIcons
                name="badge-account-horizontal-outline"
                style={styles.bottomDrawerOptionIcons}
                size={25}
              />
              <Text variant="titleMedium" style={styles.bottomDrawerOptionFont}>
                &nbsp;Personal Info
              </Text>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => gotoEditorStackScreen('SECURENOTE')}>
            <View style={styles.bottomDrawerOption}>
              <MaterialCommunityIcons
                name="note-edit-outline"
                style={styles.bottomDrawerOptionIcons}
                size={25}
              />
              <Text variant="titleMedium" style={styles.bottomDrawerOptionFont}>
                &nbsp;Secure Note
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </BottomDrawer>
  );
};

type Nav = {
  navigate: (value: string, data: { data: PassCodeType }) => void;
};

const themeStyle = (colors: MD3Colors) =>
  StyleSheet.create({
    bottomDrawerContent: {
      height: '100%',
      // backgroundColor: 'blue'
    },
    bottomDrawerTitle: {
      height: '20%',
      // backgroundColor: 'yellow'
    },
    bottomDrawerTitleText: {
      fontSize: 25,
      fontWeight: 'bold',
    },
    bottomDrawerOptions: {
      justifyContent: 'space-evenly',
      height: '80%',
      // backgroundColor: 'red'
    },
    bottomDrawerOption: {
      flexDirection: 'row',
    },
    bottomDrawerOptionIcons: {
      color: colors.onSecondaryContainer,
    },
    bottomDrawerOptionFont: {
      fontSize: 22.5,
    },
  });

export default CreatePassDrawer;
