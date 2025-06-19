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

            <div
              id="photo-grid"
              className={
                oneView
                  ? 'grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-2 sm:gap-4'
                  : 'grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4'
              }>
              {photoSession.map(photo => (
                <div
                  key={photo.id}
                  ref={el => (photoRefs.current[photo.id] = el)}
                  onClick={() => {
                    setSelectedPhotoId(photo.id);
                    if (window.innerWidth <= 768) {
                      setOneView(true);
                    } else {
                      handleOpenPhotoViewModal(photo.image_url);
                    }
                  }}
                  className="relative aspect-square bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden flex flex-col cursor-pointer">
                  {oneView && (
                    <div className="absolute top-0 left-0 w-full p-3 bg-gradient-to-b from-black/60 to-transparent text-white text-sm font-semibold truncate z-10">
                      {photo.originalFilename || 'Unnamed Photo'}
                    </div>
                  )}

                  <img
                    src={photo.image_url}
                    alt={photo.originalFilename || 'Session photo'}
                    className={
                      oneView
                        ? 'w-full h-auto object-contain p-2 flex-grow'
                        : 'w-full h-full object-cover'
                    }
                  />
                  {oneView && (
                    <div className="absolute bottom-2 right-2 z-10">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={e => {
                          e.stopPropagation();
                          window.open(photo.image_url, '_blank');
                        }}
                        className="bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-full shadow-md">
                        <Download className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div
            id="empty-state"
            className="text-center py-20 px-4 rounded-xl bg-slate-100 dark:bg-slate-900/50">
            <div className="flex-shrink-0 mx-auto h-12 w-12 rounded-full bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center">
              <Camera className="h-6 w-6 text-sky-600 dark:text-sky-400" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">
              Your Session is Ready
            </h3>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Upload the first photos to get started.
            </p>
            <div className="mt-6">
              <Button
                variant="primary-cta"
                size="lg"
                onClick={handleOpenUploadModal}>
                Upload Your First Photo
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Upload Modal */}
      <UploadPhotosModal
        isOpen={isUploadModalOpen}
        onClose={handleCloseUploadModal}
        session={session}
        onPhotosUploaded={onPhotosUploaded} />

      {/* Photo View Modal */}
      <Dialog open={modalViewOn && photoToViewUrl !== null}>
        <DialogContent
          className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] h-[90vh] flex flex-col"
          onInteractOutside={handleClosePhotoViewModal}
          hideClose>
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="sr-only">View Photo</DialogTitle>
            <DialogDescription className="sr-only">
              Large view of the selected photo.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-grow flex items-center justify-center p-2 overflow-hidden">
            {photoToViewUrl && (
              <img
                src={photoToViewUrl}
                alt="Enlarged session photo"
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>
          <DialogFooter className="flex-shrink-0 flex justify-between items-center w-full mt-4">
            <Button
              variant="outline"
              onClick={handleClosePhotoViewModal}
              className="px-4 py-2">
              <XCircle className="mr-2 h-4 w-4" /> Close
            </Button>
            {photoToViewUrl && (
              <Button
                variant="primary-cta"
                onClick={() => window.open(photoToViewUrl, '_blank')}
                className="px-4 py-2">
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default PhotoSessionContent;