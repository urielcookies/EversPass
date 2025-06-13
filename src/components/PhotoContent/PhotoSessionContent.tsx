import { useEffect, useState } from 'react';
import PhotoSession from '@/components/PhotoContent/PhotoSession';
import checkDeviceIdExists from '@/services/checkDeviceIdExists';
import checkPhotoSessionExists from '@/services/checkPhotoSessionExists';
import { $activePhotoSession, clearPhotos, fetchPhotoSession } from '@/stores/photoSessionStore';
import { $sessions, fetchSessions } from '@/stores/sessionsStore'; 
import { useStore } from '@nanostores/react';
import { find, isEqual } from 'lodash-es';


const PhotoSessionContent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const url = new URL(window.location.href);
  const deviceIdParams = url.searchParams.get("eversPassDeviceId");
  const sessionIdParams = url.searchParams.get("sessionId");

  const { sessions } = useStore($sessions);
  const { photos, isLoadingMore, error, page, totalPages } = useStore($activePhotoSession);

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

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-600 dark:text-slate-400">Loading Photo Session...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-red-100 dark:bg-red-900/50 p-8 rounded-xl">
        <p className="text-red-700 dark:text-red-300 font-semibold">{error}</p>
      </div>
    );
  }

  const session = find(sessions, ({ id }) => isEqual(id, sessionIdParams));
  return session && <PhotoSession session={session} photoSession={photos} isLoadingMore={isLoadingMore} />
};

export default PhotoSessionContent;
