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

const PassCodeFields: FC<IPassCodeFields> = props => {
  const { form, formHandler } = props;

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
      {isEqual(form.securityType, 'PASSWORD') && (
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
            value={(form.passData as Password).username}
            onChangeText={(value) =>
              formHandler('passData', {
                ...form.passData,
                username: value,
              })}
          />

          <TranspBgrViewProps paddingVertical={5} />

          <TextInput
            label="Password*"
            value={(form.passData as Password).password}
            onChangeText={(value) =>
              formHandler('passData', {
                ...form.passData,
                password: value,
              })}
            secureTextEntry={!passwordVisibility}
            right={
              <TextInput.Icon
                icon={passwordVisibility ? 'eye' : 'eye-off'}
                onPress={togglePasswordVisibility}
              />
            }
          />

          {isEqual(
            checkPasswordStrength((form.passData as Password).password),
            'STRONG',
          ) && (
            <Text
              variant="titleSmall"
              style={styles.passwordStrengthTextSTRONG}>
              Strong Password
            </Text>
          )}
          {isEqual(
            checkPasswordStrength((form.passData as Password).password),
            'MEDIUM',
          ) && (
            <Text
              variant="titleSmall"
              style={styles.passwordStrengthTextMEDIUM}>
              Medium Password
            </Text>
          )}
          {isEqual(checkPasswordStrength((form.passData as Password).password), 'WEAK') && (
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
            value={form.passData.website}
            onChangeText={(value) =>
              formHandler('passData', {
                ...form.passData,
                website: value,
              })}
          />
        </>
      )}

      {isEqual(form.securityType, 'CREDITCARD') && (
        <>
          <TextInput
            label="Cardholder Name"
            autoCapitalize="none"
            spellCheck={false}
            value={(form.passData as CreditCard).cardholder}
            onChangeText={(value) =>
              formHandler('passData', {
                ...form.passData,
                cardholder: value,
              })}
          />
          <TranspBgrViewProps paddingVertical={10} />
          <TextInput
            label="Card Number"
            keyboardType="numeric"
            value={(form.passData as CreditCard).cardNumber}
            onChangeText={(value) =>
              formHandler('passData', {
                ...form.passData,
                cardNumber: value,
              })}
          />
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
            value={(form.passData as CreditCard).expirationDate}
            onChangeText={(value) => {
              const formattedValue = formatExpirationDate(value);
              formHandler('passData', {
                ...form.passData,
                expirationDate: formattedValue,
              });}
            }
          />
          <TranspBgrViewProps paddingVertical={10} />
          <TextInput
            label="CVV"
            keyboardType="numeric"
            value={(form.passData as CreditCard).CVV}
            onChangeText={(value) =>
              formHandler('passData', {
                ...form.passData,
                CVV: value,
              })}
          />
          <TranspBgrViewProps paddingVertical={10} />
          <TextInput
            label="Zip Code"
            keyboardType="numeric"
            value={(form.passData as CreditCard).zipCode}
            onChangeText={(value) =>
              formHandler('passData', {
                ...form.passData,
                zipCode: value,
              })}
          />
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
            value={form.passData.website}
            onChangeText={(value) =>
              formHandler('passData', {
                ...form.passData,
                website: value,
              })}
          />
        </>
      )}

      {isEqual(form.securityType, 'PERSONALINFO') && (
        <>
          <TextInput
            label="First Name"
            autoCapitalize="none"
            spellCheck={false}
            value={(form.passData as PersonalInfo).firstName}
            onChangeText={(value) =>
              formHandler('passData', {
                ...form.passData,
                firstName: value,
              })}
          />
          <TranspBgrViewProps paddingVertical={10} />
          <TextInput
            label="Last Name"
            autoCapitalize="none"
            spellCheck={false}
            value={(form.passData as PersonalInfo).lastName}
            onChangeText={(value) =>
              formHandler('passData', {
                ...form.passData,
                lastName: value,
              })}
          />
          <TranspBgrViewProps paddingVertical={10} />
          <TextInput
            label="Email"
            autoCapitalize="none"
            spellCheck={false}
            keyboardType="email-address"
            value={(form.passData as PersonalInfo).email}
            onChangeText={(value) =>
              formHandler('passData', {
                ...form.passData,
                email: value,
              })}
          />
          <TranspBgrViewProps paddingVertical={10} />
          <TextInput
            label="Phone"
            keyboardType="numeric"
            value={(form.passData as PersonalInfo).phone}
            onChangeText={(value) =>
              formHandler('passData', {
                ...form.passData,
                phone: value,
              })}
          />
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
            value={form.passData.website}
            onChangeText={(value) =>
              formHandler('passData', {
                ...form.passData,
                website: value,
              })}
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
      color: '#FFA500',
      backgroundColor: colors.background,
    },
    passwordStrengthTextWEAK: {
      color: 'red',
      backgroundColor: colors.background,
    },
  });

interface IPassCodeFields {
  formHandler: (field: string, value: any) => void;
  form: PassCodeType;
}

export default PassCodeFields;
