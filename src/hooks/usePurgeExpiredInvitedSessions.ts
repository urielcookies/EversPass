import { useEffect } from 'react';
import { getDataParam, setDataParam } from '@/lib/encryptRole';
import { isAfter, parseISO } from 'date-fns';

const usePurgeExpiredInvitedSessions = () => {
  useEffect(() => {
    const localStorageData = getDataParam('useLocalStorage');
    if (!localStorageData?.invitedSessions) return;

    const now = new Date();
    const updatedInvitedSessions = Object.fromEntries(
      Object.entries(localStorageData.invitedSessions).filter(([_, session]) => {
        if (!session.expire_at) return true;
        const expiresAt = parseISO(session.expire_at);
        return isAfter(expiresAt, now);
      })
    );

    // If anything was removed, update localStorage
    if (Object.keys(updatedInvitedSessions).length !== Object.keys(localStorageData.invitedSessions).length) {
      setDataParam({
        ...localStorageData,
        invitedSessions: updatedInvitedSessions,
      }, 'useLocalStorage');
    }
  }, []);
};

export default usePurgeExpiredInvitedSessions;