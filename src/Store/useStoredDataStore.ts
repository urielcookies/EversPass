import { create } from 'zustand';
import { PassCodeType } from '../Configs/interfaces/PassCodeData';
import { getLocalData, storeLocalData } from '../Configs/utils/storeData';
import fakeData from '../Configs/constants/fakeData';
import { cloneDeep, findIndex, isEqual, maxBy } from 'lodash';

interface StoredDataState {
  storedSecrets: PassCodeType[];
  addStoredSecret: (value: PassCodeType) => void;
  updateStoredSecret: (value: PassCodeType) => void;
  setClearSecrets: () => void;
  setMockSecrets: () => void;
  setStoredSecrets: () => void;
}

const useStoredDataStore = create<StoredDataState>((set) => ({
  storedSecrets: [],
  addStoredSecret: (value: PassCodeType) => {
    set((state) => {
      const maxSecret = maxBy(state.storedSecrets, 'id');
      const nextId = maxSecret ? maxSecret.id + 1 : 1;
      const newSecret = { ...value, id: nextId };
      const updatedSecrets = cloneDeep(state.storedSecrets);

      updatedSecrets.push(newSecret);
      storeLocalData('stored-secrets', updatedSecrets);

      return { storedSecrets: updatedSecrets };
    });
  },
  updateStoredSecret: (value: PassCodeType) => {
    set((state) => {
      const index = findIndex(state.storedSecrets, { id: value.id });
      if (!isEqual(index, -1)) {
        const updatedSecrets = cloneDeep(state.storedSecrets);
        updatedSecrets[index] = { ...updatedSecrets[index], ...value };
        storeLocalData('stored-secrets', updatedSecrets);
        return { storedSecrets: updatedSecrets };
      }
      return state;
    });
  },
  setClearSecrets: () => {
    storeLocalData('stored-secrets', []);
    set({ storedSecrets: [] });
  },
  setMockSecrets: () => {
    storeLocalData('stored-secrets', fakeData);
    set({ storedSecrets: fakeData });
  },
  setStoredSecrets: async () => {
    const data: PassCodeType[] = await getLocalData('stored-secrets', []);
    set({ storedSecrets: data });
  },
}));

export default useStoredDataStore;
