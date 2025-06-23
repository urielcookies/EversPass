import {
  useState,
  useRef,
  useEffect,
} from 'react';
import {
  Camera,
  Clock,
  Share,
  Upload,
} from 'lucide-react';
import { find, includes, isEmpty, isEqual } from 'lodash-es';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { type PhotoRecord } from '@/services/fetchPhotosForSession';
import { Button } from '@/components/ui/button';
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
  fetchPhotoSession: () => void;
}

const PhotoSessionContent = (props: PhotoSessionContentProps) => {
  const {session, photoSession, fetchPhotoSession } = props;

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

  const { createdRecordsState } = useSessionSubscription(session.id, fetchPhotoSession);

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

  return (
    <main className="max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {session?.name || 'Session'}
          </h1>
          <div className="mt-2 flex items-center gap-x-4 text-sm text-slate-600 dark:text-slate-400 justify-center sm:justify-normal">
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

        <div className="flex items-center justify-center gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
          <Button onClick={handleOpenShareModal} variant="outline" className="flex-1 min-w-0">
            <Share className="mr-2 h-4 w-4" />
            <span className="truncate">Share</span>
          </Button>
          <Button variant="primary-cta" onClick={handleOpenUploadModal} className="flex-1 min-w-0">
            <Upload className="mr-2 h-4 w-4" />
            <span className="truncate">Upload Photos</span>
          </Button>
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