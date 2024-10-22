import { useEffect, useState } from 'react';
import { find, isEqual } from 'lodash';
import { View, StyleSheet } from 'react-native';
import {
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import { useFormikContext } from 'formik';

import TranspBgrViewProps from '../../../RenderProps/TranspBgrView';
import { getLocalData } from '../../../Configs/utils/storeData';
import { PasswordData } from '../../../Configs/interfaces/PassCodeData';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import React from 'react';
import CustomFieldEditor from '../CustomFieldEditor';
import CommonField from '../CommonField';

interface PasswordEditorProps {
  passwordId?: number;
}

const PasswordEditor: React.FC<PasswordEditorProps> = ({ passwordId }) => {
  // const [activeData, setActiveData] = useState<PasswordData>({
  //   id: 0,
  //   title: '',
  //   securityType: 'PASSWORD',
  //   passData: {
  //     username: '',
  //     password: '',
  //     website: '',
  //     note: '',
  //     customFields: [],
  //   },
  // });
  const {
    errors,
    handleBlur,
    setFieldValue,
    touched,
    values,
  } = useFormikContext<PasswordData>();

  const { colors } = useTheme();
  const styles = themeStyle(colors);
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const data = await getLocalData('stored-secrets');
  //     const selectedData = find(data, ({ id }) => isEqual(id, passwordId));
  //     setActiveData(selectedData);
  //   };
  //   if (passwordId) {
  //     fetchData();
  //   }
  // }, [passwordId]);

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
    <View style={styles.content}>
    <CommonField
      keyName="title"
      type="simple"
      value={values.title} />

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
        value={values.passData.username}
        onChangeText={(text) => setFieldValue('passData.username', text)}
        onBlur={handleBlur('passData.username')}
        error={Boolean(touched.passData?.username && errors.passData?.username)} />

      {touched.passData?.username && errors.passData?.username && (
        <Text style={styles.errorText}>{errors.passData.username}</Text>
      )}

      <TranspBgrViewProps paddingVertical={5} />

      <TextInput
        label="Password*"
        value={values.passData.password}
        onChangeText={(text) => setFieldValue('passData.password', text)}
        secureTextEntry={!passwordVisibility}
        onBlur={handleBlur('passData.password')}
        error={Boolean(touched.passData?.password && errors.passData?.password)}
        right={
          <TextInput.Icon
            icon={passwordVisibility ? 'eye' : 'eye-off'}
            onPress={() => setPasswordVisibility(!passwordVisibility)} />
        } />

      {touched.passData?.password && errors.passData?.password && (
        <Text style={styles.errorText}>{errors.passData.password}</Text>
      )}

      {isEqual(
        checkPasswordStrength(values.passData.password),
        'STRONG',
      ) && (
        <Text
          variant="titleSmall"
          style={styles.passwordStrengthTextSTRONG}>
          Strong Password
        </Text>
      )}
      {isEqual(
        checkPasswordStrength(values.passData.password),
        'MEDIUM',
      ) && (
        <Text
          variant="titleSmall"
          style={styles.passwordStrengthTextMEDIUM}>
          Medium Password
        </Text>
      )}
      {isEqual(checkPasswordStrength(values.passData.password), 'WEAK') && (
        <Text variant="titleSmall" style={styles.passwordStrengthTextWEAK}>
          Weak Password
        </Text>
      )}

      <CommonField
        passData
        keyName="website"
        type="simple"
        title="Website / App"
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
    note: {
      maxHeight: 350,
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
    },
  });

export default PasswordEditor;