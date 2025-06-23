import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  useEffect,
  type Dispatch,
} from 'react';
import { Loader2, Upload, XCircle } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { type SessionRecord } from '@/stores/sessionsStore';
import { uploadPhotosForSession, type UploadResponse } from '@/services/upload-photos';
import type { NewlyCreated } from '@/hooks/usePhotoSessionSubscription';

// This type should ideally be defined in a shared types file if used elsewhere
interface FileWithPreview extends File {
  preview: string;
}

interface UploadPhotosModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: SessionRecord | null;
  createdRecordsState: {
    newlyCreated: NewlyCreated | null;
    setNewlyCreated: Dispatch<React.SetStateAction<NewlyCreated | null>>;
  }
}

const UploadPhotosModal = ({ isOpen, onClose, session, createdRecordsState }: UploadPhotosModalProps) => {
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clear selected files when the modal opens or closes
  useEffect(() => {
    handleClearSelectedFiles();
  }, [isOpen]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const filesWithPreviews: FileWithPreview[] = files.map(file =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setSelectedFiles(prevFiles => {
        const existingFileNames = new Set(prevFiles.map(file => file.name));
        const newUniqueFiles = filesWithPreviews.filter(
          file => !existingFileNames.has(file.name)
        );

        // Revoke URLs for files that are not new unique files (i.e., duplicates being replaced)
        filesWithPreviews.forEach(file => {
          if (!newUniqueFiles.includes(file)) {
            URL.revokeObjectURL(file.preview);
          }
        });

        return [...prevFiles, ...newUniqueFiles];
      });
    }
    event.target.value = ''; // Clear the input so the same file can be selected again
  };

  const handleRemoveFile = (fileName: string) => {
    setSelectedFiles(prevFiles => {
      const updatedFiles = prevFiles.filter(file => file.name !== fileName);
      const removedFile = prevFiles.find(file => file.name === fileName);
      if (removedFile) {
        URL.revokeObjectURL(removedFile.preview);
      }
      return updatedFiles;
    });
  };

  const handleClearSelectedFiles = () => {
    selectedFiles.forEach(file => URL.revokeObjectURL(file.preview));
    setIsUploading(false);
    setSelectedFiles([]);
    setUploadProgress(0);
    setUploadedFiles([]);
    createdRecordsState.setNewlyCreated(null);
  };

  const handleUploadSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsUploading(true);

    if (!session?.id || selectedFiles.length === 0) {
      alert('Error: Session not found or no files selected.');
      setIsUploading(false);
      return;
    }

    try {
      const result: UploadResponse | undefined = await uploadPhotosForSession({
        sessionId: session.id,
        files: selectedFiles,
      });

      if (result) onClose(); // Close modal on successful upload
      else alert('Upload failed: No response received from server.');
      
    } catch (error: any) {
      console.error('Error during photo upload:', error);
      alert(error.message || 'Failed to upload photos. Please try again.');
    } finally {
      handleClearSelectedFiles();
    }
  };

  useEffect(() => {
    const newlyCreated = createdRecordsState.newlyCreated;
    if (!newlyCreated) return;

    setUploadedFiles((state) => [...state, newlyCreated.originalFilename]);
  }, [createdRecordsState.newlyCreated]);

  // Update progress when uploadedFiles changes
  useEffect(() => {
    const totalFiles = selectedFiles.length;
    const uploadedCount = uploadedFiles.length;

    if (totalFiles > 0) {
      const progressPercent = (uploadedCount / totalFiles) * 100;
      setUploadProgress(progressPercent);
    }
  }, [uploadedFiles, selectedFiles.length]);

  console.log('uploadedFiles', uploadedFiles.length)
  return (
    <Dialog open={isOpen}>
      <DialogContent
        hideClose
        className="sm:max-w-[800px] flex flex-col max-h-[90vh]"
        onInteractOutside={e => {
          if (isUploading) e.preventDefault();
          else onClose();
        }}>
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Upload Photos to {session?.name || 'Session'}</DialogTitle>
          <DialogDescription>
            Select photos from your device to upload to this session.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleUploadSubmit} className="flex flex-col flex-grow min-h-0">
          <div className="grid gap-4 py-4 flex-shrink-0">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*"
              className="hidden"
            />
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              variant="primary-cta"
              disabled={isUploading}>
              <Upload className="mr-2 h-4 w-4" /> Select Photos
            </Button>
          </div>

          {isUploading && (
            <div className="mb-2 flex items-center gap-2">
              <Progress value={uploadProgress} className="h-2 flex-grow" />
              <span className="text-sm text-slate-500 dark:text-slate-400 w-12 text-right">
                {Math.round(uploadProgress)}%
              </span>
            </div>
          )}

          {selectedFiles.length > 0 ? (
            <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {selectedFiles.map(file => (
                  <div
                    key={file.name}
                    className="relative aspect-square rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700">
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-full h-full object-cover"
                      onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = 'https://placehold.co/150x150/CCCCCC/000000?text=Error';
                        target.alt = `Could not load ${file.name}`;
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 rounded-full"
                      onClick={() => handleRemoveFile(file.name)}
                      disabled={isUploading}>
                      <XCircle className="h-4 w-4" />
                      <span className="sr-only">Remove photo</span>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-10 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 flex-grow flex items-center justify-center">
              No photos selected yet.
            </div>
          )}

          <DialogFooter className="flex-shrink-0 pt-4">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isUploading}>
                Cancel
              </Button>
            </DialogClose>

            <Button
              type="submit"
              disabled={selectedFiles.length === 0 || isUploading}
              variant="primary-cta">
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                </>
              ) : (
                `Confirm Upload (${selectedFiles.length} ${
                  selectedFiles.length === 1 ? 'photo' : 'photos'
                })`
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadPhotosModal;