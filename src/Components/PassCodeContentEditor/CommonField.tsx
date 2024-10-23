import { capitalize, isEmpty, isEqual } from 'lodash';
import { useFormikContext } from 'formik';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { HelperText, Text, TextInput, useTheme } from 'react-native-paper';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';

import TranspBgrViewProps from '../../RenderProps/TranspBgrView';
import {
  CreditCardData,
  PasswordData,
  PersonalInfoData,
  SecureNoteData,
} from '../../Configs/interfaces/PassCodeData';

interface CommonFieldProps {
  passData?: boolean;
  title?: string | boolean;
  keyboardType?: 'numeric' | 'url';
  customStyles?: StyleProp<ViewStyle>;
  type: 'simple' | 'note';
  keyName: string;
  value: string;
}

const CommonField: React.FC<CommonFieldProps> = (props) => {
  const { passData, customStyles, title, type, keyName, keyboardType, value } = props;
  const {
    errors,
    handleBlur,
    handleChange,
    touched,
  } = useFormikContext<PasswordData | CreditCardData | PersonalInfoData | SecureNoteData>();

  const { colors } = useTheme();
  const styles = themeStyle(colors);

  return (
    <>
      {title && !isEmpty(title) && (
        <>
          <TranspBgrViewProps paddingVertical={5} />
          <Text style={styles.transpBgrView} variant="titleMedium">
            {title}
          </Text>
          <TranspBgrViewProps paddingVertical={5} />
        </>
      )}
      <TextInput
        style={[isEqual(type, 'note') ? styles.note : null, customStyles]}
        label={capitalize(keyName)}
        autoCapitalize="none"
        multiline={isEqual(type, 'note')}
        keyboardType={keyboardType || 'default'}
        // mode="outlined"
        value={value}
        onChangeText={passData ? handleChange(`passData.${keyName}`) : handleChange(keyName)}
        onBlur={passData ? handleBlur(`passData.${keyName}`) : handleBlur(keyName)}
        error={
          passData
          ? Boolean(
              touched.passData?.[keyName as keyof typeof touched.passData] &&
              errors.passData?.[keyName as keyof typeof errors.passData]
            )
          : Boolean(
              touched[keyName as keyof typeof touched] &&
              errors[keyName as keyof typeof errors]
            )
        } />

      {(passData
        ? (
          touched.passData?.[keyName as keyof typeof touched.passData] &&
              errors.passData?.[keyName as keyof typeof errors.passData] && (
                <HelperText type="error" style={styles.helperText}>
                  {errors.passData?.[keyName as keyof typeof errors.passData] as string}
                </HelperText>
          )
        )
        : (touched[keyName as keyof typeof touched] &&
          errors[keyName as keyof typeof errors]) && (
          <HelperText type="error" style={styles.helperText}>
            {errors[keyName as keyof typeof errors] as string}
          </HelperText>
      ))}
    </>
  );
};

const themeStyle = (colors: MD3Colors) =>
  StyleSheet.create({
    dialog: {
      borderRadius: 0,
    },
    dialogTitle: {
      textAlign: 'center',
    },
    dialogError: {
      color: 'red',
    },
    transpBgrView: {
      backgroundColor: colors.background,
    },
    addFieldBtn: {
      borderRadius: 0,
    },
    viewDivider: {
      height: 10,
    },
    helperText: {
      backgroundColor: colors.background,
    },
    note: {
      maxHeight: 350,
    },
  });

export default CommonField;
