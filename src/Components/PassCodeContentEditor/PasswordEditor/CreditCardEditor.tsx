import { View, StyleSheet } from 'react-native';
import {
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import { useFormikContext } from 'formik';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';

import CommonField from '../CommonField';
import CustomFieldEditor from '../CustomFieldEditor';
import TranspBgrViewProps from '../../../RenderProps/TranspBgrView';
import { CreditCardData } from '../../../Configs/interfaces/PassCodeData';

const CreditCardEditor: React.FC = () => {
  const {
    errors,
    handleBlur,
    setFieldValue,
    touched,
    values,
  } = useFormikContext<CreditCardData>();

  const { colors } = useTheme();
  const styles = themeStyle(colors);

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
    <View style={styles.content}>
      <CommonField
        keyName="title"
        type="simple"
        value={values.title} />

      <TranspBgrViewProps paddingVertical={10} />

      <Text style={styles.transpBgrView} variant="titleMedium">
        Credit Card Details
      </Text>

      <TranspBgrViewProps paddingVertical={5} />

      <TextInput
        label="Cardholder Name"
        autoCapitalize="none"
        spellCheck={false}
        value={values.passData.cardholder}
        onBlur={handleBlur('passData.cardholder')}
        onChangeText={(text) => setFieldValue('passData.cardholder', text)}
        error={Boolean(touched.passData?.cardholder && errors.passData?.cardholder)} />

      {touched.passData?.cardholder && errors.passData?.cardholder && (
        <Text style={styles.errorText}>{errors.passData.cardholder}</Text>
      )}

      <TranspBgrViewProps paddingVertical={5} />
      <TextInput
        label="Card Number"
        keyboardType="numeric"
        value={values.passData.cardNumber}
        onBlur={handleBlur('passData.cardNumber')}
        onChangeText={(text) => {
          // Remove non-digit characters
          const cleaned = text.replace(/\D/g, '');
          // Insert spaces after every 4 digits
          const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
          setFieldValue('passData.cardNumber', formatted);
        }}
        error={Boolean(touched.passData?.cardNumber && errors.passData?.cardNumber)} />

      {touched.passData?.cardNumber && errors.passData?.cardNumber && (
        <Text style={styles.errorText}>{errors.passData.cardNumber}</Text>
      )}

      <TranspBgrViewProps paddingVertical={5} />

      <TextInput
        label="Expiration Date (MM/YY)"
        keyboardType="numeric"
        value={values.passData.expirationDate}
        onBlur={handleBlur('passData.expirationDate')}
        onChangeText={(value) => {
          const formattedValue = formatExpirationDate(value);
          setFieldValue('passData.expirationDate', formattedValue);
        }}
        error={Boolean(touched.passData?.expirationDate && errors.passData?.expirationDate)} />

      {touched.passData?.expirationDate && errors.passData?.expirationDate && (
        <Text style={styles.errorText}>{errors.passData.expirationDate}</Text>
      )}

      <TranspBgrViewProps paddingVertical={5} />
      <TextInput
        label="CVV"
        keyboardType="numeric"
        value={values.passData.CVV}
        onBlur={handleBlur('passData.CVV')}
        onChangeText={(text) => {
          const numericText = text.replace(/\D/g, '');
          setFieldValue('passData.CVV', numericText);
        }}
        error={Boolean(touched.passData?.CVV && errors.passData?.CVV)} />

      {touched.passData?.CVV && errors.passData?.CVV && (
        <Text style={styles.errorText}>{errors.passData.CVV}</Text>
      )}

      <TranspBgrViewProps paddingVertical={5} />
      <TextInput
        label="Zip Code"
        keyboardType="numeric"
        value={values.passData.zipCode}
        onBlur={handleBlur('passData.zipCode')}
        onChangeText={(text) => setFieldValue('passData.zipCode', text)}
        error={Boolean(touched.passData?.zipCode && errors.passData?.zipCode)} />

      {touched.passData?.zipCode && errors.passData?.zipCode && (
        <Text style={styles.errorText}>{errors.passData.zipCode}</Text>
      )}


      <CommonField
        passData
        keyName="website"
        type="simple"
        title="Website / App Name"
        keyboardType="url"
        value={values.passData.website} />

      <TranspBgrViewProps paddingVertical={5} />

      <CustomFieldEditor customFields={values.passData.customFields}/>

      <TranspBgrViewProps paddingVertical={5} />

      <CommonField
        passData
        keyName="note"
        type="note"
        title="Notes"
        value={values.passData.note} />
    </View>
  );
};

const themeStyle = (colors: MD3Colors) =>
  StyleSheet.create({
    content: {
      backgroundColor: colors.onPrimary,
      borderRadius: 10,
      marginLeft: 10,
      marginRight: 10,
      marginTop: 7.5,
      marginBottom: 7.5,
    },
    transpBgrView: {
      backgroundColor: colors.background,
    },
    errorText: {
      color: 'red',
      fontSize: 12,
    },
  });

export default CreditCardEditor;
