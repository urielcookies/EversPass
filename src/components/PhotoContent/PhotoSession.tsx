import { useState, useRef, type ChangeEvent, type FormEvent } from 'react';
import { Camera, Clock, Share, Upload, XCircle, Loader2 } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { type PhotoRecord } from '@/services/fetchPhotosForSession';
import { uploadPhotosForSession, type UploadResponse } from '@/services/upload-photos';
import { Button } from "@/components/ui/button";
import { type SessionRecord } from '@/stores/sessionsStore';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

// Import the new upload service function and its types

interface PhotoSessionContentProps {
  session: SessionRecord;
  photoSession: PhotoRecord[];
  isLoadingMore: boolean;
  // Add a prop to trigger parent data refetch after successful upload
  onPhotosUploaded: () => void;
}

interface FileWithPreview extends File {
  preview: string;
}

const PhotoSessionContent = ({ session, photoSession, onPhotosUploaded }: PhotoSessionContentProps) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatExpiration = (expiresAt: string) =>
    `Expires in ${formatDistanceToNow(parseISO(expiresAt))}`;

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const filesWithPreviews: FileWithPreview[] = files.map(file =>
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      );

      setSelectedFiles(prevFiles => {
        const existingFileNames = new Set(prevFiles.map(file => file.name));
        const newUniqueFiles = filesWithPreviews.filter(file =>
          !existingFileNames.has(file.name)
        );

        // Revoke URLs for files that were selected but are duplicates and won't be added to state
        filesWithPreviews.forEach(file => {
          if (!newUniqueFiles.includes(file)) {
            URL.revokeObjectURL(file.preview);
          }
        });

        return [...prevFiles, ...newUniqueFiles];
      });
    }
    event.target.value = '';
  };

  const handleRemoveFile = (fileName: string) => {
    setSelectedFiles(prevFiles => {
      const updatedFiles = prevFiles.filter(file => file.name !== fileName);
      const removedFile = prevFiles.find(file => file.name === fileName);
      if (removedFile) {
        URL.revokeObjectURL(removedFile.preview); // Clean up the object URL
      }
      return updatedFiles;
    });
  };

  const handleClearSelectedFiles = () => {
    selectedFiles.forEach(file => URL.revokeObjectURL(file.preview)); // Clean up all object URLs
    setSelectedFiles([]);
  };

  const handleOpenDialog = () => setIsUploadModalOpen(true);

  const handleCloseDialog = () => {
    setIsUploadModalOpen(false);
    if (!isUploading) {
      handleClearSelectedFiles();   
    }
  };

  const handleUploadSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsUploading(true);

    // Ensure session and selectedFiles are available before proceeding
    if (!session?.id || selectedFiles.length === 0) {
      alert("Error: Session not found or no files selected.");
      setIsUploading(false);
      return;
    }

    try {
      const result: UploadResponse | undefined = await uploadPhotosForSession({
        sessionId: session.id,
        files: selectedFiles,
      });

      if (result) {
        console.log("Upload successful:", result);
        alert(result.message);
        setIsUploadModalOpen(false);
        handleClearSelectedFiles();
        onPhotosUploaded(); // Notify parent component to refetch data
      } else {
        alert("Upload failed: No response received from server.");
      }
    } catch (error: any) {
      console.error("Error during photo upload in component:", error);
      alert(error.message || "Failed to upload photos. Please try again.");
    } finally {
      setIsUploading(false);
    }
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
          <Button variant="primary-cta" onClick={handleOpenDialog}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Photos
          </Button>
        </div>
      </header>

      <section className="mt-8">
        {photoSession && photoSession.length > 0 ? (
          <div id="photo-grid" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
            {photoSession.map(photo => (
              <div key={photo.id} className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden">
                <img src={photo.url} alt={photo.alt || 'Session photo'} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        ) : (
          <div id="empty-state" className="text-center py-20 px-4 rounded-xl bg-slate-100 dark:bg-slate-900/50">
            <div className="flex-shrink-0 mx-auto h-12 w-12 rounded-full bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center">
              <Camera className="h-6 w-6 text-sky-600 dark:text-sky-400" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">Your Session is Ready</h3>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Upload the first photos to get started.
            </p>
            <div className="mt-6">
              <Button variant="primary-cta" size="lg" onClick={handleOpenDialog}>
                Upload Your First Photo
              </Button>
            </div>
          </div>
        )}
      </section>

      <Dialog open={isUploadModalOpen}>
        <DialogContent
          hideClose
          className="sm:max-w-[800px]"
          onInteractOutside={(e) => {
            if (isUploading) e.preventDefault();
            else handleCloseDialog();
          }}>
          <DialogHeader>
            <DialogTitle>Upload Photos to {session?.name}</DialogTitle>
            <DialogDescription>
              Select photos from your device to upload to this session.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadSubmit}>
            <div className="grid gap-4 py-4">
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

              {selectedFiles.length > 0 ? (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {selectedFiles.map((file) => (
                    <div key={file.name} className="relative aspect-square rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700">
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = 'https://placehold.co/150x150/CCCCCC/000000?text=Error'; // Placeholder for failed image
                          target.alt = `Could not load ${file.name}`;
                          console.error(`Error loading image preview for: ${file.name}`);
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
              ) : (
                <div className="text-center py-10 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
                  No photos selected yet.
                </div>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
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
                  `Confirm Upload (${selectedFiles.length} ${selectedFiles.length === 1 ? 'photo' : 'photos'})`
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default PhotoSessionContent;
