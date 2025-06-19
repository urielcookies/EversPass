import { useRef, useEffect } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type PhotoRecord } from '@/services/fetchPhotosForSession';

interface PhotoGridProps {
  photoSession: PhotoRecord[];
  oneView: boolean;
  selectedPhotoId: string | null;
  setSelectedPhotoId: (id: string | null) => void;
  setOneView: (view: boolean) => void;
  handleOpenPhotoViewModal: (photoUrl: string) => void;
}

const PhotoGrid = ({
  photoSession,
  oneView,
  selectedPhotoId,
  setSelectedPhotoId,
  setOneView,
  handleOpenPhotoViewModal,
}: PhotoGridProps) => {
  const photoRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (oneView && selectedPhotoId) {
      const el = photoRefs.current[selectedPhotoId];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [oneView, selectedPhotoId]);

  return (
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
            // This logic stays here because it directly influences how clicking a photo behaves
            if (window.innerWidth <= 768) {
              setOneView(true); // Set oneView if on small screens
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
                  e.stopPropagation(); // Prevent the click from propagating to the parent div
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
  );
};

export default PhotoGrid;