import {
  useState,
  useRef,
  useEffect,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import {
  Camera,
  Clock,
  Share,
  Upload,
  XCircle,
  Loader2,
  Grid3x3,
  Image,
  Download,
} from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { type PhotoRecord } from '@/services/fetchPhotosForSession';
import { Button } from '@/components/ui/button';
import { type SessionRecord } from '@/stores/sessionsStore';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import UploadPhotosModal from './UploadPhotosModal'; 
import UploadPhotosMessage from './UploadPhotosMessage';
import PhotoGrid from './PhotoGrid';
import PhotoViewModal from './PhotoViewModal';

interface PhotoSessionContentProps {
  session: SessionRecord;
  photoSession: PhotoRecord[];
  isLoadingMore: boolean;
  onPhotosUploaded: () => void;
}

interface FileWithPreview extends File {
  preview: string;
}

const PhotoSessionContent = ({
  session,
  photoSession,
  onPhotosUploaded,
}: PhotoSessionContentProps) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [oneView, setOneView] = useState(false);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const [modalViewOn, setModalViewOn] = useState(false);
  const [photoToViewUrl, setPhotoToViewUrl] = useState<string | null>(null);

  const photoRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const formatExpiration = (expiresAt: string) =>
    `Expires in ${formatDistanceToNow(parseISO(expiresAt))}`;


  const handleOpenUploadModal = () => setIsUploadModalOpen(true);
  const handleCloseUploadModal = () => setIsUploadModalOpen(false);

  useEffect(() => {
    if (oneView && selectedPhotoId) {
      const el = photoRefs.current[selectedPhotoId];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [oneView, selectedPhotoId]);

  // Function to handle opening the photo view modal
  const handleOpenPhotoViewModal = (photoUrl: string) => {
    setPhotoToViewUrl(photoUrl);
    setModalViewOn(true); // Ensure modal view is on when this modal is open
  };

  // Function to handle closing the photo view modal
  const handleClosePhotoViewModal = () => {
    setPhotoToViewUrl(null);
    setModalViewOn(false); // Reset modal view on close
  };

  return (
    <main className="max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {session?.name || 'Session'}
          </h1>
          <div className="mt-2 flex items-center gap-x-4 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <Camera className="h-4 w-4" />
              <span>{photoSession?.length || 0} Photos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{formatExpiration(session?.expires_at)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="primary-cta" onClick={handleOpenUploadModal}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Photos
          </Button>
        </div>
      </header>

      <section className="mt-8">
        {photoSession.length > 0 ? (
          <>
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:hidden z-40">
              <div className="flex items-center space-x-2 p-2 rounded-full shadow-lg bg-gradient-to-r from-sky-500 to-blue-600">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOneView(false)}
                  className={`rounded-full text-white ${
                    !oneView ? 'bg-white/20' : ''
                  }`}
                  aria-label="Grid View">
                  <Grid3x3 className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOneView(true)}
                  className={`rounded-full text-white ${
                    oneView ? 'bg-white/20' : ''
                  }`}
                  aria-label="Single View">
                  <Image className="h-6 w-6" />
                </Button>
              </div>
            </div>

            <PhotoGrid
              photoSession={photoSession}
              oneView={oneView}
              setOneView={setOneView}
              selectedPhotoId={selectedPhotoId}
              setSelectedPhotoId={setSelectedPhotoId}
              handleOpenPhotoViewModal={handleOpenPhotoViewModal}
            />
          </>
        ) : <UploadPhotosMessage handleOpenUploadModal={handleOpenUploadModal} /> }
      </section>

      <UploadPhotosModal
        isOpen={isUploadModalOpen}
        onClose={handleCloseUploadModal}
        session={session}
        onPhotosUploaded={onPhotosUploaded} />

      <PhotoViewModal
        isOpen={modalViewOn && photoToViewUrl !== null}
        photoUrl={photoToViewUrl}
        onClose={handleClosePhotoViewModal} />
    </main>
  );
};

export default PhotoSessionContent;