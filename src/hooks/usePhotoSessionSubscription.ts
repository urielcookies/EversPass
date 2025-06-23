import { useEffect, useState } from 'react';
import { isEqual } from 'lodash-es';
import { toast } from 'sonner';
import { type RecordSubscription } from 'pocketbase';
import pb from "@/services/pocketbase";
import { fetchPhotoSession } from '@/stores/photoSessionStore';

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

const useSessionSubscription = (sessionId: string) => {
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
            const record = e.record as NewlyCreated;
            toast.success(`Uploaded ${record.originalFilename}`)
            setNewlyCreated(record);
          }
          fetchPhotoSession(sessionId, 1);
        });
    };

    setupSubscription();

    return () => {
      if (unsubscribe) unsubscribe();
      setNewlyCreated(null);
    };
  }, []);

  return { createdRecordsState: { newlyCreated, setNewlyCreated } }
};

export default useSessionSubscription;
