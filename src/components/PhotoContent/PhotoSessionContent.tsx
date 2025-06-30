import { useEffect, useState, useRef } from 'react';
import { navigate } from 'astro:transitions/client';
import { useStore } from '@nanostores/react';
import PhotoSession from '@/components/PhotoContent/PhotoSession';
import checkPhotoSessionExists from '@/services/checkPhotoSessionExists';
import { $activePhotoSession, clearPhotos, fetchPhotoSession, fetchNextPageForActiveSession } from '@/stores/photoSessionStore';
import { $sessions, fetchSessions, type SessionRecord } from '@/stores/sessionsStore'; 
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import findSession from '@/services/findSession';
import { getDecryptedParam } from '@/lib/encryptRole';

interface RetrievedURLData {
  deviceId: string;
  sessionId: string;
  roleId: 'VIEWER' | 'EDITOR' | 'OWNER';
}

const PhotoSessionContent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<SessionRecord | null>(null);

  const decryptedJsonString = getDecryptedParam({ key: 'data', options: { useUrl: true } });
  const urlParams = useRef<RetrievedURLData | null>(
    decryptedJsonString ? JSON.parse(decryptedJsonString) : null
  );
  
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
      const sessionIdParams = urlParams.current?.sessionId;
      if (!sessionIdParams) return;

      setIsLoading(true);

      const _session = await findSession(sessionIdParams);
      const photoSessionExists = await checkPhotoSessionExists(sessionIdParams);

      if (_session?.exists) setSession(_session.record);
      else navigate('/sessions');

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

  if (!session || !urlParams.current?.roleId) {
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
      roleId={urlParams.current.roleId} />
  );
};

export default PhotoSessionContent;
