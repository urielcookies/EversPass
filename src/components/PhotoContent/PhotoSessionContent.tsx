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
import type { User } from '@/types/user';

interface PhotoSessionContentProps {
  user?: User | null;
  sessionId?: string;
}

const PhotoSessionContent = ({ user, sessionId }: PhotoSessionContentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<SessionRecord | null>(null);

  usePurgeExpiredLocalSessionData();

  const urlData = getDataParam('useURL');
  
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

      // For logged-in users: sessionId is provided as prop
      // For anonymous users: must have all URL params
      const effectiveSessionId = sessionId || sessionIdParams;
      const isLoggedInUser = !!user && !!sessionId;
      
      if (!effectiveSessionId) {
        console.log('No session ID available');
        return;
      }

      // Anonymous users need complete URL params
      if (!isLoggedInUser && (!sessionIdParams || !deviceIdParams || !roleIdParams)) {
        console.log('Anonymous user missing required URL params');
        return;
      }

      setIsLoading(true);

      try {
        const _session = await findSession(effectiveSessionId);
        const photoSessionExists = await checkPhotoSessionExists(effectiveSessionId);

        if (_session?.exists) {
          setSession(_session.record);

          // Only handle guest access logic for anonymous users
          // Note: If URL processor ran successfully, this might be redundant
          if (!isLoggedInUser) {
            const localStorageData = getDataParam('useLocalStorage');
            const localDeviceId = localStorageData?.deviceId;
            
            // Check if URL processor already saved this session
            const existingInvitedSession = localStorageData?.invitedSessions?.[effectiveSessionId];
            
            if (!existingInvitedSession) {
              // URL processor didn't run or failed, so handle it here as fallback
              const isGuestAccess = !isEqual(localDeviceId, deviceIdParams);

              if (isGuestAccess && roleIdParams) {
                const existingInvitedSessions = localStorageData?.invitedSessions || {};
                const updatedInvitedSessions = {
                  ...existingInvitedSessions,
                  [_session.record.id]: {
                    deviceId: _session.record.device_id,
                    sessionName: urlData?.sessionName || _session.record.name,
                    roleId: roleIdParams,
                    expire_at: urlData?.expire_at || _session?.record.expires_at,
                  },
                };

                updateLocalSessionData({ invitedSessions: updatedInvitedSessions });
                console.log('Fallback: Saved session data from component');
              }
            } else {
              console.log('URL processor already saved session data');
            }
          }
        } else {
          // Session doesn't exist
          window.showLimitedToast?.({
            title: 'Deleted',
            message: 'Session does not exist',
            position: window.innerWidth <= 768 ? 'topCenter' : 'topRight',
            color: 'red',
          });

          // Clean up invited sessions only for anonymous users
          if (!isLoggedInUser && sessionIdParams) {
            const localStorageData = getDataParam('useLocalStorage');
            const existingInvitedSessions = { ...localStorageData?.invitedSessions };
            delete existingInvitedSessions?.[sessionIdParams];
            
            updateLocalSessionData({
              invitedSessions: existingInvitedSessions,
            });
          }

          setTimeout(() => {
            if (user) navigate('/app');
            else navigate('/sessions');
          }, 1000);
          return;
        }

        if (photoSessionExists?.exists) {
          await fetchPhotoSession(photoSessionExists.session_id, 1);
        }
      } catch (error) {
        console.error('Error loading session:', error);
      } finally {
        setIsLoading(false);
      }
    })();

    return () => clearPhotos();
  }, [sessionId, user]); // Include both sessionId and user in dependencies

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

  // Determine effective role based on access type
  let effectiveRoleId: 'VIEWER' | 'EDITOR' | 'OWNER' | undefined;
  
  if (urlData?.roleId) {
    // Anyone accessing via URL data (invited sessions OR anonymous own sessions)
    effectiveRoleId = urlData.roleId;
  } else if (user) {
    // Logged-in user accessing their own session (no URL data)
    effectiveRoleId = 'OWNER';
  } else {
    // No valid role available
    effectiveRoleId = undefined;
  }
  
  if (!session || !effectiveRoleId) {
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
      roleId={effectiveRoleId}
      user={user || null}
    />
  );
};

export default PhotoSessionContent;
