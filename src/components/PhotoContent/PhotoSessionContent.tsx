import { useEffect, useState } from 'react';
import { find, isEqual, isUndefined } from 'lodash-es';
import { navigate } from 'astro:transitions/client';
import { useStore } from '@nanostores/react';
import PhotoSession from '@/components/PhotoContent/PhotoSession';
import checkDeviceIdExists from '@/services/checkDeviceIdExists';
import checkPhotoSessionExists from '@/services/checkPhotoSessionExists';
import { $activePhotoSession, clearPhotos, fetchPhotoSession, fetchNextPageForActiveSession } from '@/stores/photoSessionStore';
import { $sessions, fetchSessions } from '@/stores/sessionsStore'; 
import useInfiniteScroll from '@/hooks/useInfiniteScroll';


const PhotoSessionContent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const url = new URL(window.location.href);
  const deviceIdParams = url.searchParams.get("eversPassDeviceId");
  const sessionIdParams = url.searchParams.get("sessionId");

  const { sessions, isLoading: sessionLoading } = useStore($sessions);
  const {
    photos,
    isLoading: photosLoading,
    isLoadingMore,
    error,
    page,
    totalPages,
    totalItems,
    sessionSize
  } = useStore($activePhotoSession);

  useEffect(() => {
    if (!deviceIdParams || !sessionIdParams) return
    (async () => {
      setIsLoading(true);
      const deviceIdExists = await checkDeviceIdExists(deviceIdParams);
      const photoSessionExists = await checkPhotoSessionExists(sessionIdParams);

      if (deviceIdExists?.exists) {
        await fetchSessions(deviceIdExists.device_id);
      }
      if (photoSessionExists?.exists) {
        await fetchPhotoSession(photoSessionExists.session_id, 1);
      }
      setIsLoading(false);
    })();

    return () => {
      clearPhotos();
    }
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

  const session = find(sessions, ({ id }) => isEqual(id, sessionIdParams));
  if (isUndefined(session)) {
    // url.search = '';
    // window.history.replaceState({}, '', url);
    // navigate('/sessions')
    return;
  }


  return (
    <PhotoSession
      session={session}
      photoSession={photos}
      isLoadingMore={isLoadingMore}
      totalPhotos={totalItems}
      sessionSize={sessionSize} />
  )
};

export default PhotoSessionContent;
