import { isEqual } from 'lodash';
import React, { FC, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { List, Divider } from 'react-native-paper';

import { PassCodeProps } from './PassCodeContent';

const PassCodeFields: FC<IPassCodeFields> = ({ data }) => {
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const togglePasswordVisibility = () =>
    setPasswordVisibility(!passwordVisibility);

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

  const style = {
    STRONG: {
      color: 'green',
      description: 'Strong Password',
    },
    MEDIUM: {
      color: '#FFA500',
      description: 'Medium Password',
    },
    WEAK: {
      color: 'red',
      description: 'Weak Password',
    },
  };

  const passwordStyleObj =
    style[checkPasswordStrength(data.passData.password || '')];

  return (
    <>
      {isEqual(data.securityType, 'PASSWORD') && (
        <>
          <List.Item
            titleStyle={{ fontSize: 15, color: 'grey' }}
            descriptionStyle={{ fontSize: 15 }}
            title="Email or Username"
            description={data.passData.username}
          />
          <Divider />
          <List.Item
            titleStyle={{ fontSize: 15, color: 'grey' }}
            descriptionStyle={{ fontSize: 15 }}
            title="Password"
            description={
              !passwordVisibility ? '******' : data.passData.password
            }
            onPress={togglePasswordVisibility}
            right={props => (
              <List.Icon
                {...props}
                icon={passwordVisibility ? 'eye' : 'eye-off'}
              />
            )}
          />
          <Divider />
          <List.Item
            titleStyle={{ fontSize: 15, color: 'grey' }}
            descriptionStyle={{ fontSize: 15, color: passwordStyleObj.color }}
            title="Password Security"
            description={passwordStyleObj.description}
          />
        </>
      )}

      {isEqual(data.securityType, 'CREDITCARD') && (
        <>
          <List.Item
            titleStyle={{ fontSize: 15, color: 'grey' }}
            descriptionStyle={{ fontSize: 15 }}
            title="Cardholder Name"
            description={data.passData.cardholder}
          />
          <Divider />
          <List.Item
            titleStyle={{ fontSize: 15, color: 'grey' }}
            descriptionStyle={{ fontSize: 15 }}
            title="Cardh Number"
            description={data.passData.cardNumber}
          />
          <Divider />
          <List.Item
            titleStyle={{ fontSize: 15, color: 'grey' }}
            descriptionStyle={{ fontSize: 15 }}
            title="Expiration Date"
            description={data.passData.expirationDate}
          />
          <Divider />
          <List.Item
            titleStyle={{ fontSize: 15, color: 'grey' }}
            descriptionStyle={{ fontSize: 15 }}
            title="CVV"
            description={!passwordVisibility ? '***' : data.passData.CVV}
            onPress={togglePasswordVisibility}
            right={props => (
              <List.Icon
                {...props}
                icon={passwordVisibility ? 'eye' : 'eye-off'}
              />
            )}
          />
          <Divider />
          <List.Item
            titleStyle={{ fontSize: 15, color: 'grey' }}
            descriptionStyle={{ fontSize: 15 }}
            title="Zip Code"
            description={data.passData.zipCode}
          />
        </>
      )}

      {isEqual(data.securityType, 'PERSONALINFO') && (
        <>
          <List.Item
            titleStyle={{ fontSize: 15, color: 'grey' }}
            descriptionStyle={{ fontSize: 15 }}
            title="First Name"
            description={data.passData.firstName}
          />
          <Divider />
          <List.Item
            titleStyle={{ fontSize: 15, color: 'grey' }}
            descriptionStyle={{ fontSize: 15 }}
            title="Last Name"
            description={data.passData.lastName}
          />
          <Divider />
          <List.Item
            titleStyle={{ fontSize: 15, color: 'grey' }}
            descriptionStyle={{ fontSize: 15 }}
            title="Email"
            description={data.passData.email}
          />
          <Divider />
          <List.Item
            titleStyle={{ fontSize: 15, color: 'grey' }}
            descriptionStyle={{ fontSize: 15 }}
            title="Phone"
            description={data.passData.phone}
          />
        </>
      )}
    </>
  );
};

interface IPassCodeFields {
  data: PassCodeProps;
}

export default PassCodeFields;
