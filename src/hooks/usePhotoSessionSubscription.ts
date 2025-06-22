import { useEffect } from 'react';
import pb from "@/services/pocketbase";
import { type RecordSubscription } from 'pocketbase';

const useSessionSubscription = (sessionId: string, fetchPhotoSession: () => void) => {
  useEffect(() => {
    if (!sessionId) return;

    let unsubscribe: (() => void) | null = null;

    const setupSubscription = async () => {
      unsubscribe = await pb
        .collection('everspass_photos')
        .subscribe('*', (e: RecordSubscription) => {
          if (e.record.session_id !== sessionId) return;
          console.log('Event:', e.action, e.record);
          fetchPhotoSession();
        });
    };

    setupSubscription();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [sessionId, fetchPhotoSession]);
};

export default useSessionSubscription;
