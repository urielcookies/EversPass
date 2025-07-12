import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.PUBLIC_SECRET_OBFUSCATION_KEY;

export function encrypString(value: string): string {
  return CryptoJS.AES.encrypt(value, SECRET_KEY).toString();
}

export function decryptString(encrypted: string): string | null {
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    console.error('Failed to decrypt string:', err);
    return null;
  }
}

export type StorageMode = 'useURL' | 'useLocalStorage';

interface EncryptedParamInput {
  key: string;
  value?: string;
  mode?: StorageMode;
}

// Define the two separate interfaces for your URL and localStorage data
interface SharedDataURL {
  deviceId: string;
  sessionId?: string;
  roleId?: 'VIEWER' | 'EDITOR' | 'OWNER';
}

interface InvitedSession {
  deviceId: string;
  sessionName: string;
  roleId: 'VIEWER' | 'EDITOR' | 'OWNER';
  expire_at: string;
}

interface LikedPhotos {
  expire_at: string;
  likes: string[];
}

interface SharedDataLocal {
  deviceId?: string;
  hasCreatedSessionBefore?: boolean;
  invitedSessions?: Record<string, InvitedSession>;
  likedPhotos?: Record<string, LikedPhotos>;
}

export const setEncryptedParam = ({ key, value = '', mode }: EncryptedParamInput): string | null => {
  if (!value) return null;
  const encryptedValue = encodeURIComponent(encrypString(value));

  if (mode === 'useURL') {
    const url = new URL(window.location.href);
    url.searchParams.set(key, encryptedValue);
    window.history.replaceState({}, '', url.toString());
  }

  if (mode === 'useLocalStorage') {
    localStorage.setItem(key, encryptedValue);
  }

  // If mode is undefined, just return the encrypted value without storing
  return encryptedValue;
};

export const getDecryptedParam = ({ key, mode }: { key: string; mode: StorageMode }): string | null => {
  let encryptedValue: string | null = null;

  if (mode === 'useURL') {
    encryptedValue = new URLSearchParams(window.location.search).get(key);
  } else if (mode === 'useLocalStorage') {
    encryptedValue = localStorage.getItem(key);
  }

  return encryptedValue ? decryptString(decodeURIComponent(encryptedValue)) : null;
};

/**
 * Set 'data' param for either URL or localStorage, with typed data.
 */
export function setDataParam(data: SharedDataURL, mode?: 'useURL'): string | null;
export function setDataParam(data: SharedDataLocal, mode?: 'useLocalStorage'): string | null;
export function setDataParam(data: Record<string, any>, mode?: StorageMode): string | null {
  const jsonString = JSON.stringify(data);
  return setEncryptedParam({ key: 'data', value: jsonString, mode });
}

/**
 * Get and parse decrypted 'data' param from URL or localStorage.
 */
export function getDataParam(mode: 'useURL'): SharedDataURL | null;
export function getDataParam(mode: 'useLocalStorage'): SharedDataLocal | null;
export function getDataParam(mode: StorageMode): SharedDataURL | SharedDataLocal | null {
  const decrypted = getDecryptedParam({ key: 'data', mode });
  if (!decrypted) return null;

  try {
    return JSON.parse(decrypted);
  } catch (err) {
    console.error('Failed to parse decrypted data:', err);
    return null;
  }
}
export function updateLocalSessionData(update: Partial<SharedDataLocal>) {
  const localStorageData: SharedDataLocal = getDataParam('useLocalStorage') || {};

  const merged = { ...localStorageData, ...update };

  const deepClean = (obj: any): any => {
    return Object.fromEntries(
      Object.entries(obj)
        .map(([key, value]) => {
          if (value === undefined) return null;

          if (Array.isArray(value)) {
            return value.length === 0 ? null : [key, value];
          }

          if (typeof value === 'object' && value !== null) {
            const cleanedNested = deepClean(value);
            return Object.keys(cleanedNested).length === 0 ? null : [key, cleanedNested];
          }

          return [key, value];
        })
        .filter(Boolean) as [string, any][]
    );
  };

  const cleaned = deepClean(merged) as SharedDataLocal;

  setDataParam(cleaned, 'useLocalStorage');
}