import { isEqual } from 'lodash';
import React, { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  TextInput,
  Text,
  useTheme,
  List,
  Divider,
  HelperText,
} from 'react-native-paper';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';

import TranspBgrViewProps from '../../RenderProps/TranspBgrView';

const PassCodeFields: FC<IPassCodeFields> = props => {
  const { form, formHandler, securityType } = props;

  const { colors } = useTheme();
  const styles = themeStyle(colors);

  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const togglePasswordVisibility = () =>
    setPasswordVisibility(!passwordVisibility);

  const checkPasswordStrength = (password: string) => {
    // Define criteria for different strength levels
    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    const mediumRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]/;

    if (strongRegex.test(password)) {
      return 'STRONG';
    } else if (mediumRegex.test(password)) {
      return 'MEDIUM';
    } else {
      return 'WEAK';
    }
  };

  return (
    <View>
      {isEqual(securityType, 'PASSWORD') && (
        <>
          <TranspBgrViewProps paddingVertical={10} />
          <Text style={styles.transpBgrView} variant="titleMedium">
            Login Details
          </Text>
          <TranspBgrViewProps paddingVertical={5} />

          <TextInput
            label="Email or Username"
            value={form.username}
            onChangeText={value => formHandler('username', value)}
          />

          <TranspBgrViewProps paddingVertical={5} />

          <TextInput
            label="Password"
            value={form.password}
            onChangeText={value => formHandler('password', value)}
            secureTextEntry={!passwordVisibility}
            right={
              <TextInput.Icon
                icon={passwordVisibility ? 'eye' : 'eye-off'}
                onPress={togglePasswordVisibility}
              />
            }
          />

          {isEqual(
            checkPasswordStrength(form.password as string),
            'STRONG',
          ) && (
            <Text
              variant="titleSmall"
              style={styles.passwordStrengthTextSTRONG}>
              Strong Password
            </Text>
          )}
          {isEqual(
            checkPasswordStrength(form.password as string),
            'MEDIUM',
          ) && (
            <Text
              variant="titleSmall"
              style={styles.passwordStrengthTextMEDIUM}>
              Medium Password
            </Text>
          )}
          {isEqual(checkPasswordStrength(form.password as string), 'WEAK') && (
            <Text variant="titleSmall" style={styles.passwordStrengthTextWEAK}>
              Weak Password
            </Text>
          )}
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
        </>
      )}

      {isEqual(securityType, 'CREDITCARD') && (
        <>
          <TextInput
            label="Cardholder Name"
            value={form.cardholder}
            onChangeText={value => formHandler('cardholder', value)}
          />
          <TranspBgrViewProps paddingVertical={10} />
          <TextInput
            label="Card Number"
            value={form.cardNumber}
            onChangeText={value => formHandler('cardNumber', value)}
          />
          <HelperText
            style={styles.transpBgrView}
            type="info"
            padding="none"
            visible>
            * Required
          </HelperText>
          <TextInput
            label="Expiration Date"
            value={form.expirationDate}
            onChangeText={value => formHandler('expirationDate', value)}
          />
          <TranspBgrViewProps paddingVertical={10} />
          <TextInput
            label="CVV"
            value={form.CVV}
            onChangeText={value => formHandler('CVV', value)}
          />
          <TranspBgrViewProps paddingVertical={10} />
          <TextInput
            label="Zip Code"
            value={form.zipCode}
            onChangeText={value => formHandler('zipCode', value)}
          />
        </>
      )}

      {isEqual(securityType, 'PERSONALINFO') && (
        <>
          <TextInput
            label="First Name"
            value={form.firstName}
            onChangeText={value => formHandler('firstName', value)}
          />
          <TranspBgrViewProps paddingVertical={10} />
          <TextInput
            label="Last Name"
            value={form.lastName}
            onChangeText={value => formHandler('lastName', value)}
          />
          <TranspBgrViewProps paddingVertical={10} />
          <TextInput
            label="Email"
            value={form.email}
            onChangeText={value => formHandler('email', value)}
          />
          <TranspBgrViewProps paddingVertical={10} />
          <TextInput
            label="Phone"
            value={form.phone}
            onChangeText={value => formHandler('phone', value)}
          />
        </>
      )}
    </View>
  );
};

const themeStyle = (colors: MD3Colors) =>
  StyleSheet.create({
    divider: {
      paddingVertical: 10,
    },
    minDivider: {
      paddingVertical: 5,
    },
    transpBgrView: {
      backgroundColor: colors.background,
    },
    passwordStrengthTextSTRONG: {
      color: 'green',
      backgroundColor: colors.background,
    },
    passwordStrengthTextMEDIUM: {
      color: 'yellow',
      backgroundColor: colors.background,
    },
    passwordStrengthTextWEAK: {
      color: 'red',
      backgroundColor: colors.background,
    },
  });

interface IPassCodeFields {
  formHandler: (field: string, value: string) => void;
  form: ExtendedPassData;
  securityType: string;
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

export default PassCodeFields;
