import { isEmpty, isEqual } from 'lodash';
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
  const { errors, handleBlur, touched, values, setFieldValue } = useFormikContext<PassCodeType>();

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

  const errorsMap = {
    username: !isEmpty(touched.passData) && (touched.passData as Password).username
      && !isEmpty(errors.passData) && (errors.passData as Password).username,
    password: !isEmpty(touched.passData) && (touched.passData as Password).password
      && !isEmpty(errors.passData) && (errors.passData as Password).password,
    cardholder: !isEmpty(touched.passData) && (touched.passData as CreditCard).cardholder
      && !isEmpty(errors.passData) && (errors.passData as CreditCard).cardholder,
    cardNumber: !isEmpty(touched.passData) && (touched.passData as CreditCard).cardNumber
      && !isEmpty(errors.passData) && (errors.passData as CreditCard).cardNumber,
    expirationDate: !isEmpty(touched.passData) && (touched.passData as CreditCard).expirationDate
      && !isEmpty(errors.passData) && (errors.passData as CreditCard).expirationDate,
    CVV: !isEmpty(touched.passData) && (touched.passData as CreditCard).CVV
      && !isEmpty(errors.passData) && (errors.passData as CreditCard).CVV,
    zipCode: !isEmpty(touched.passData) && (touched.passData as CreditCard).zipCode
      && !isEmpty(errors.passData) && (errors.passData as CreditCard).zipCode,
    firstName: !isEmpty(touched.passData) && (touched.passData as PersonalInfo).firstName
      && !isEmpty(errors.passData) && (errors.passData as PersonalInfo).firstName,
    lastName: !isEmpty(touched.passData) && (touched.passData as PersonalInfo).lastName
      && !isEmpty(errors.passData) && (errors.passData as PersonalInfo).lastName,
    email: !isEmpty(touched.passData) && (touched.passData as PersonalInfo).email
      && !isEmpty(errors.passData) && (errors.passData as PersonalInfo).email,
    phone: !isEmpty(touched.passData) && (touched.passData as PersonalInfo).phone
      && !isEmpty(errors.passData) && (errors.passData as PersonalInfo).phone,
    website: !isEmpty(touched.passData) && (
      (touched.passData as Password | CreditCard | PersonalInfo).website
    ) && !isEmpty(errors.passData) && (
      (errors.passData as Password | CreditCard | PersonalInfo).website
    ),
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

          {/* (errors.passData as FormikErrors<Password>) */}
          <TextInput
            label="Email or Username*"
            autoCapitalize="none"
            keyboardType="email-address"
            spellCheck={false}
            value={(values.passData as Password).username}
            onChangeText={(text) => setFieldValue('passData.username', text)}
            onBlur={handleBlur('passData.username')}
            error={Boolean(errorsMap.username)} />

            {errorsMap.username && (
              <Text style={styles.errorText}>{errorsMap.username}</Text>
            )}

          <TranspBgrViewProps paddingVertical={5} />

          <TextInput
            label="Password*"
            value={(values.passData as Password).password}
            onChangeText={(text) => setFieldValue('passData.password', text)}
            secureTextEntry={!passwordVisibility}
            onBlur={handleBlur('passData.password')}
            error={Boolean(errorsMap.password)}
            right={
              <TextInput.Icon
                icon={passwordVisibility ? 'eye' : 'eye-off'}
                onPress={togglePasswordVisibility} />
            } />

          {errorsMap.password && (
            <Text style={styles.errorText}>{errorsMap.password}</Text>
          )}

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
            onBlur={handleBlur('passData.website')}
            onChangeText={(text) => setFieldValue('passData.website', text)}
            error={Boolean(errorsMap.website)} />

          {errorsMap.website && (
            <Text style={styles.errorText}>{errorsMap.website}</Text>
          )}
        </>
      )}

      {isEqual(values.securityType, 'CREDITCARD') && (
        <>
          <TextInput
            label="Cardholder Name"
            autoCapitalize="none"
            spellCheck={false}
            value={(values.passData as CreditCard).cardholder}
            onBlur={handleBlur('passData.cardholder')}
            onChangeText={(text) => setFieldValue('passData.cardholder', text)}
            error={Boolean(errorsMap.cardholder)} />

          {errorsMap.cardholder && (
            <Text style={styles.errorText}>{errorsMap.cardholder}</Text>
          )}

          <TranspBgrViewProps paddingVertical={10} />
          <TextInput
            label="Card Number"
            keyboardType="numeric"
            value={(values.passData as CreditCard).cardNumber}
            onBlur={handleBlur('passData.cardNumber')}
            onChangeText={(text) => {
              // Remove non-digit characters
              const cleaned = text.replace(/\D/g, '');
              // Insert spaces after every 4 digits
              const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
              setFieldValue('passData.cardNumber', formatted);
            }}
            error={Boolean(errorsMap.cardNumber)}
          />

          {errorsMap.cardNumber && (
            <Text style={styles.errorText}>{errorsMap.cardNumber}</Text>
          )}

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
            onBlur={handleBlur('passData.expirationDate')}
            error={Boolean(errorsMap.expirationDate)}
            onChangeText={(value) => {
              const formattedValue = formatExpirationDate(value);
              setFieldValue('passData.expirationDate', formattedValue);
            }} />

          {errorsMap.expirationDate && (
            <Text style={styles.errorText}>{errorsMap.expirationDate}</Text>
          )}

          <TranspBgrViewProps paddingVertical={10} />
          <TextInput
            label="CVV"
            keyboardType="numeric"
            value={(values.passData as CreditCard).CVV}
            onBlur={handleBlur('passData.CVV')}
            onChangeText={(text) => {
              const numericText = text.replace(/\D/g, '');
              setFieldValue('passData.CVV', numericText);
            }}
            error={Boolean(errorsMap.CVV)}
          />

          {errorsMap.CVV && (
            <Text style={styles.errorText}>{errorsMap.CVV}</Text>
          )}

          <TranspBgrViewProps paddingVertical={10} />
          <TextInput
            label="Zip Code"
            keyboardType="numeric"
            value={(values.passData as CreditCard).zipCode}
            onBlur={handleBlur('passData.zipCode')}
            onChangeText={(text) => setFieldValue('passData.zipCode', text)}
            error={Boolean(errorsMap.zipCode)} />

          {errorsMap.zipCode && (
            <Text style={styles.errorText}>{errorsMap.zipCode}</Text>
          )}

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
            onBlur={handleBlur('passData.website')}
            onChangeText={(text) => setFieldValue('passData.website', text)}
            error={Boolean(errorsMap.website)} />

          {errorsMap.website && (
            <Text style={styles.errorText}>{errorsMap.website}</Text>
          )}
        </>
      )}

      {isEqual(values.securityType, 'PERSONALINFO') && (
        <>
          <TextInput
            label="First Name"
            autoCapitalize="none"
            spellCheck={false}
            value={(values.passData as PersonalInfo).firstName}
            onBlur={handleBlur('passData.firstName')}
            onChangeText={(text) => setFieldValue('passData.firstName', text)}
            error={Boolean(errorsMap.firstName)} />

          {errorsMap.firstName && (
            <Text style={styles.errorText}>{errorsMap.firstName}</Text>
          )}

          <TranspBgrViewProps paddingVertical={10} />
          <TextInput
            label="Last Name"
            autoCapitalize="none"
            spellCheck={false}
            value={(values.passData as PersonalInfo).lastName}
            onBlur={handleBlur('passData.lastName')}
            onChangeText={(text) => setFieldValue('passData.lastName', text)}
            error={Boolean(errorsMap.lastName)} />
          <TranspBgrViewProps paddingVertical={10} />
          <TextInput
            label="Email"
            autoCapitalize="none"
            spellCheck={false}
            keyboardType="email-address"
            value={(values.passData as PersonalInfo).email}
            onBlur={handleBlur('passData.email')}
            onChangeText={(text) => setFieldValue('passData.email', text)}
            error={Boolean(errorsMap.email)} />
          <TranspBgrViewProps paddingVertical={10} />
          <TextInput
            label="Phone"
            keyboardType="numeric"
            value={(values.passData as PersonalInfo).phone}
            onBlur={handleBlur('passData.phone')}
            onChangeText={(text) => setFieldValue('passData.phone', text)}
            error={Boolean(errorsMap.phone)} />
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
            onBlur={handleBlur('passData.website')}
            onChangeText={(text) => setFieldValue('passData.website', text)}
            error={Boolean(errorsMap.website)} />
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
    errorText: {
      color: 'red',
      fontSize: 12,
    }
  });

export default PassCodeFields;
