import { useRef, useEffect } from 'react';
import { Download, ExternalLink, Heart, MoreVertical, Trash2 } from 'lucide-react';
import { isEqual } from 'lodash-es';
import { Button } from '@/components/ui/button';
import { type PhotoRecord } from '@/services/fetchPhotosForSession';
import { deletePhotoById } from '@/services/deletePhotoById';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
interface PhotoGridProps {
  photoSession: PhotoRecord[];
  oneView: boolean;
  selectedPhotoId: string | null;
  setSelectedPhotoId: (id: string | null) => void;
  setOneView: (view: boolean) => void;
  handleOpenPhotoViewModal: (photo: PhotoRecord) => void;
  handleToggleLike: (photoId: string) => void;
  getIsLiked: (photoId: string) => boolean;
  roleId: 'VIEWER' | 'EDITOR' | 'OWNER';
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
    getIsLiked,
    roleId
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

  const handleDeletePhoto = (photoId: string) => {
    deletePhotoById(photoId);
  };

  const downloadImage = async (url: string, filename = 'image.jpg') => {
    const response = await fetch(url);
    const blob = await response.blob();

    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  };

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
              ? 'bg-white dark:bg-slate-900 rounded-lg overflow-hidden flex flex-col shadow-lg'
              : 'relative aspect-square bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden flex flex-col cursor-pointer'
          }>
          {oneView ? (
            <div className="flex flex-col h-full">
              {/* Top */}
              <div className="flex items-center p-3 sm:p-4 bg-gray-100 text-gray-900 dark:bg-slate-900 dark:text-white">
                <p className="text-sm font-semibold truncate flex-grow">
                  {photo.originalFilename || 'Unnamed Photo'}
                </p>

                {(isEqual(roleId, 'EDITOR') || isEqual(roleId, 'OWNER')) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="ml-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-800"
                        aria-label="Options">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="text-red-600 focus:bg-red-50 dark:text-red-500 dark:focus:bg-red-900/30">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                      {/* You can add more items here like "Download", "Rename", etc. */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
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
              <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-100 dark:bg-slate-900">
                {/* Left side: Like button */}
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={e => {
                      e.stopPropagation();
                      handleToggleLike(photo.id);
                    }}
                    className="bg-transparent hover:bg-gray-200 dark:hover:bg-slate-800 text-gray-700 dark:text-white">
                    <Heart
                      className={`!h-6 !w-6 transition-colors duration-200 ${
                        getIsLiked(photo.id)
                          ? 'text-red-500 fill-red-500'
                          : 'text-gray-500 dark:text-white'
                      }`}
                    />
                    {photo.likes > 0 && (
                      <span className="!text-gray-600 dark:!text-gray-300 !text-sm !font-medium ml-1">
                        {photo.likes}
                      </span>
                    )}
                  </Button>
                </div>

                {/* Right side: Preview + Download */}
                <div className="ml-auto flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={e => {
                      e.stopPropagation();
                      window.open(photo.image_url, '_blank');
                    }}
                    className="bg-transparent hover:bg-gray-200 dark:hover:bg-slate-800 text-gray-700 dark:text-white">
                    <ExternalLink className="!h-6 !w-6" />
                    <span className="sr-only">Preview</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={e => {
                      e.stopPropagation();
                      downloadImage(photo.image_url, photo.originalFilename);
                    }}
                    className="bg-transparent hover:bg-gray-200 dark:hover:bg-slate-800 text-gray-700 dark:text-white">
                    <Download className="!h-6 !w-6" />
                    <span className="sr-only">Download</span>
                  </Button>
                </div>
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