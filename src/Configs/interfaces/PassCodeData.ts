// interface PassCodeData {
//   title: string;
//   passData: Password | CreditCard | PersonalInfo | SecureNote;
// }

interface PasswordData {
  id: number;
  securityType: string;
  title: string;
  passData: Password;
}

interface CreditCardData {
  id: number;
  securityType: string;
  title: string;
  passData: CreditCard;
}

interface PersonalInfoData {
  id: number;
  securityType: string;
  title: string;
  passData: PersonalInfo;
}

interface SecureNoteData {
  id: number;
  securityType: string;
  title: string;
  passData: SecureNote;
}

// interface PassCodeType extends PassCodeData {
//   id: number;
//   securityType: string;
// }

interface Password {
  username: string;
  password: string;
  website: string;
  note: string;
  customFields: CustomField[];
}

interface CreditCard {
  cardholder: string;
  cardNumber: string;
  expirationDate: string;
  CVV: string;
  zipCode: string;
  website: string;
  note: string;
  customFields: CustomField[];
}

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  website: string;
  note: string;
  customFields: CustomField[];
}

interface SecureNote {
  note: string;
  website: string;
  customFields: CustomField[];
}

type CustomField = {
  [key in 'name' | 'value']: string;
};

// interface SecurityType {
//   [key: string]: Password | CreditCard | PersonalInfo | SecureNote;
// }

export type {
  // PassCodeType,
  // PassCodeData,
  // Password,
  // CreditCard,
  // PersonalInfo,
  // CustomField,
  // SecureNote,
  // SecurityType,
  PasswordData,
  CreditCardData,
  PersonalInfoData,
  SecureNoteData,
  CustomField,
};
