import React, { FC, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import {
  Button,
  Dialog,
  Portal,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import { Formik } from 'formik';
import { cloneDeep, isEqual, map, some } from 'lodash';
import { RouteProp, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';

import TranspBgrViewProps from '../../RenderProps/TranspBgrView';
import useStoredDataStore from '../../Store/useStoredDataStore';
import {
  PassCodeType,
  SecurityType,
  CustomField,
} from '../../Configs/interfaces/PassCodeData';
import ViewWrapper from '../ViewWrapper/ViewWrapper';
import PassCodeFields from './PassCodeFields';


const PassCodeContentEditor: FC<PassCodeContentProps> = props => {
  const { data } = props.route.params;
  const { addStoredSecret, updateStoredSecret } = useStoredDataStore();
  const navigation = useNavigation<Nav>();

  const { colors } = useTheme();
  const styles = themeStyle(colors);

  const [isSaving, setIsSaving] = useState(false);
  const [showCustomFieldModal, setShowCustomFieldModal] = useState(false);
  const [newField, setNewField] = useState('');
  const [showDialogError, setShowDialogError] = useState(false);

  const securityTypeObj: SecurityType = {
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
      note: '',
      customFields: [],
    },
    PERSONALINFO: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      note: '',
      customFields: [],
    },
    SECURENOTE: {
      note: '',
      customFields: [],
    },
  };

  const form: PassCodeType = {
    id: data.id,
    title: data.title,
    securityType: data.securityType,
    passData: data.id ? data.passData : securityTypeObj[data.securityType],
  };

  const addFieldsHandler = (customFields: CustomField[], setField: any) => {
    const clonedCustomFields = cloneDeep(customFields || []);
    clonedCustomFields.push({ name: newField, value: '' });
    setField('passData.customFields', clonedCustomFields)
    onDismissDialog();
  };

  const dialogNewFieldOnChangeHandler = (value: string, customFields: CustomField[]) => {
    setNewField(value);
    const clonedCustomFields = cloneDeep(customFields || []);
    const isFieldAlreadyExists = some(clonedCustomFields, field =>
      isEqual(field.name, value),
    );
    if (isFieldAlreadyExists) {
      setShowDialogError(true);
    } else {
      setShowDialogError(false);
    }
  };

  const onDismissDialog = () => {
    setShowDialogError(false);
    setShowCustomFieldModal(false);
    setNewField('');
  };

  const handleFormSubmit = (formikForm: PassCodeType) => {
    setIsSaving(true);
    if (isEqual(formikForm.id, 0)) {
      addStoredSecret(formikForm);
    } else {
      updateStoredSecret(formikForm);
    }
    navigation.navigate('PassCodeContent', { data: formikForm });
  };

  return (
    <ViewWrapper notchProtection>
      <ScrollView stickyHeaderIndices={[0]}>
        <Formik
        initialValues={form}
        onSubmit={handleFormSubmit}>
          {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors }) => (
            <>
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

                <TouchableWithoutFeedback onPress={() => handleSubmit()}>
                  <View style={styles.edit}>
                    <MaterialCommunityIcons
                      name="check"
                      size={30}
                      color={colors.onSecondaryContainer}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>

            <View style={styles.content}>
              <TextInput
                label="Title*"
                autoCapitalize="none"
                value={values.title}
                onChangeText={handleChange('title')}
              />

              <PassCodeFields />

              <TranspBgrViewProps paddingVertical={5} />

              <Text style={styles.transpBgrView} variant="titleMedium">
                Custom Fields
              </Text>
              <TranspBgrViewProps paddingVertical={5} />
              {map(values.passData.customFields, (customFields, index) => (
                <React.Fragment key={index}>
                  <TranspBgrViewProps paddingVertical={5} />
                  <TextInput
                    autoCapitalize="none"
                    spellCheck={false}
                    label={customFields.name}
                    value={customFields.value}
                    onChangeText={value => {
                      const clonedCustomFields = cloneDeep(
                        values.passData.customFields,
                      ) as CustomField[];
                      clonedCustomFields[index].value = value;
                      setFieldValue('passData.customFields', clonedCustomFields);
                    }}
                    right={
                      <TextInput.Icon icon="dots-vertical" onPress={console.log} />
                    }
                  />
                </React.Fragment>
              ))}

              <TranspBgrViewProps paddingVertical={5} />

              <Button
                style={styles.addFieldBtn}
                icon={({ color, size }) => (
                  <MaterialCommunityIcons
                    name="plus-circle-outline"
                    color={color}
                    size={size + 5}
                  />
                )}
                mode="contained"
                onPress={() => setShowCustomFieldModal(true)}>
                Add Field
              </Button>

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
                onChangeText={handleChange('passData.note')} />

              <Portal>
                <Dialog
                  style={styles.dialog}
                  onDismiss={onDismissDialog}
                  visible={showCustomFieldModal}>
                  <Dialog.Title style={styles.dialogTitle}>Field Name</Dialog.Title>
                  <Dialog.Content>
                    <Text variant="bodyLarge">
                      Try to use the same name as the website or app field you'd
                      like to autofill
                    </Text>
                    <View style={styles.viewDivider} />
                    <TextInput
                      autoFocus
                      autoCapitalize="none"
                      spellCheck={false}
                      label="Field Name"
                      value={newField}
                      onChangeText={
                        (text) => dialogNewFieldOnChangeHandler(text, values.passData.customFields)
                      } />
                    <View style={styles.viewDivider} />
                    <Text variant="titleSmall" style={styles.dialogError}>
                      {showDialogError ? 'Field Exists Already' : ''}
                    </Text>
                  </Dialog.Content>
                  <Dialog.Actions>
                    <Button onPress={onDismissDialog}>Cancel</Button>
                    <Button
                      disabled={isEqual(newField, '') || showDialogError}
                      onPress={() => addFieldsHandler(values.passData.customFields, setFieldValue)}>
                      Insert
                    </Button>
                  </Dialog.Actions>
                </Dialog>
              </Portal>
            </View>
          </>
        )}
        </Formik>
      </ScrollView>
      {isSaving && (
        <ActivityIndicator
          style={styles.loading}
          size="large"
          color={colors.onSecondaryContainer}
        />
      )}
    </ViewWrapper>
  );
};

const themeStyle = (colors: MD3Colors) =>
  StyleSheet.create({
    header: {
      backgroundColor: colors.onPrimary,
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
    dialog: {
      borderRadius: 0,
    },
    dialogTitle: {
      textAlign: 'center',
    },
    dialogError: {
      color: 'red',
    },
    content: {
      backgroundColor: colors.onPrimary,
      borderRadius: 10,
      marginLeft: 10,
      marginRight: 10,
      marginTop: 7.5,
      marginBottom: 7.5,
    },
    icon: {
      color: colors.onSecondaryContainer,
      fontSize: 20,
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
    note: {
      maxHeight: 350,
    },
    loading: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

type RootStackParamList = {
  PassCodeContent: { data: PassCodeType };
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
