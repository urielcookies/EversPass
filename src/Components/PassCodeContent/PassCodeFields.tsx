import { isEqual } from 'lodash';
import React, { FC } from 'react'
import { ScrollView, View } from 'react-native';
import { List, Divider } from 'react-native-paper';

import { PassCodeProps } from './PassCodeContent';


const PassCodeFields: FC<IPassCodeFields> = ({ data }) => {
  return (
    <>
      {isEqual(data.securityType, 'PASSWORD') && (
        <>
          <List.Item
            titleStyle={{ fontSize: 15, color: 'grey' }}
            descriptionStyle={{ fontSize: 15 }}
            title="Email or Username"
            description={data.passData.username} />
          <Divider />
          <List.Item
            titleStyle={{ fontSize: 15, color: 'grey' }}
            descriptionStyle={{ fontSize: 15 }}
            title="Password"
            // description={data.passData.password}
            description="******"
            right={props => <List.Icon {...props} icon="eye-outline" />} />
          <Divider />
          <List.Item
            titleStyle={{ fontSize: 15, color: 'grey' }}
            descriptionStyle={{ fontSize: 15, color: "green" }}
            title="Password Scurity"
            description="Strong Password" />
        </>
      )}

      {isEqual(data.securityType, 'CREDITCARD') && (
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

      {isEqual(data.securityType, 'SECURENOTE') && (
        <View>
          <ScrollView>       
            <List.Item
              titleStyle={{ fontSize: 15, color: 'grey' }}
              descriptionStyle={{ fontSize: 15 }}
              descriptionNumberOfLines={10000}
              title="Note"
              description={data.passData.note} />   
          </ScrollView>
        </View>
      )}
    </>
  )
}

interface IPassCodeFields {
	data: PassCodeProps;
}

export default PassCodeFields;
