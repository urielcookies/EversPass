// Create a new file: /src/scripts/urlProcessor.ts (note the .ts extension)
import { getDataParam, updateLocalSessionData } from '@/lib/encryptRole';

// TypeScript declaration for the global function
declare global {
  interface Window {
    processURLDataAndSave?: () => boolean;
  }
}

export function processURLDataAndSave() {
  try {
    const urlData = getDataParam('useURL');
    
    if (!urlData?.sessionId || !urlData?.deviceId || !urlData?.roleId || !urlData?.sessionName || !urlData?.expire_at) {
      return false;
    }

    console.log('Processing URL data for session:', urlData.sessionId);

    const localStorageData = getDataParam('useLocalStorage') || {};
    const existingInvitedSessions = localStorageData?.invitedSessions || {};
    
    const updatedInvitedSessions = {
      ...existingInvitedSessions,
      [urlData.sessionId]: {
        deviceId: urlData.deviceId,
        sessionName: urlData.sessionName,
        roleId: urlData.roleId,
        expire_at: urlData.expire_at,
      },
    };

    updateLocalSessionData({ invitedSessions: updatedInvitedSessions });
    console.log('Successfully saved URL session data to localStorage');
    return true;
    
  } catch (error) {
    console.error('Failed to process URL data:', error);
    return false;
  }
}

// Make it globally available
if (typeof window !== 'undefined') {
  window.processURLDataAndSave = processURLDataAndSave;
}