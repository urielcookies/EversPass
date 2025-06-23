import { useEffect, useState } from 'react';
import pb from "@/services/pocketbase";
import { type RecordSubscription } from 'pocketbase';
import { isEqual } from 'lodash-es';

export interface NewlyCreated {
  collectionId: string;
  collectionName: string;
  created: string;
  id: string;
  image_url: string;
  likes: number;
  originalFilename: string;
  session_id: string;
  updated: string;
}

const useSessionSubscription = (sessionId: string, fetchPhotoSession: () => void) => {
  const [newlyCreated, setNewlyCreated] = useState<NewlyCreated | null>(null);
  useEffect(() => {
    if (!sessionId) return;

    let unsubscribe: (() => void) | null = null;

    const setupSubscription = async () => {
      unsubscribe = await pb
        .collection('everspass_photos')
        .subscribe('*', (e: RecordSubscription) => {
          if (e.record.session_id !== sessionId) return;
          console.log('Event:', e.action, e.record);
          if (isEqual(e.action, 'create') && e.record) {
            setNewlyCreated(e.record as NewlyCreated);
          }
          fetchPhotoSession();
        });
    };

    setupSubscription();

    return () => {
      if (unsubscribe) unsubscribe();
      setNewlyCreated(null);
    };
  }, [sessionId, fetchPhotoSession]);

  return { createdRecordsState: { newlyCreated, setNewlyCreated } }
};

export default useSessionSubscription;
