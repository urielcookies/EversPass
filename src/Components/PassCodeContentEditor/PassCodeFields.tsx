import { isEqual } from 'lodash';
import { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  TextInput,
  Text,
  useTheme,
  HelperText,
} from 'react-native-paper';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';

import TranspBgrViewProps from '../../RenderProps/TranspBgrView';

import {
  PassCodeType,
  Password,
  CreditCard,
  PersonalInfo,
} from '../../Configs/interfaces/PassCodeData';

import { useFormikContext } from 'formik';

const PassCodeFields: FC = () => {
  const { values, setFieldValue } = useFormikContext<PassCodeType>();

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

  const formatExpirationDate = (value: string): string => {
    // Remove any non-numeric characters
    const cleaned = value.replace(/\D/g, '');

    // Format the cleaned value as MM/YY
    if (cleaned.length >= 3) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    } else if (cleaned.length >= 1) {
      return cleaned;
    } else {
      return '';
    }
  };

  return (
    <View>
      {isEqual(values.securityType, 'PASSWORD') && (
        <>
          <TranspBgrViewProps paddingVertical={10} />
          <Text style={styles.transpBgrView} variant="titleMedium">
            Login Details
          </Text>
          <TranspBgrViewProps paddingVertical={5} />

          <TextInput
            label="Email or Username*"
            autoCapitalize="none"
            keyboardType="email-address"
            spellCheck={false}
            value={(values.passData as Password).username}
            onChangeText={(text) => setFieldValue('passData.username', text)} />

          <TranspBgrViewProps paddingVertical={5} />

          <TextInput
            label="Password*"
            value={(values.passData as Password).password}
            onChangeText={(text) => setFieldValue('passData.password', text)}
            secureTextEntry={!passwordVisibility}
            right={
              <TextInput.Icon
                icon={passwordVisibility ? 'eye' : 'eye-off'}
                onPress={togglePasswordVisibility} />
            } />

          {isEqual(
            checkPasswordStrength((values.passData as Password).password),
            'STRONG',
          ) && (
            <Text
              variant="titleSmall"
              style={styles.passwordStrengthTextSTRONG}>
              Strong Password
            </Text>
          )}
          {isEqual(
            checkPasswordStrength((values.passData as Password).password),
            'MEDIUM',
          ) && (
            <Text
              variant="titleSmall"
              style={styles.passwordStrengthTextMEDIUM}>
              Medium Password
            </Text>
          )}
          {isEqual(checkPasswordStrength((values.passData as Password).password), 'WEAK') && (
            <Text variant="titleSmall" style={styles.passwordStrengthTextWEAK}>
              Weak Password
            </Text>
          )}
          <TranspBgrViewProps paddingVertical={5} />
          <Text style={styles.transpBgrView} variant="titleMedium">
            Website / App
          </Text>
          <TranspBgrViewProps paddingVertical={5} />
          <TextInput
            label="Website*"
            autoCapitalize="none"
            spellCheck={false}
            keyboardType="url"
            value={values.passData.website}
            onChangeText={(text) => setFieldValue('passData.website', text)} />
        </>
      )}

      {isEqual(values.securityType, 'CREDITCARD') && (
        <>
          <TextInput
            label="Cardholder Name"
            autoCapitalize="none"
            spellCheck={false}
            value={(values.passData as CreditCard).cardholder}
            onChangeText={(text) => setFieldValue('passData.cardholder', text)} />
          <TranspBgrViewProps paddingVertical={10} />
          <TextInput
            label="Card Number"
            keyboardType="numeric"
            value={(values.passData as CreditCard).cardNumber}
            onChangeText={(text) => setFieldValue('passData.cardNumber', text)} />
          <HelperText
            style={styles.transpBgrView}
            type="info"
            padding="none"
            visible>
            * Required
          </HelperText>
          <TextInput
            label="Expiration Date (MM/YY)"
            keyboardType="numeric"
            value={(values.passData as CreditCard).expirationDate}
            onChangeText={(value) => {
              const formattedValue = formatExpirationDate(value);
              setFieldValue('passData.expirationDate', formattedValue);
            }} />
          <TranspBgrViewProps paddingVertical={10} />
          <TextInput
            label="CVV"
            keyboardType="numeric"
            value={(values.passData as CreditCard).CVV}
            onChangeText={(text) => setFieldValue('passData.CVV', text)} />
          <TranspBgrViewProps paddingVertical={10} />
          <TextInput
            label="Zip Code"
            keyboardType="numeric"
            value={(values.passData as CreditCard).zipCode}
            onChangeText={(text) => setFieldValue('passData.zipCode', text)} />
          <TranspBgrViewProps paddingVertical={5} />
          <Text style={styles.transpBgrView} variant="titleMedium">
            Websites and Apps
          </Text>
          <TranspBgrViewProps paddingVertical={5} />
          <TextInput
            label="Website or App Name"
            autoCapitalize="none"
            spellCheck={false}
            keyboardType="url"
            value={values.passData.website}
            onChangeText={(text) => setFieldValue('passData.website', text)} />
        </>
      )}

      {isEqual(values.securityType, 'PERSONALINFO') && (
        <>
          <TextInput
            label="First Name"
            autoCapitalize="none"
            spellCheck={false}
            value={(values.passData as PersonalInfo).firstName}
            onChangeText={(text) => setFieldValue('passData.firstName', text)} />
          <TranspBgrViewProps paddingVertical={10} />
          <TextInput
            label="Last Name"
            autoCapitalize="none"
            spellCheck={false}
            value={(values.passData as PersonalInfo).lastName}
            onChangeText={(text) => setFieldValue('passData.lastName', text)} />
          <TranspBgrViewProps paddingVertical={10} />
          <TextInput
            label="Email"
            autoCapitalize="none"
            spellCheck={false}
            keyboardType="email-address"
            value={(values.passData as PersonalInfo).email}
            onChangeText={(text) => setFieldValue('passData.email', text)} />
          <TranspBgrViewProps paddingVertical={10} />
          <TextInput
            label="Phone"
            keyboardType="numeric"
            value={(values.passData as PersonalInfo).phone}
            onChangeText={(text) => setFieldValue('passData.phone', text)} />
          <TranspBgrViewProps paddingVertical={5} />
          <Text style={styles.transpBgrView} variant="titleMedium">
            Websites and Apps
          </Text>
          <TranspBgrViewProps paddingVertical={5} />
          <TextInput
            label="Website or App Name"
            autoCapitalize="none"
            spellCheck={false}
            keyboardType="url"
            value={values.passData.website}
            onChangeText={(text) => setFieldValue('passData.website', text)} />
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
      color: '#FFA500',
      backgroundColor: colors.background,
    },
    passwordStrengthTextWEAK: {
      color: 'red',
      backgroundColor: colors.background,
    },
  });

export default PassCodeFields;
