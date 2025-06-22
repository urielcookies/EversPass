import { useRef, useEffect, useState } from 'react';
import { Download, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type PhotoRecord } from '@/services/fetchPhotosForSession';

interface PhotoGridProps {
  photoSession: PhotoRecord[];
  oneView: boolean;
  selectedPhotoId: string | null;
  setSelectedPhotoId: (id: string | null) => void;
  setOneView: (view: boolean) => void;
  handleOpenPhotoViewModal: (photo: PhotoRecord) => void;
  handleToggleLike: (photoId: string) => void;
  getIsLiked: (photoId: string) => boolean;
}

const PhotoGrid = (props: PhotoGridProps) => {
  const {
    photoSession,
    oneView,
    selectedPhotoId,
    setSelectedPhotoId,
    setOneView,
    handleOpenPhotoViewModal,
    handleToggleLike,
    getIsLiked
  } = props;
  const photoRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const gridContainerRef = useRef<HTMLDivElement>(null);

  // Scroll behavior based on view mode
  useEffect(() => {
    if (oneView && selectedPhotoId) {
      const el = photoRefs.current[selectedPhotoId];
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (!oneView && gridContainerRef.current) {
      gridContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [oneView, selectedPhotoId]);

  return (
    <div
      id="photo-grid"
      ref={gridContainerRef}
      className={
        oneView
          ? 'grid grid-cols-1 gap-2 sm:gap-4 overflow-y-auto h-full'
          : 'grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 overflow-y-auto h-full'
      }>
      {photoSession.map(photo => (
        <div
          key={photo.id}
          ref={el => (photoRefs.current[photo.id] = el)}
          className={
            oneView
              ? 'bg-slate-900 rounded-lg overflow-hidden flex flex-col shadow-lg'
              : 'relative aspect-square bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden flex flex-col cursor-pointer'
          }>
          {oneView ? (
            <div className="flex flex-col h-full">
              {/* Top */}
              <div className="flex items-center p-3 sm:p-4 bg-slate-900 text-white">
                <p className="text-sm font-semibold truncate flex-grow">
                  {photo.originalFilename || 'Unnamed Photo'}
                </p>
              </div>

              {/* Image */}
              <div
                className="flex-grow flex items-center justify-center bg-black"
                onClick={() => {
                  setSelectedPhotoId(photo.id);
                  if (window.innerWidth <= 768) {
                    setOneView(true);
                  } else {
                    handleOpenPhotoViewModal(photo);
                  }
                }}>
                <img
                  src={photo.image_url}
                  alt={photo.originalFilename || 'Session photo'}
                  className="max-w-full max-h-[80vh] object-contain cursor-pointer" />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-900">
                <div className="flex items-center">
                  {/* Like */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={e => {
                      e.stopPropagation();
                      handleToggleLike(photo.id);
                    }}
                    className="bg-transparent hover:bg-slate-800">
                    <Heart
                      className={`!h-6 !w-6 transition-colors duration-200 ${
                        getIsLiked(photo.id)
                          ? 'text-red-500 fill-red-500'
                          : 'text-white'
                      }`}
                    />
                    {photo.likes > 0 && (
                      <span className="!text-gray-600 dark:!text-gray-300 !text-sm !font-medium">
                        {photo.likes}
                      </span>
                    )}
                  </Button>
                </div>

                {/* Download */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={e => {
                    e.stopPropagation();
                    window.open(photo.image_url, '_blank');
                  }}
                  className="bg-transparent hover:bg-slate-800 text-white">
                  <Download className="!h-6 !w-6" />
                  <span className="sr-only">Download</span>
                </Button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => {
                setSelectedPhotoId(photo.id);
                if (window.innerWidth <= 768) {
                  setOneView(true);
                } else {
                  handleOpenPhotoViewModal(photo);
                }
              }}
              className="relative aspect-square cursor-pointer">
              <img
                src={photo.image_url}
                alt={photo.originalFilename || 'Session photo'}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PhotoGrid;