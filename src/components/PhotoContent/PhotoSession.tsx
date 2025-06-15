import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { type PhotoRecord } from '@/services/fetchPhotosForSession';
import { Button } from "@/components/ui/button";
// No need for DialogTrigger import, as we'll manage open state directly
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Camera, Clock, Share, Upload, XCircle } from 'lucide-react';
import { type SessionRecord } from '@/stores/sessionsStore';
import { formatDistanceToNow, parseISO } from 'date-fns';

interface PhotoSessionContentProps {
  session: SessionRecord;
  photoSession: PhotoRecord[];
  isLoadingMore: boolean;
}

interface FileWithPreview extends File {
  preview: string;
}

const PhotoSessionContent = ({ session, photoSession }: PhotoSessionContentProps) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false); // Loading state for upload
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
      setSelectedFiles(prevFiles => [...prevFiles, ...filesWithPreviews]);
    }
    event.target.value = ''; // Clear the input's value
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
    setSelectedFiles([]);
  };

  const handleOpenDialog = () => setIsUploadModalOpen(true);
  const handleCloseDialog = () => {
    // Only clear files if not currently uploading, or if forced to close by explicit cancel
    // If the modal is closed by X or outside click during upload, we want files to persist.
    // However, since we disable buttons during upload, the only way to close it
    // during upload is by a direct state change from handleUploadSubmit.
    // For "Cancel" button, handleClearSelectedFiles() is called directly.
    setIsUploadModalOpen(false);
    // setIsUploading(false) //added
    // If the user closes by clicking outside or 'X' button, we don't clear files.
    // Files are cleared only on 'Cancel' or successful 'Confirm Upload'.

    if (!isUploading) {
      handleClearSelectedFiles();   
    }
  };

  const handleUploadSubmit = async (event: FormEvent) => {
    console.log('???')
    event.preventDefault();
    setIsUploading(true); // Set loading to true when upload starts

    try {
      // For demonstration, simulate an API call delay:
      await new Promise(resolve => setTimeout(2000)); // Simulate 2-second upload

      console.log("Simulating upload of files:", selectedFiles);
      alert(`Simulating upload of ${selectedFiles.length} photos.`);

      setIsUploadModalOpen(false); // Close modal on success
      handleClearSelectedFiles(); // Clear files on success
    } catch (error) {
      console.error("Error during photo upload:", error);
      alert("Failed to upload photos. Please try again."); // Show error to user
    } finally {
      setIsUploading(false); // Set loading to false regardless of success or failure
    }
  };

  console.log('isUploading-->>', isUploading)
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
              <span>{photoSession?.length || 0} Photos</span> {/* Use optional chaining and default to 0 */}
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
          {/* Direct onClick to open the single Dialog */}
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
              {/* Direct onClick to open the single Dialog */}
              <Button variant="primary-cta" size="lg" onClick={handleOpenDialog}>
                Upload Your First Photo
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* SINGLE SHARED DIALOG COMPONENT - Placed outside conditional rendering */}
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
                onClick={() => fileInputRef.current?.click()}
                variant="primary-cta"
                disabled={isUploading} // Disable while uploading
              >
                <Upload className="mr-2 h-4 w-4" /> Select Photos
              </Button>

              {selectedFiles.length > 0 ? (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {selectedFiles.map((file) => (
                    <div key={file.name} className="relative aspect-square rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700">
                      <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 rounded-full"
                        onClick={() => handleRemoveFile(file.name)}
                        disabled={isUploading} // Disable while uploading
                      >
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
                  variant="outline"
                  onClick={handleCloseDialog}
                  disabled={isUploading}>
                  Cancel
                </Button>
              </DialogClose>

              <Button
                type="submit"
                disabled={selectedFiles.length === 0 || isUploading}
                loading={isUploading}
                variant="primary-cta"
              >
                Confirm Upload ({selectedFiles.length} {selectedFiles.length === 1 ? 'photo' : 'photos'})
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default PhotoSessionContent;