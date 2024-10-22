import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';
import { map, cloneDeep, some, isEqual, isEmpty } from 'lodash';
import {
  Button,
  Dialog,
  Portal,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import TranspBgrViewProps from '../../RenderProps/TranspBgrView';
import {
  CreditCardData,
  CustomField,
  PasswordData,
  PersonalInfoData,
  SecureNoteData,
} from '../../Configs/interfaces/PassCodeData';

interface CustomFieldEditorProps {
  customFields: CustomField[];
}

const CustomFieldEditor = ({ customFields }: CustomFieldEditorProps) => {
  const {
    errors,
    handleBlur,
    setFieldValue,
    touched,
  } = useFormikContext<PasswordData | CreditCardData | PersonalInfoData | SecureNoteData>();

  const [newField, setNewField] = useState('');
  const [showCustomFieldModal, setShowCustomFieldModal] = useState(false);
  const [showDialogError, setShowDialogError] = useState('');

  const { colors } = useTheme();
  const styles = themeStyle(colors);

  const onDismissDialog = () => {
    setShowDialogError('');
    setShowCustomFieldModal(false);
    setNewField('');
  };

  const dialogNewFieldOnChangeHandler = (value: string, _customFields: CustomField[]) => {
    setNewField(value);
    const clonedCustomFields = cloneDeep(_customFields);
    const isFieldAlreadyExists = some(
      clonedCustomFields,
      field => isEqual(field.name, value),
    );
    if (newField.length > 20) {
      setShowDialogError('Field name must be no longer than 20 characters');
    }
    else if (isFieldAlreadyExists) {
      setShowDialogError('Field Exists Already');
    } else {
      setShowDialogError('');
    }
  };

  const addFieldsHandler = (
    _customFields: CustomField[],
    setField: (arg0: string, arg1: CustomField[]) => void
  ) => {
      const clonedCustomFields = cloneDeep(_customFields || []);
      clonedCustomFields.push({ name: newField, value: '' });
      setField('passData.customFields', clonedCustomFields);
      onDismissDialog();
  };

  return (
    <>
      <Text style={styles.transpBgrView} variant="titleMedium">
        Custom Fields
      </Text>
      <TranspBgrViewProps paddingVertical={5} />
      {map(customFields, (customField, index) => (
        <React.Fragment key={index}>
          <TextInput
            autoCapitalize="none"
            spellCheck={false}
            label={customField.name}
            value={customField.value}
            onBlur={handleBlur(`passData.customFields.${customField.name}`)}
            onChangeText={value => {
              const clonedCustomFields = cloneDeep(customFields);
              clonedCustomFields[index].value = value;
              setFieldValue('passData.customFields', clonedCustomFields);
            }}
            right={
              <TextInput.Icon icon="dots-vertical" onPress={console.log} />
            }
            error={
              Boolean(
                touched.passData?.customFields?.[customField.name as any] &&
                errors.passData?.customFields?.[index]
              )
            }
            />

          {touched.passData?.customFields?.[customField.name as any]
            && errors.passData?.customFields?.[index] && (
              <Text style={styles.errorText}>
                {errors.passData.customFields[index] as string}
              </Text>
          )}

          <TranspBgrViewProps paddingVertical={5} />
        </React.Fragment>
      ))}

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
                (text) =>
                  dialogNewFieldOnChangeHandler(text, customFields || [])
              }
              error={!isEmpty(showDialogError)} />
            <View style={styles.viewDivider} />
            {!isEmpty(showDialogError) && (
              <Text variant="titleSmall" style={styles.dialogError}>
                {showDialogError}
              </Text>)}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={onDismissDialog}>Cancel</Button>
            <Button
              disabled={
                isEqual(newField, '') || !isEmpty(showDialogError)
              }
              onPress={() => addFieldsHandler(
                  customFields || [],
                  setFieldValue
                )}>
              Insert
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
    errorText: {
      color: 'red',
      fontSize: 12,
    },
  });

export default CustomFieldEditor;
