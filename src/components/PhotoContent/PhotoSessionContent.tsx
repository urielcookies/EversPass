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

const PhotoSessionContent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<SessionRecord | null>(null);

  usePurgeExpiredLocalSessionData();

  const urlData = getDataParam('useURL');
  
  // const { sessions, isLoading: sessionLoading } = useStore($sessions);
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
      const sessionIdParams = urlData?.sessionId;
      const deviceIdParams = urlData?.deviceId;
      const roleIdParams = urlData?.roleId;
      if (!sessionIdParams || !deviceIdParams || !roleIdParams) return;

      setIsLoading(true);

      const _session = await findSession(sessionIdParams);
      const photoSessionExists = await checkPhotoSessionExists(sessionIdParams);

      if (_session?.exists) {
        setSession(_session.record);

        const localStorageData = getDataParam('useLocalStorage');
        const localDeviceId = localStorageData?.deviceId;
        const isGuestAccess = !isEqual(localDeviceId, deviceIdParams);

        if (isGuestAccess) {
          const existingInvitedSessions = localStorageData?.invitedSessions || {};
          const updatedInvitedSessions = {
            ...existingInvitedSessions,
            [_session.record.id]: {
              deviceId: _session.record.device_id,
              sessionName: _session.record.name,
              roleId: roleIdParams,
              expire_at: _session?.record.expires_at,
            },
          };

          // ❌ BAD: This would overwrite localStorage with only invitedSessions
          // setDataParam({
          //   invitedSessions: updatedInvitedSessions,
          // }, 'useLocalStorage');

          // // WORKS BUT OLD WAY
          // setDataParam({
          //   ...localStorageData,
          //   invitedSessions: updatedInvitedSessions,
          // }, 'useLocalStorage');

          updateLocalSessionData({ invitedSessions: updatedInvitedSessions });
        }
      }
      else {
        window.showLimitedToast?.({
          title: 'Deleted',
          message: 'Session does not exist',
          position: window.innerWidth <= 768 ? 'topCenter' : 'topRight',
          color: 'red',
        });

        const sessionIdParams = urlData?.sessionId;
        if (!sessionIdParams) return;

        const localStorageData = getDataParam('useLocalStorage');
        const existingInvitedSessions = { ...localStorageData?.invitedSessions };

        // Delete the session
        delete existingInvitedSessions?.[sessionIdParams];

        // Let the cleaner handle empty objects
        updateLocalSessionData({
          invitedSessions: existingInvitedSessions,
        });

        setTimeout(() => {
          navigate('/sessions');
        }, 1000);
      }

      if (photoSessionExists?.exists) {
        await fetchPhotoSession(photoSessionExists.session_id, 1);
      }
      setIsLoading(false);
    })();

    return () => clearPhotos();
  }, []);

  useInfiniteScroll(() => {
    if (!photosLoading && !isLoadingMore && page < totalPages && session) {
      fetchNextPageForActiveSession();
    }
  });

  // if (isLoading || sessionLoading || photosLoading) {
  //   return (
  //     <div className="text-center py-20">
  //       <p className="text-slate-600 dark:text-slate-400">Loading Photo Session...</p>
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <div className="text-center py-20 bg-red-100 dark:bg-red-900/50 p-8 rounded-xl">
        <p className="text-red-700 dark:text-red-300 font-semibold">{error}</p>
      </div>
    );
  }

  if (!session || !urlData?.roleId) {
    return null;
  }

  return (
    <PhotoSession
      session={session}
      photoSession={photos}
      isLoadingMore={isLoadingMore}
      totalPhotos={totalItems}
      sessionSize={sessionSize}
      allSessionsSize={totalDeviceSessionsSize}
      roleId={urlData.roleId} />
  );
};

export default PhotoSessionContent;
