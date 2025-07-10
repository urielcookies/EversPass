import { useEffect } from 'react';
import { getDataParam, updateLocalSessionData } from '@/lib/encryptRole';
import { isAfter, parseISO } from 'date-fns';

const usePurgeExpiredLocalSessionData = () => {
  useEffect(() => {
    const localStorageData = getDataParam('useLocalStorage');
    if (!localStorageData) return;

    const now = new Date();
    let hasChanges = false;
    const updated = { ...localStorageData };

    // Clean up invitedSessions
    if (updated.invitedSessions) {
      const filtered = Object.fromEntries(
        Object.entries(updated.invitedSessions).filter(([_, session]) => {
          if (!session.expire_at) return true;
          return isAfter(parseISO(session.expire_at), now);
        })
      );

      if (Object.keys(filtered).length === 0) {
        delete updated.invitedSessions;
        hasChanges = true;
      } else if (JSON.stringify(filtered) !== JSON.stringify(updated.invitedSessions)) {
        updated.invitedSessions = filtered;
        hasChanges = true;
      }
    }

    // Clean up likedPhotos
    if (updated.likedPhotos) {
      const filtered = Object.fromEntries(
        Object.entries(updated.likedPhotos).filter(([_, photoData]) => {
          const expired = photoData.expire_at && !isAfter(parseISO(photoData.expire_at), now);
          const empty = photoData.likes.length === 0;
          return !expired && !empty;
        })
      );

      if (Object.keys(filtered).length === 0) {
        delete updated.likedPhotos;
        hasChanges = true;
      } else if (JSON.stringify(filtered) !== JSON.stringify(updated.likedPhotos)) {
        updated.likedPhotos = filtered;
        hasChanges = true;
      }
    }

    // Only update if there were actual changes
    if (hasChanges) {
      updateLocalSessionData({
        ...(updated.invitedSessions && { invitedSessions: updated.invitedSessions }),
        ...(updated.likedPhotos && { likedPhotos: updated.likedPhotos }),
      });
    }
  }, []);
};

export default usePurgeExpiredLocalSessionData;
