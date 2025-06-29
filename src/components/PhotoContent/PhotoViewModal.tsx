import { Download, XCircle, Heart, MoreVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isEqual } from 'lodash-es';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import type { PhotoRecord } from '@/services/fetchPhotosForSession';
import { deletePhotoById } from '@/services/deletePhotoById';

interface PhotoViewModalProps {
  isOpen: boolean;
  activePhoto: PhotoRecord;
  onClose: () => void;
  handleToggleLike: (photoId: string) => void;
  getIsLiked: (photoId: string) => boolean;
  roleId: 'VIEWER' | 'EDITOR' | 'OWNER';
}

const PhotoViewModal = ({
  isOpen,
  activePhoto,
  onClose,
  handleToggleLike,
  getIsLiked,
  roleId,
}: PhotoViewModalProps) => {
  if (!isOpen || !activePhoto) return null;
  const { id: photoId, image_url, originalFilename } = activePhoto;

  const handleDeletePhoto = async(photoId: string) => {
    await deletePhotoById(photoId);
    onClose();
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
    <Dialog open={isOpen}>
      <DialogContent
        className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] h-[90vh] flex flex-col"
        onInteractOutside={onClose}
        hideClose>
        <DialogHeader className="flex-shrink-0 bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-white rounded-md px-4 py-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              {originalFilename || 'Photo View'}
            </DialogTitle>

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
                    onClick={() => handleDeletePhoto(photoId)}
                    className="text-red-600 focus:bg-red-50 dark:text-red-500 dark:focus:bg-red-900/30">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <DialogDescription className="sr-only">
            Large view of the selected photo.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow flex items-center justify-center p-2 overflow-hidden">
          <img
            src={image_url}
            alt="Enlarged session photo"
            className="max-w-full max-h-full object-contain" />
        </div>

        <DialogFooter className="!flex !justify-between !items-center !w-full !mt-4 !px-4">
          <div className="!flex !items-center !gap-2">
            <Heart
              className={`!h-6 !w-6 !cursor-pointer !transition-colors !duration-200 ${
                getIsLiked(photoId)
                  ? '!text-red-500 !fill-red-500'
                  : '!text-gray-600 dark:!text-gray-300'
              }`}
              onClick={() => handleToggleLike(photoId)}
            />
            {activePhoto.likes > 0 && (
              <span className="!text-gray-600 dark:!text-gray-300 !text-sm !font-medium">
                {activePhoto.likes}
              </span>
            )}
          </div>

          <div className="!flex !items-center !gap-2">
            <Button variant="outline" onClick={onClose} className="!px-4 !py-2">
              <XCircle className="!mr-2 !h-4 !w-4" /> Close
            </Button>
            <Button
              variant="primary-cta"
              onClick={() => downloadImage(image_url, originalFilename)}
              className="!px-4 !py-2">
              <Download className="!mr-2 !h-4 !w-4" /> Download
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoViewModal;