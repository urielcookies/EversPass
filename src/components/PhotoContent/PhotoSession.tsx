import {
  useState,
  useRef,
  useEffect,
} from 'react';
import {
  Camera,
  Clock,
  Loader2,
  Share,
  Upload,
} from 'lucide-react';
import { find, includes, isEmpty, isEqual } from 'lodash-es';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { type PhotoRecord } from '@/services/fetchPhotosForSession';
import { Button } from '@/components/ui/button';
import { Progress } from "@/components/ui/progress"
import { type SessionRecord } from '@/stores/sessionsStore';
import toggleLike from '@/services/togglePhotoLikes';
import UploadPhotosModal from './UploadPhotosModal';
import UploadPhotosMessage from './UploadPhotosMessage';
import PhotoGrid from './PhotoGrid';
import PhotoViewModal from './PhotoViewModal';
import PhotoViewTabs from './PhotoViewTabs';
import PhotoViewTabsFloating from './PhotoViewTabsFloating';
import SharePageModal from './SharePageModal';
import useSessionSubscription from '@/hooks/usePhotoSessionSubscription';

interface PhotoSessionContentProps {
  session: SessionRecord;
  photoSession: PhotoRecord[];
  isLoadingMore: boolean;
  totalPhotos: number;
  sessionSize: number;
}

const PhotoSessionContent = (props: PhotoSessionContentProps) => {
  const {session, photoSession, isLoadingMore, totalPhotos, sessionSize } = props;

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [oneView, setOneView] = useState(false);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const [modalViewOn, setModalViewOn] = useState(false);
  const [activePhoto, setActivePhoto] = useState<PhotoRecord | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  // Ref for the PhotoViewTabs component - still needed for IntersectionObserver
  const tabsRef = useRef<HTMLDivElement>(null);
  // State for the floating mobile toggle - this will be conditionally rendered
  const [showFloatingToggle, setShowFloatingToggle] = useState(false);

  const { createdRecordsState } = useSessionSubscription(session.id);

  const formatExpiration = (expiresAt: string) =>
    `Expires in ${formatDistanceToNow(parseISO(expiresAt))}`;

  const handleOpenUploadModal = () => setIsUploadModalOpen(true);
  const handleCloseUploadModal = () => setIsUploadModalOpen(false);

  // --- NEW HANDLERS FOR SHARE MODAL ---
  const handleOpenShareModal = () => setShowShareModal(true);
  const handleCloseShareModal = () => setShowShareModal(false);

  // Function to handle opening the photo view modal
  const handleOpenPhotoViewModal = (photo: PhotoRecord) => {
    setActivePhoto(photo);
    setModalViewOn(true); // Ensure modal view is on when this modal is open
  };

  // Function to handle closing the photo view modal
  const handleClosePhotoViewModal = () => {
    setActivePhoto(null);
    setModalViewOn(false); // Reset modal view on close
  };

  // Effect to observe the PhotoViewTabs component for the floating toggle
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // If the tabs element is NOT intersecting (i.e., user scrolled past it), show floating toggle.
        setShowFloatingToggle(!entry.isIntersecting);
      },
      {
        root: null, // Observe relative to the viewport
        // rootMargin: '0px 0px -100px 0px', // Adjust as needed
        rootMargin: '0px 0px -20px 0px',
        threshold: 0, // Trigger when 0% of the target is visible
      }
    );

    if (tabsRef.current) {
      observer.observe(tabsRef.current);
    }

    return () => {
      if (tabsRef.current) {
        observer.unobserve(tabsRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (activePhoto) {
      const newActivePhoto = find(photoSession, ({ id }) => isEqual(id, activePhoto.id));
      if (newActivePhoto) setActivePhoto(newActivePhoto)
    }
  }, [photoSession]);
  
  const handleToggleLike = async (photoId: string) => {
    const likes: Record<string, string[]> = JSON.parse(localStorage.getItem('likes') || '{}');
    const sessionId = session.id;

    if (!likes[sessionId]) likes[sessionId] = [];

    const likedPhotos = likes[sessionId];
    const alreadyLikedIndex = likedPhotos.indexOf(photoId);

    // Clone original state for potential rollback
    const originalLikes = [...likedPhotos];

    let action: 'like' | 'unlike';

    if (isEqual(alreadyLikedIndex, -1)) {
      likedPhotos.push(photoId);
      action = 'like';
    } else {
      likedPhotos.splice(alreadyLikedIndex, 1);
      action = 'unlike';
    }

    localStorage.setItem('likes', JSON.stringify(likes));

    try {
      await toggleLike(photoId, action);
    } catch (error) {
      // Rollback on failure
      likes[sessionId] = originalLikes;
      localStorage.setItem('likes', JSON.stringify(likes));
      console.error(`Failed to ${action} photo:`, error);
    }
  };

  const getIsLiked = (photoId: string) => {
    const likes: Record<string, string[]> = JSON.parse(localStorage.getItem('likes') || '{}');
    return includes(likes[session.id], photoId);
  }

  const formatBytesToGB = (bytes: number) => {
    if (bytes === 0) return '0.00 GB'
    const gigabytes = bytes / (1024 ** 3); // Convert bytes to gigabytes
    return gigabytes.toFixed(2); // Format to 2 decimal places
  };

  const storageLimitGB = 2;
  const sessionSizeInGB = sessionSize / (1024 ** 3);
  const remainingGB = (storageLimitGB - sessionSizeInGB).toFixed(2);
  const progressBarValue = storageLimitGB > 0
    ? Math.max(0, Math.min(100, (sessionSizeInGB / storageLimitGB) * 100))
    : 0;

  return (
    <main className="max-w-7xl mx-auto">
    <header className="flex flex-col gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">

      {/* Top Row: Session Info & Buttons (Desktop: side-by-side, Mobile: stacked) */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">

        {/* Left Column: Session Name & Details */}
        <div className="flex-grow text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {session?.name || 'Session'}
          </h1>

          {/* Details Section: Always stacked vertically now */}
          <div className="mt-2 flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-400">
            {/* Expiration (on top) */}
            <div className="flex items-center gap-1.5 justify-center sm:justify-normal">
              <Clock className="h-4 w-4" />
              <span>{formatExpiration(session?.expires_at)}</span>
            </div>
            {/* Photos & Storage (underneath) */}
            <div className="flex items-center gap-1.5 justify-center sm:justify-normal">
              <Camera className="h-4 w-4" />
              <span>
                {totalPhotos} Photos: {formatBytesToGB(sessionSize)} / {storageLimitGB} GB ({remainingGB} GB Remaining)
              </span>
            </div>
          </div>

          {/* Progress Bar (under details) */}
          <div className="mt-4 w-full sm:max-w-sm mx-auto sm:mx-0">
            <Progress value={progressBarValue} />
          </div>
        </div>

        {/* Right Column: Action Buttons (Now inline on all screen sizes, like original) */}
        <div className="flex items-center justify-center gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
          <Button onClick={handleOpenShareModal} variant="outline" className="flex-1 min-w-0">
            <Share className="mr-2 h-4 w-4" />
            <span className="truncate">Share</span>
          </Button>
          {progressBarValue < 100 && (
            <Button variant="primary-cta" onClick={handleOpenUploadModal} className="flex-1 min-w-0">
              <Upload className="mr-2 h-4 w-4" />
              <span className="truncate">Upload Photos</span>
            </Button>
          )}
        </div>
      </div>
    </header>

      <section className="mt-8">
        {!isEmpty(photoSession) ? (
          <>
            {/* Note: This is *not* the PhotoViewTabs component, but the separate floating one */}
            {showFloatingToggle && ( // This ensures it only shows when tabs are not in their initial view
              <PhotoViewTabsFloating viewState={{oneView, setOneView}} />
            )}

            {/* PhotoViewTabs - Now explicitly hidden on sm and larger screens */}
            <div className="sm:hidden"> {/* This div hides PhotoViewTabs on sm and up */}
                <PhotoViewTabs oneView={oneView} setOneView={setOneView} ref={tabsRef} />
            </div>


            <PhotoGrid
              photoSession={photoSession}
              oneView={oneView}
              selectedPhotoId={selectedPhotoId}
              setSelectedPhotoId={setSelectedPhotoId}
              setOneView={setOneView}
              handleOpenPhotoViewModal={handleOpenPhotoViewModal}
              handleToggleLike={handleToggleLike}
              getIsLiked={getIsLiked} />

            {isLoadingMore && (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500 dark:text-blue-400" />
                <p className="ml-4 text-lg text-gray-600 dark:text-gray-300">
                  Loading more photos...
                </p>
              </div>
            )}

            {!isLoadingMore && isEqual(photoSession.length, totalPhotos) && (
              <div className="py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                You've reached the end of the session photos.
              </div>
            )}
          </>
        ) : <UploadPhotosMessage handleOpenUploadModal={handleOpenUploadModal} /> }
      </section>

      <UploadPhotosModal
        isOpen={isUploadModalOpen}
        onClose={handleCloseUploadModal}
        session={session}
        createdRecordsState={createdRecordsState} />

      <PhotoViewModal
        isOpen={modalViewOn && activePhoto !== null}
        activePhoto={activePhoto as PhotoRecord}
        onClose={handleClosePhotoViewModal}
        handleToggleLike={handleToggleLike}
        getIsLiked={getIsLiked} />

      <SharePageModal
        isOpen={showShareModal}
        onClose={handleCloseShareModal} />
    </main>
  );
};

export default PhotoSessionContent;