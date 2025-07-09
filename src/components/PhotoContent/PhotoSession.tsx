import {
  useState,
  useRef,
  useEffect,
} from 'react';
import {
  Camera,
  Clock,
  Loader2,
  Share2,
  Upload,
  CassetteTape,
  Table2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cloneDeep, find, includes, isEmpty, isEqual, orderBy } from 'lodash-es';
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
import { navigate } from 'astro:transitions/client';
import { encrypString } from '@/lib/encryptRole';
import { storageLimitGB } from '@/lib/constants';

interface PhotoSessionContentProps {
  session: SessionRecord;
  photoSession: PhotoRecord[];
  isLoadingMore: boolean;
  totalPhotos: number;
  sessionSize: number;
  allSessionsSize: number;
  roleId: 'VIEWER' | 'EDITOR' | 'OWNER';
}

const PhotoSessionContent = (props: PhotoSessionContentProps) => {
  const {session, photoSession, isLoadingMore, totalPhotos, sessionSize, allSessionsSize, roleId } = props;

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [oneView, setOneView] = useState(false);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const [modalViewOn, setModalViewOn] = useState(false);
  const [activePhoto, setActivePhoto] = useState<PhotoRecord | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [sortOption, setSortOption] = useState('newest');
  const [tabsElement, setTabsElement] = useState<HTMLDivElement | null>(null);
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
    // Check if the DOM element is available before setting up the observer
    if (!tabsElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // If the tabs element is NOT intersecting (i.e., user scrolled past it), show floating toggle.
        setShowFloatingToggle(!entry.isIntersecting);
      },
      {
        root: null, // Observe relative to the viewport
        rootMargin: '0px 0px -20px 0px',
        threshold: 0, // Trigger when 0% of the target is visible
      }
    );

    observer.observe(tabsElement);

    return () => {
      observer.unobserve(tabsElement);
      observer.disconnect();
    };
  }, [tabsElement]); // Depend on tabsElement state to re-run when the DOM node is available

  useEffect(() => {
    if (activePhoto) {
      const newActivePhoto = find(photoSession, ({ id }) => isEqual(id, activePhoto.id));
      if (newActivePhoto) setActivePhoto(newActivePhoto)
    }
  }, [photoSession, activePhoto]);
  
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

  const navigateToSessionsHandler = () => {
    const jsonString = JSON.stringify({
      deviceId: session.device_id,
    });

    const encrypted = encodeURIComponent(encrypString(jsonString));
    navigate(`/sessions?data=${encrypted}`);
  };

  const sessionSizeInGB = allSessionsSize / (1024 ** 3);
  const remainingGB = (storageLimitGB - sessionSizeInGB).toFixed(2);
  const progressBarValue = storageLimitGB > 0
    ? Math.max(0, Math.min(100, (sessionSizeInGB / storageLimitGB) * 100))
    : 0;

  const photoSessionSorted = () => {
    let newPhotosession = cloneDeep(photoSession);
    if (isEqual(sortOption, 'newest')) {
      newPhotosession = orderBy(newPhotosession, ['created'], ['desc']);
    } else if (isEqual(sortOption, 'oldest')) {
      newPhotosession = orderBy(newPhotosession, ['created'], ['asc']);
    } else if (isEqual(sortOption, 'most-liked')) {
      newPhotosession = orderBy(newPhotosession, ['likes'], ['desc']);
    }
    return newPhotosession;
  }

  {/* Calculate how many buttons will show */}
  const buttonsCount = (
    1 + // Share is always there
    ((roleId === 'EDITOR' || roleId === 'OWNER') && progressBarValue < 100 ? 1 : 0) +
    ((roleId === 'OWNER' && progressBarValue < 100) ? 1 : 0)
  );

  // Determine width class based on button count
  const getButtonWidthClass = (count: number) => {
    if (count === 1) return 'sm:w-[260px]';
    if (count === 2) return 'sm:w-[180px]';
    if (count >= 3) return 'sm:w-[140px]';
    return 'sm:w-[200px]'; // fallback
  };

  const buttonWidthClass = getButtonWidthClass(buttonsCount);

  return (
    <main className="max-w-7xl mx-auto">
      <header className="flex flex-col gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        {/* Top Row: Session Info & Buttons (Desktop: side-by-side, Mobile: stacked) */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          {/* Left Column */}
          <div className="flex-grow text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {session?.name || 'Session'}
            </h1>

            <div className="mt-2 flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5 justify-center sm:justify-normal">
                <Clock className="h-4 w-4" />
                <span>{formatExpiration(session.expires_at)}</span>
              </div>

              {/* First Line: Photos and Current Session Size */}
              <div className="flex items-center gap-1.5 justify-center sm:justify-normal">
                <Camera className="h-4 w-4 shrink-0" /> {/* Camera icon for photos */}
                <span className="whitespace-nowrap">
                  {totalPhotos} Photos
                  <span className="ml-1">({formatBytesToGB(sessionSize)} GB)</span>
                </span>
              </div>

              {/* Second Line: Total Device Usage and Remaining (with CassetteTape icon) */}
              <div className="flex items-center gap-1.5 justify-center sm:justify-normal">
                <CassetteTape className="h-4 w-4 shrink-0" /> {/* CassetteTape icon for storage */}
                <span className="whitespace-nowrap">
                  <span className="font-semibold">{formatBytesToGB(allSessionsSize)} GB</span>
                  <span> of {storageLimitGB} GB used</span>
                  <span className="ml-1">({remainingGB} GB remaining)</span>
                </span>
              </div>
            </div>

            {/* --- START MODIFIED PROGRESS BAR SECTION --- */}
            <div className="mt-4 w-full sm:max-w-sm mx-auto sm:mx-0">
              <div className="flex items-center justify-between gap-2"> {/* Flex container for bar and text */}
                <Progress value={progressBarValue} className="flex-grow" /> {/* Progress bar takes available space */}
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                  {progressBarValue.toFixed(0)}% {/* Display percentage, rounded to whole number */}
                </span>
              </div>
            </div>
            {/* --- END MODIFIED PROGRESS BAR SECTION --- */}
          </div>

          {/* Right Column: Buttons */}
          <div className="inline-flex flex-col gap-2 mt-4 sm:mt-0 w-full sm:w-[360px]">
            {isEqual(roleId, 'OWNER') ? (
              <>
                {/* Share (full width) */}
                <Button
                  onClick={handleOpenShareModal}
                  variant="primary-cta"
                  className="w-full">
                  <Share2 className="mr-2 h-4 w-4" />
                  <span className="truncate">Share</span>
                </Button>

                {/* Sessions + Upload side-by-side */}
                <div className="flex gap-2">
                  <Button
                    variant="primary-cta"
                    onClick={navigateToSessionsHandler}
                    className="w-full">
                    <Table2 className="mr-2 h-4 w-4" />
                    <span className="truncate">Sessions</span>
                  </Button>
                  {progressBarValue < 100 && (
                    <Button
                      variant="primary-cta"
                      onClick={handleOpenUploadModal}
                      className="w-full">
                      <Upload className="mr-2 h-4 w-4" />
                      <span className="truncate">Upload</span>
                    </Button>
                  )}
                </div>
              </>
            ) : isEqual(roleId, 'EDITOR') ? (
              // Editor: Share + Upload side-by-side
              <div className="flex gap-2">
                <Button
                  onClick={handleOpenShareModal}
                  variant="primary-cta"
                  className="w-full">
                  <Share2 className="mr-2 h-4 w-4" />
                  <span className="truncate">Share</span>
                </Button>
                {progressBarValue < 100 && (
                  <Button
                    variant="primary-cta"
                    onClick={handleOpenUploadModal}
                    className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    <span className="truncate">Upload</span>
                  </Button>
                )}
              </div>
            ) : (
              // Viewer: Share only
              <Button
                onClick={handleOpenShareModal}
                variant="primary-cta"
                className="w-full">
                <Share2 className="mr-2 h-4 w-4" />
                <span className="truncate">Share</span>
              </Button>
            )}

            {/* Sort Dropdown */}
            <Select defaultValue="newest" onValueChange={(value) => setSortOption(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="More actions..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="most-liked">Most Liked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>
      <section className="mt-8">
        {!isEmpty(photoSessionSorted()) ? (
          <>
            {/* Note: This is *not* the PhotoViewTabs component, but the separate floating one */}
            {showFloatingToggle && ( // This ensures it only shows when tabs are not in their initial view
              <PhotoViewTabsFloating viewState={{oneView, setOneView}} />
            )}

            {/* PhotoViewTabs - Now explicitly hidden on sm and larger screens */}
            <div className="sm:hidden"> {/* This div hides PhotoViewTabs on sm and up */}
              {/* ref prop changed to use setTabsElement */}
              <PhotoViewTabs oneView={oneView} setOneView={setOneView} ref={setTabsElement} />
            </div>


            <PhotoGrid
              photoSession={photoSessionSorted()}
              oneView={oneView}
              selectedPhotoId={selectedPhotoId}
              setSelectedPhotoId={setSelectedPhotoId}
              setOneView={setOneView}
              handleOpenPhotoViewModal={handleOpenPhotoViewModal}
              handleToggleLike={handleToggleLike}
              getIsLiked={getIsLiked}
              roleId={roleId} />

            {isLoadingMore && (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500 dark:text-blue-400" />
                <p className="ml-4 text-lg text-gray-600 dark:text-gray-300">
                  Loading more photos...
                </p>
              </div>
            )}

            {!isLoadingMore && isEqual(photoSessionSorted().length, totalPhotos) && (
              <div className="py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                You've reached the end of the session photos.
              </div>
            )}
          </>
        ) : (isEqual(roleId, 'EDITOR') || isEqual(roleId, 'OWNER'))
            ? <UploadPhotosMessage handleOpenUploadModal={handleOpenUploadModal} />
            : null}
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
        getIsLiked={getIsLiked}
        roleId={roleId} />

      <SharePageModal
        isOpen={showShareModal}
        onClose={handleCloseShareModal}
        sessionId={session.id}
        roleId={roleId}
        deviceId={session.device_id}/>
    </main>
  );
};

export default PhotoSessionContent;