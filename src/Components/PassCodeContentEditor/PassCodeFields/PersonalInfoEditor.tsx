import { View, StyleSheet } from 'react-native';
import {
  HelperText,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import { useFormikContext } from 'formik';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';

import CommonField from '../CommonField';
import CustomFieldEditor from '../CustomFieldEditor';
import TranspBgrViewProps from '../../../RenderProps/TranspBgrView';
import { PersonalInfoData } from '../../../Configs/interfaces/PassCodeData';

const PersonalInfoEditor: React.FC = () => {
  const {
    errors,
    handleBlur,
    setFieldValue,
    touched,
    values,
  } = useFormikContext<PersonalInfoData>();

  const { colors } = useTheme();
  const styles = themeStyle(colors);

  return (
    <View style={styles.content}>

      <CommonField
        keyName="title"
        type="simple"
        value={values.title} />

      <TranspBgrViewProps paddingVertical={10} />

      <Text style={styles.transpBgrView} variant="titleMedium">
        Personal Info Details
      </Text>

      <TranspBgrViewProps paddingVertical={5} />

      <TextInput
        label="First Name"
        autoCapitalize="none"
        spellCheck={false}
        value={values.passData.firstName}
        onBlur={handleBlur('passData.firstName')}
        onChangeText={(text) => setFieldValue('passData.firstName', text)}
        error={Boolean(touched.passData?.firstName && errors.passData?.firstName)} />

      {touched.passData?.firstName && errors.passData?.firstName && (
        <HelperText type="error" style={styles.helperText}>
          {errors.passData.firstName}
        </HelperText>
      )}

      <TranspBgrViewProps paddingVertical={5} />
      <TextInput
        label="Last Name"
        autoCapitalize="none"
        spellCheck={false}
        value={values.passData.lastName}
        onBlur={handleBlur('passData.lastName')}
        onChangeText={(text) => setFieldValue('passData.lastName', text)}
        error={Boolean(touched.passData?.lastName && errors.passData?.lastName)} />

      {touched.passData?.lastName && errors.passData?.lastName && (
        <HelperText type="error" style={styles.helperText}>
          {errors.passData.lastName}
        </HelperText>
      )}

      <TranspBgrViewProps paddingVertical={5} />
      <TextInput
        label="Email"
        autoCapitalize="none"
        spellCheck={false}
        keyboardType="email-address"
        value={values.passData.email}
        onBlur={handleBlur('passData.email')}
        onChangeText={(text) => setFieldValue('passData.email', text)}
        error={Boolean(touched.passData?.email && errors.passData?.email)} />

      {touched.passData?.email && errors.passData?.email && (
        <HelperText type="error" style={styles.helperText}>
          {errors.passData.email}
        </HelperText>
      )}

      <TranspBgrViewProps paddingVertical={5} />
      <TextInput
        label="Phone"
        keyboardType="numeric"
        value={values.passData.phone}
        onBlur={handleBlur('passData.phone')}
        onChangeText={(text) => setFieldValue('passData.phone', text)}
        error={Boolean(touched.passData?.phone && errors.passData?.phone)} />

      {touched.passData?.phone && errors.passData?.phone && (
        <HelperText type="error" style={styles.helperText}>
          {errors.passData.phone}
        </HelperText>
      )}

      <TranspBgrViewProps paddingVertical={5} />
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
    helperText: {
      backgroundColor: colors.background,
    },
  });

export default PersonalInfoEditor;
