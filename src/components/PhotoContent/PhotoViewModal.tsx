import { Download, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PhotoViewModalProps {
  isOpen: boolean;
  photoUrl: string | null;
  onClose: () => void;
}

const PhotoViewModal = ({ isOpen, photoUrl, onClose }: PhotoViewModalProps) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent
        className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] h-[90vh] flex flex-col"
        onInteractOutside={onClose}
        hideClose>
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="sr-only">View Photo</DialogTitle>
          <DialogDescription className="sr-only">
            Large view of the selected photo.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow flex items-center justify-center p-2 overflow-hidden">
          {photoUrl && (
            <img
              src={photoUrl}
              alt="Enlarged session photo"
              className="max-w-full max-h-full object-contain"
            />
          )}
        </div>
        <DialogFooter className="flex-shrink-0 flex justify-between items-center w-full mt-4">
          <Button variant="outline" onClick={onClose} className="px-4 py-2">
            <XCircle className="mr-2 h-4 w-4" /> Close
          </Button>
          {photoUrl && (
            <Button
              variant="primary-cta"
              onClick={() => window.open(photoUrl, '_blank')}
              className="px-4 py-2">
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoViewModal;