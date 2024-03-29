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
  HelperText,
  Portal,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';

import TranspBgrViewProps from '../../RenderProps/TranspBgrView';
import ViewWrapper from '../ViewWrapper/ViewWrapper';
import PassCodeFields from './PassCodeFields';
import { cloneDeep, isEqual, map, some } from 'lodash';

const PassCodeContentEditor: FC<PassCodeContentProps> = props => {
  const { data } = props.route.params;

  const navigation = useNavigation<Nav>();

  const { colors } = useTheme();
  const styles = themeStyle(colors);

  const [isSaving, setIsSaving] = useState(false);
  const [showCustomFieldModal, setShowCustomFieldModal] = useState(false);
  const [newField, setNewField] = useState('');
  const [showDialogError, setShowDialogError] = useState(false);
  const [form, setForm] = useState<ExtendedPassData>({
    title: data.title,
    username: data.passData.username,
    password: data.passData.password,
    website: data.passData.website,
    cardholder: data.passData.cardholder,
    cardNumber: data.passData.cardNumber,
    expirationDate: data.passData.expirationDate,
    CVV: data.passData.CVV,
    zipCode: data.passData.zipCode,
    customFields: data.passData.customFields,
    note: data.passData.note,
  });

  const formHandler = (field: string, value: string | CustomField[]) =>
    setForm(prevForm => ({
      ...prevForm,
      [field]: value,
    }));

  const gotoPassCodeContentStackScreen = () => navigation.goBack();

  const addFieldsHandler = () => {
    const clonedCustomFields = cloneDeep(form.customFields || []);
    clonedCustomFields.push({ name: newField, value: '' });
    formHandler('customFields', clonedCustomFields);
    onDismissDialog();
  };

  const dialogNewFieldOnChangeHandler = (value: string) => {
    setNewField(value);
    const clonedCustomFields = cloneDeep(form.customFields || []);
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

  const updateFormHandler = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      gotoPassCodeContentStackScreen();
    }, 3000);
  };

  const title: Title = {
    PASSWORD: 'Edit Password',
    CREDITCARD: 'Edit Credit Card',
    PERSONALINFO: 'Edit Personal Info',
  };

  return (
    <ViewWrapper notchProtection>
      <ScrollView stickyHeaderIndices={[0]}>
        <View style={styles.header}>
          <View style={styles.navIcons}>
            <TouchableWithoutFeedback onPress={gotoPassCodeContentStackScreen}>
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

            <TouchableWithoutFeedback onPress={updateFormHandler}>
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
            value={form.title}
            onChangeText={value => formHandler('title', value)}
          />
          <HelperText
            style={styles.transpBgrView}
            type="info"
            padding="none"
            visible>
            * Required
          </HelperText>

          <PassCodeFields
            form={form}
            formHandler={formHandler}
            securityType={data.securityType}
          />

          <TranspBgrViewProps paddingVertical={5} />

          <Text style={styles.transpBgrView} variant="titleMedium">
            Custom Fields
          </Text>
          <TranspBgrViewProps paddingVertical={5} />
          {map(form.customFields, (customFields, index) => (
            <React.Fragment key={index}>
              <TranspBgrViewProps paddingVertical={5} />
              <TextInput
                label={customFields.name}
                value={customFields.value}
                onChangeText={value => {
                  const clonedCustomFields = cloneDeep(
                    form.customFields,
                  ) as CustomField[];
                  clonedCustomFields[index].value = value;
                  formHandler('customFields', clonedCustomFields);
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

          <TextInput
            style={styles.note}
            label="Notes"
            multiline
            value={form.note}
            onChangeText={value => formHandler('note', value)}
          />

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
                  label="Field Name"
                  value={newField}
                  onChangeText={dialogNewFieldOnChangeHandler}
                />
                <View style={styles.viewDivider} />
                <Text variant="titleSmall" style={styles.dialogError}>
                  {showDialogError ? 'Field Exists Already' : ''}
                </Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={onDismissDialog}>Cancel</Button>
                <Button
                  disabled={isEqual(newField, '') || showDialogError}
                  onPress={addFieldsHandler}>
                  Save
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
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
  PassCodeContent: { data: PassCodeProps };
};

interface PassCodeContentProps {
  navigation: NavigationProp<Nav>;
  route: RouteProp<RootStackParamList, 'PassCodeContent'>;
}

type Nav = {
  navigate: (
    value: string,
    data?: { data: PassCodeProps } | { data: PassCodeProps[] },
  ) => void;
  goBack: () => void;
};

export interface PassCodeProps {
  id: number;
  securityType: string;
  title: string;
  passData: PassData;
}

interface ExtendedPassData extends PassData {
  title?: string;
}

interface PassData {
  firstName?: string;
  lastName?: string;
  username: string;
  password?: string;
  phone?: string;
  email?: string;
  website?: string;
  note?: string;
  cardholder?: string;
  cardNumber?: string;
  expirationDate?: string;
  CVV?: string;
  zipCode?: string;
  customFields?: CustomField[];
}

interface CustomField {
  [key: string]: string;
}

type Title = {
  [key: string]: string;
};

export default PassCodeContentEditor;
