import { FC } from 'react';
import { Text, useTheme } from 'react-native-paper';
import { Formik } from 'formik';
import { z } from 'zod';
import { isEmpty, isEqual } from 'lodash';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import {
  ScrollView,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import useStoredDataStore from '../../Store/useStoredDataStore';
import ViewWrapper from '../ViewWrapper/ViewWrapper';
import PasswordEditor from './PassCodeFields/PasswordEditor';
import CreditCardEditor from './PassCodeFields/CreditCardEditor';
import PersonalInfoEditor from './PassCodeFields/PersonalInfoEditor';
import SecureNoteEditor from './PassCodeFields/SecureNoteEditor';
import {
  CreditCardData,
  PasswordData,
  PersonalInfoData,
  SecureNoteData,
  Password,
  CreditCard,
  PersonalInfo,
  SecureNote,
} from '../../Configs/interfaces/PassCodeData';


const PassCodeContentEditor: FC<PassCodeContentProps> = props => {
  const { data } = props.route.params;
  const { addStoredSecret, updateStoredSecret } = useStoredDataStore();
  const navigation = useNavigation<Nav>();

  const { colors } = useTheme();
  const styles = themeStyle(colors);

  const securityTypeObj: SecurityTypeObj = {
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
      website: '',
      note: '',
      customFields: [],
    },
  };

  const form: PassCodeType = {
    id: data.id,
    title: data.title,
    securityType: data.securityType,
    passData: data.id
      ? data.passData
      : securityTypeObj[data.securityType as keyof SecurityTypeObj],
  };


  const handleFormSubmit = (formikForm: PassCodeType) => {
    if (isEqual(formikForm.id, 0)) {
      addStoredSecret(formikForm);
    } else {
      updateStoredSecret(formikForm);
    }
    navigation.navigate('PassCodeContent', { data: formikForm });
  };

  const CustomFieldSchema = z.object({
    // name not being used since field is on model when adding it.
    // manual validation has being implemented instead but still left this one on schema
    name: z
      .string()
      .min(1, 'Field name must be at least 1 characters long')
      .max(20, 'Field name must be no longer than 50 characters'),
    value: z
      .string()
      .min(1, 'Value name must be at least 1 characters long')
      .max(1000, 'Value name must be no longer than 1000 characters'),
  });

  const schemaMap = {
    PASSWORD: {
      username: z
        .string()
        .min(1, 'Username must be at least 1 characters long')
        .max(50, 'Username must be no longer than 50 characters'),
      password: z.
        string()
        .min(1, 'Password must be at least 1 characters long')
        .max(128, 'Password must be no longer than 128 characters'),
    },
    CREDITCARD: {
      cardholder: z
        .string()
        .min(1, 'Card holder name must be at least 1 characters long')
        .max(50, 'Card holder name must be no longer than 50 characters'),
      cardNumber: z
        .string()
        .min(13, 'Card Number must be at least 13 digits long')
        .max(19, 'Card Number must be no longer than 19 digits long'),
      expirationDate: z
        .string()
        .regex(/^\d{2}\/\d{2}$/, 'Expiration date must be in MM/YY format')
        .length(5, 'Expiration date must be in MM/YY format'),
      CVV: z
        .string()
        .regex(/^\d+$/, 'CVV must only contain numeric digits')
        .min(3, 'CVV must be at least 3 digits long')
        .max(4, 'CVV must be no longer than 4 digits'),
      zipCode: z
        .string()
        .min(3, 'Zip/Postal code must be at least 3 characters long')
        .max(10, 'Zip/Postal code must be no longer than 10 characters'),
    },
    PERSONALINFO: {
      firstName: z.
        string()
        .min(1, 'First name must be at least 1 characters long')
        .max(50, 'First name must be no longer than 50 characters'),
      lastName: z
        .string().
        min(1, 'Last name must be at least 1 characters long').
        max(50, 'Last name must be no longer than 50 characters').optional(),
      email: z.
        string().
        max(254, 'Email must be no longer than 254 characters').optional(),
      phone: z.string()
        .max(15, 'Phone number must be no longer than 15 characters').optional(),
    },
  };

  const commonFields = {
    website: isEqual(form.securityType, 'PASSWORD')
      ? z
        .string()
        .regex(
          /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
          'Website must be a valid URL'
        )
        .min(1, 'Website must be at least 1 characters long')
        .max(2048, 'Website must be no longer than 254 characters')
      : z.string().max(2048, 'Website must be no longer than 254 characters').optional(),
    note: isEqual(form.securityType, 'SECURENOTE')
      ? z
        .string()
        .min(1, 'Note must be at least 1 characters long')
        .max(1000, 'Note must be no longer than 1000 characters')
      : z.string().max(1000, 'Note must be no longer than 1000 characters').optional(),
    customFields: z.array(CustomFieldSchema).optional(),
  };

  type SecurityTypeKey = keyof typeof schemaMap;

  const getSchema = (type: SecurityTypeKey) => {
    const specificFields = schemaMap[type] || {};
    return z.object({
      id: z.number(),
      title: z.string().min(2, 'Title must be at least 2 characters long'),
      securityType: z.string(),
      passData: z.object({
        ...specificFields,
        ...commonFields,
      }),
    });
  };


  const PassCodeTypeSchema = getSchema(data.securityType as SecurityTypeKey);
  const validate = (values: PassCodeType) => {
    try {
      PassCodeTypeSchema.parse(values);
      return {};
    } catch (e: any) {
      return e.errors.reduce((acc: any, error: any) => {
        if (isEqual(error.path[0], 'passData')) {
          if (isEqual(error.path[1], 'customFields')) {
            if (!acc.passData) {
              acc.passData = {};
            }
            if (!acc.passData.customFields) {
              acc.passData.customFields = {};
            }
            acc.passData.customFields[error.path[2]] = error.message;
          } else {
            if (!acc.passData) {
              acc.passData = {};
            }
            acc.passData[error.path[1]] = error.message;
          }
        } else {
          acc[error.path.join('.')] = error.message;
        }
        return acc;
      }, {});
    }
  };

  return (
    <ViewWrapper notchProtection>
      <Formik
        initialValues={form}
        validate={validate}
        onSubmit={handleFormSubmit}>
          {({ handleSubmit, errors, values }) => (
            <ScrollView stickyHeaderIndices={[0]}>
              <View style={styles.header}>
                <View style={styles.navIcons}>
                  <TouchableWithoutFeedback
                    onPress={navigation.goBack}>
                    <View style={styles.back}>
                      <MaterialCommunityIcons
                        name="arrow-left"
                        size={30}
                        color={colors.onSecondaryContainer}
                      />
                    </View>
                  </TouchableWithoutFeedback>

                  <View style={styles.title}>
                    <Text variant="headlineSmall">{title[data.securityType]}</Text>
                  </View>
                  {!isEmpty(errors) || isEqual(JSON.stringify(values), JSON.stringify(form)) ? (
                  <View style={[styles.edit, { opacity: 0.5 }]}>
                    <MaterialCommunityIcons
                      name="check"
                      size={30}
                      color={colors.onSecondaryContainer}
                    />
                  </View>
                ) : (
                  <TouchableWithoutFeedback onPress={() => handleSubmit()}>
                    <View style={styles.edit}>
                      <MaterialCommunityIcons
                        name="check"
                        size={30}
                        color={colors.onSecondaryContainer}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                )}
                </View>
              </View>
              {isEqual(form.securityType, 'PASSWORD') && (
                <PasswordEditor passwordId={form.id as number} />
              )}
              {isEqual(form.securityType, 'CREDITCARD') && (
                <CreditCardEditor />
              )}
              {isEqual(form.securityType, 'PERSONALINFO') && (
                <PersonalInfoEditor />
              )}
              {isEqual(form.securityType, 'SECURENOTE') && (
                <SecureNoteEditor />
              )}
            </ScrollView>
          )}
      </Formik>
    </ViewWrapper>
  );
};

const themeStyle = (colors: MD3Colors) =>
  StyleSheet.create({
    header: {
      backgroundColor: colors.background,
    },
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
  });

  interface SecurityTypeObj {
    PASSWORD: Password,
    CREDITCARD: CreditCard,
    PERSONALINFO:PersonalInfo,
    SECURENOTE: SecureNote,
  }


type PassCodeType = PasswordData | CreditCardData | PersonalInfoData | SecureNoteData;

type RootStackParamList = {
  PassCodeContent: {
    data: PassCodeType
  };
};

interface PassCodeContentProps {
  route: RouteProp<RootStackParamList, 'PassCodeContent'>;
}

type Nav = {
  navigate: (value: string, data: { data: PassCodeType }) => void;
  goBack: () => void;
};

type Title = {
  [key: string]: string;
};

const title: Title = {
  PASSWORD: 'Edit Password',
  CREDITCARD: 'Edit Credit Card',
  PERSONALINFO: 'Edit Personal Info',
  SECURENOTE: 'Edit Secure Note Info',
};

export default PassCodeContentEditor;
