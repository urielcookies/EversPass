import React, { FC } from 'react'
import { Text } from 'react-native-paper'
import { View } from 'react-native'
import { NavigationProp, RouteProp } from '@react-navigation/native';

const PassCodeContentEditor: FC<PassCodeContentProps> = (props) => {
  const { data } = props.route.params;
  console.log('data-->>', data);
  return (
    <View>
      <Text>{data.title}</Text>
    </View>
  )
}

type RootStackParamList = {
  // Home: undefined;
  PassCodeContent: { data: PassCodeProps };
}

interface PassCodeContentProps {
	navigation: NavigationProp<Nav>;
	route: RouteProp<RootStackParamList, 'PassCodeContent'>;
}

type Nav = {
  navigate: (value: string) => void;
}

export interface PassCodeProps {
  id: number;
  securityType: string;
  title: string;
  passData: PassData;
}

interface PassData {
  firstName?: string;
  lastName?: string;
  username?: string;
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

export default PassCodeContentEditor