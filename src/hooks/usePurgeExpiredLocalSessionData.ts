import { useEffect } from 'react';
import { getDataParam, updateLocalSessionData } from '@/lib/encryptRole';
import { isAfter, parseISO } from 'date-fns';

const usePurgeExpiredLocalSessionData = () => {
  useEffect(() => {
    const localStorageData = getDataParam('useLocalStorage');
    if (!localStorageData) return;

    const now = new Date();

    const updatedInvitedSessions = localStorageData.invitedSessions
      ? Object.fromEntries(
          Object.entries(localStorageData.invitedSessions).filter(([_, session]) => {
            return !session.expire_at || isAfter(parseISO(session.expire_at), now);
          })
        )
      : undefined;

    const updatedLikedPhotos = localStorageData.likedPhotos
      ? Object.fromEntries(
          Object.entries(localStorageData.likedPhotos).filter(([_, photoData]) => {
            const expired = photoData.expire_at && !isAfter(parseISO(photoData.expire_at), now);
            const empty = photoData.likes.length === 0;
            return !expired && !empty;
          })
        )
      : undefined;

    updateLocalSessionData({
      invitedSessions: updatedInvitedSessions,
      likedPhotos: updatedLikedPhotos,
    });
  }, []);
};

export default usePurgeExpiredLocalSessionData;
