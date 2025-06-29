import { useEffect, useState } from 'react';
import { isEqual } from 'lodash-es';
import { type RecordSubscription } from 'pocketbase';
import pb from "@/services/pocketbase";
import { fetchPhotoSession } from '@/stores/photoSessionStore';
// import { toast } from 'sonner';

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

declare global {
  interface Window {
    iziToast: any;
  }
}

const useSessionSubscription = (sessionId: string) => {
  const [newlyCreated, setNewlyCreated] = useState<NewlyCreated | null>(null);
  useEffect(() => {
    if (!sessionId) return;

    let unsubscribe: (() => void) | null = null;
    const position = window.innerWidth <= 768 ? 'topCenter' : 'topRight';

    const setupSubscription = async () => {
      unsubscribe = await pb
        .collection('everspass_photos')
        .subscribe('*', (e: RecordSubscription) => {
          if (e.record.session_id !== sessionId) return;

          if (isEqual(e.action, 'create') && e.record) {
            const record = e.record as NewlyCreated;
            // toast.success(`Uploaded ${record.originalFilename}`)
            // window.showToast(`Uploaded ${record.originalFilename}`, 'success')
            window.iziToast.success({
              title: 'Uploaded',
              message: `Uploaded ${record.originalFilename}`,
              position,
            });
            setNewlyCreated(record);
          }
          if (isEqual(e.action, 'delete') && e.record) {
            const record = e.record as NewlyCreated;
            // toast.success(`Photo deleted ${record.originalFilename}`);
            // window.showToast(`Photo deleted ${record.originalFilename}`, 'success');
            window.iziToast.success({
              title: 'Deleted',
              message: `Photo deleted ${record.originalFilename}`,
              position,
            });
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
