import { useEffect, useState } from 'react';
import { cloneDeep, find, isEqual, map } from 'lodash';
import { View, StyleSheet } from 'react-native';
import {
  Button,
  Dialog,
  Portal,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import { useFormikContext } from 'formik';

import TranspBgrViewProps from '../../../RenderProps/TranspBgrView';
import { getLocalData } from '../../../Configs/utils/storeData';
import { CustomField, PasswordData } from '../../../Configs/interfaces/PassCodeData';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import React from 'react';
import CustomFieldEditor from '../CustomFieldEditor';

interface PasswordEditorProps {
  passwordId?: number;
}

const PasswordEditor: React.FC<PasswordEditorProps> = ({ passwordId }) => {
  const [activeData, setActiveData] = useState<PasswordData>({
    id: 0,
    title: '',
    securityType: 'PASSWORD',
    passData: {
      username: '',
      password: '',
      website: '',
      note: '',
      customFields: [],
    },
  });
  const {
    errors,
    handleBlur,
    handleChange,
    setFieldValue,
    touched,
    values,
  } = useFormikContext<PasswordData>();

  const { colors } = useTheme();
  const styles = themeStyle(colors);
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getLocalData('stored-secrets');
      const selectedData = find(data, ({ id }) => isEqual(id, passwordId));
      setActiveData(selectedData);
    };
    if (passwordId) {
      fetchData();
    }
  }, [passwordId]);

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
      <TextInput
        label="Title"
        autoCapitalize="none"
        value={values.title}
        onChangeText={handleChange('title')}
        onBlur={handleBlur('title')}
        error={Boolean(touched.title && errors.title)} />

      {(touched.title && errors.title) && (
        <Text style={styles.errorText}>{errors.title}</Text>
      )}

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

      <TranspBgrViewProps paddingVertical={5} />
      <Text style={styles.transpBgrView} variant="titleMedium">
        Website / App
      </Text>

      <TextInput
        label="Website*"
        autoCapitalize="none"
        spellCheck={false}
        keyboardType="url"
        value={values.passData.website}
        onBlur={handleBlur('passData.website')}
        onChangeText={(text) => setFieldValue('passData.website', text)}
        error={Boolean(touched.passData?.website && errors.passData?.website)} />

      {touched.passData?.website && errors.passData?.website && (
        <Text style={styles.errorText}>{errors.passData.website}</Text>
      )}

      <TranspBgrViewProps paddingVertical={5} />

      <CustomFieldEditor customFields={values.passData.customFields}/>

      <TranspBgrViewProps paddingVertical={5} />

      <Text style={styles.transpBgrView} variant="titleMedium">
        Notes
      </Text>
      <TextInput
        style={styles.note}
        label="Notes"
        autoCapitalize="none"
        multiline
        value={values.passData.note}
        onBlur={handleBlur('passData.note')}
        onChangeText={handleChange('passData.note')}
        error={Boolean(touched.passData?.note && errors.passData?.note)} />

      {touched.passData?.note && errors.passData?.note && (
        <Text style={styles.errorText}>{errors.passData.note}</Text>
      )}
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
