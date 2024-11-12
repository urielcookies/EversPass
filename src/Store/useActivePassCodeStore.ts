import { create } from 'zustand';
import {
  CreditCardData,
  PasswordData,
  PersonalInfoData,
  SecureNoteData,
} from '../Configs/interfaces/PassCodeData';

type PassCodeType = PasswordData | CreditCardData | PersonalInfoData | SecureNoteData;

interface ActivePassCodeState {
  activePassCode: PassCodeType;
  setActivePassCode: (value: PassCodeType) => void;
  resetActivePassCode: () => void;
}

const useActivePassCodeStore = create<ActivePassCodeState>((set) => ({
  activePassCode: {
    id: 0,
    title: '',
    securityType: '',
    passData: {
      website: '',
      note: '',
      customFields: [],
    },
  },
  setActivePassCode: (value: PassCodeType) => set({ activePassCode: value }),
  resetActivePassCode: () => set({
    activePassCode: {
      id: 0,
      title: '',
      securityType: '',
      passData: {
        website: '',
        note: '',
        customFields: [],
      },
    },
  }),
}));

export default useActivePassCodeStore;
