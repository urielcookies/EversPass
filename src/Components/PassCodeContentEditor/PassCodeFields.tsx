import { isEqual } from 'lodash';
import React, { FC } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native';
import { List, Divider, TextInput, Text, useTheme } from 'react-native-paper';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';

import TranspBgrViewProps from '../../RenderProps/TranspBgrView'


const PassCodeFields: FC<IPassCodeFields> = (props) => {
  const {
    form,
    formHandler,
    securityType
  } = props;

  const { colors } = useTheme();
  const styles = themeStyle(colors);

  return (
    <View>
      <TranspBgrViewProps paddingVertical={10} />
      <Text style={styles.transpBgrView} variant="titleMedium">Login Details</Text>
      <TranspBgrViewProps paddingVertical={5} />

      {isEqual(securityType, 'PASSWORD') && (
        <View>
          <TextInput
            label="Title"
            value={form.username}
            onChangeText={(value) => formHandler('title', value)} />
        </View>
      )}

      {/* {isEqual(data.securityType, 'CREDITCARD') && (
        <>
          <List.Item
            titleStyle={{ fontSize: 15, color: 'grey' }}
            descriptionStyle={{ fontSize: 15 }}
            title="Cardholder Name"
            description={data.passData.cardholder} />
          <Divider />
          <List.Item
            titleStyle={{ fontSize: 15, color: 'grey' }}
            descriptionStyle={{ fontSize: 15 }}
            title="Cardholder Number"
            description={data.passData.cardNumber} />
          <Divider />
          <List.Item
            titleStyle={{ fontSize: 15, color: 'grey' }}
            descriptionStyle={{ fontSize: 15 }}
            title="Expiration Date"
            description={data.passData.expirationDate} />
          <Divider />
          <List.Item
            titleStyle={{ fontSize: 15, color: 'grey' }}
            descriptionStyle={{ fontSize: 15 }}
            title="CVV"
            description={data.passData.CVV}
            right={props => <List.Icon {...props} icon="eye-outline" />} />
          <Divider />
          <List.Item
            titleStyle={{ fontSize: 15, color: 'grey' }}
            descriptionStyle={{ fontSize: 15 }}
            title="Zip Code"
            description={data.passData.zipCode} />
        </>
      )}

      {isEqual(data.securityType, 'PERSONALINFO') && (
        <>
          <List.Item
            titleStyle={{ fontSize: 15, color: 'grey' }}
            descriptionStyle={{ fontSize: 15 }}
            title="First Name"
            description={data.passData.firstName} />
          <Divider />
          <List.Item
            titleStyle={{ fontSize: 15, color: 'grey' }}
            descriptionStyle={{ fontSize: 15 }}
            title="Last Name"
            description={data.passData.lastName} />
          <Divider />
          <List.Item
            titleStyle={{ fontSize: 15, color: 'grey' }}
            descriptionStyle={{ fontSize: 15 }}
            title="Email"
            description={data.passData.email} />
          <Divider />
          <List.Item
            titleStyle={{ fontSize: 15, color: 'grey' }}
            descriptionStyle={{ fontSize: 15 }}
            title="Phone"
            description={data.passData.phone} />
        </>
      )} */}
    </View>
  )
}

const themeStyle = (colors: MD3Colors) => StyleSheet.create({
  divider: {
    paddingVertical: 10
  },
  minDivider: {
    paddingVertical: 5
  },
  transpBgrView: {
    backgroundColor: colors.background,
  }
});

interface IPassCodeFields {
  formHandler: (field: string, value: string) => void;
	form: {
    title: string;
    username: string;
  }
  securityType: string;
}

export default PassCodeFields;
