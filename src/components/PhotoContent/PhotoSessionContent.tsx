import { useEffect, useState, useRef } from 'react';
import { navigate } from 'astro:transitions/client';
import { useStore } from '@nanostores/react';
import PhotoSession from '@/components/PhotoContent/PhotoSession';
import checkPhotoSessionExists from '@/services/checkPhotoSessionExists';
import { $activePhotoSession, clearPhotos, fetchPhotoSession, fetchNextPageForActiveSession } from '@/stores/photoSessionStore';
import { $sessions, fetchSessions, type SessionRecord } from '@/stores/sessionsStore'; 
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import usePurgeExpiredLocalSessionData from '@/hooks/usePurgeExpiredLocalSessionData';
import findSession from '@/services/findSession';
import { getDataParam, setDataParam, updateLocalSessionData } from '@/lib/encryptRole';
import { isEqual } from 'lodash-es';
import { APP_SITE_URL } from '@/lib/constants';
import type { User } from '@/types/user';


interface PhotoSessionContentProps {
  user: User | null;
  sessionId: string | null; // For logged-in users, pass sessionId directly as prop
}

const PhotoSessionContent = ({ user, sessionId }: PhotoSessionContentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<SessionRecord | null>(null);
  const [userRole, setUserRole] = useState<'VIEWER' | 'EDITOR' | 'OWNER'>('OWNER');

  // Only purge localStorage for anonymous users
  usePurgeExpiredLocalSessionData(!!user);

  // Get data differently based on user status
  const urlData = !user ? getDataParam('useURL') : null;
  const effectiveSessionId = user ? sessionId : urlData?.sessionId;
  const effectiveDeviceId = user ? user.id : urlData?.deviceId;
  const effectiveRoleId = user ? userRole : urlData?.roleId;

  const {
    photos,
    isLoading: photosLoading,
    isLoadingMore,
    error,
    page,
    totalPages,
    totalItems,
    sessionSize,
    totalDeviceSessionsSize,
  } = useStore($activePhotoSession);

  useEffect(() => {
    (async () => {
      if (!effectiveSessionId || !effectiveDeviceId || !effectiveRoleId) return;

      setIsLoading(true);

      const _session = await findSession(effectiveSessionId);
      const photoSessionExists = await checkPhotoSessionExists(effectiveSessionId);

      if (_session?.exists) {
        setSession(_session.record);

        // Only handle guest access logic for anonymous users
        if (!user) {
          const localStorageData = getDataParam('useLocalStorage');
          const localDeviceId = localStorageData?.deviceId;
          const isGuestAccess = !isEqual(localDeviceId, effectiveDeviceId);

          if (isGuestAccess) {
            const existingInvitedSessions = localStorageData?.invitedSessions || {};
            const updatedInvitedSessions = {
              ...existingInvitedSessions,
              [_session.record.id]: {
                deviceId: _session.record.device_id,
                sessionName: _session.record.name,
                roleId: effectiveRoleId,
                expire_at: _session?.record.expires_at,
              },
            };

            updateLocalSessionData({ invitedSessions: updatedInvitedSessions });
          }
        }
      } else {
        window.showLimitedToast?.({
          title: 'Deleted',
          message: 'Session does not exist',
          position: window.innerWidth <= 768 ? 'topCenter' : 'topRight',
          color: 'red',
        });

        // Only handle localStorage cleanup for anonymous users
        if (!user && effectiveSessionId) {
          const localStorageData = getDataParam('useLocalStorage');
          const existingInvitedSessions = { ...localStorageData?.invitedSessions };

          // Delete the session
          delete existingInvitedSessions?.[effectiveSessionId];

          // Let the cleaner handle empty objects
          updateLocalSessionData({
            invitedSessions: existingInvitedSessions,
          });
        }

        setTimeout(() => {
          if (user) window.location.href = `${APP_SITE_URL}/`;
          else navigate('/sessions');
        }, 1000);
        return;
      }

      if (photoSessionExists?.exists) {
        await fetchPhotoSession(photoSessionExists.session_id, 1);
      }
      setIsLoading(false);
    })();

    return () => clearPhotos();
  }, [effectiveSessionId, effectiveDeviceId, effectiveRoleId, user]);

  useInfiniteScroll(() => {
    if (!photosLoading && !isLoadingMore && page < totalPages && session) {
      fetchNextPageForActiveSession();
    }
  });

  if (error) {
    return (
      <div className="text-center py-20 bg-red-100 dark:bg-red-900/50 p-8 rounded-xl">
        <p className="text-red-700 dark:text-red-300 font-semibold">{error}</p>
      </div>
    );
  }

  if (!session || !effectiveRoleId) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-600 dark:text-slate-400">Loading Photo Session...</p>
      </div>
    );
  }

  return (
    <PhotoSession
      session={session}
      photoSession={photos}
      isLoadingMore={isLoadingMore}
      totalPhotos={totalItems}
      sessionSize={sessionSize}
      allSessionsSize={totalDeviceSessionsSize}
      roleId={effectiveRoleId}
      user={user}
    />
  );
};

export default PhotoSessionContent;
