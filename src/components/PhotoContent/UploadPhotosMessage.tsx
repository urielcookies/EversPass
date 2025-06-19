import { Camera } from "lucide-react";
import { Button } from "../ui/button";

interface UploadPhotosMessage {
  handleOpenUploadModal: () => void
}

const UploadPhotosMessage = ({ handleOpenUploadModal }: UploadPhotosMessage) => (
  <div
    id="empty-state"
    className="text-center py-20 px-4 rounded-xl bg-slate-100 dark:bg-slate-900/50">
    <div className="flex-shrink-0 mx-auto h-12 w-12 rounded-full bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center">
      <Camera className="h-6 w-6 text-sky-600 dark:text-sky-400" />
    </div>
    <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">
      Your Session is Ready
    </h3>
    <p className="mt-2 text-slate-600 dark:text-slate-400">
      Upload the first photos to get started.
    </p>
    <div className="mt-6">
      <Button
        variant="primary-cta"
        size="lg"
        onClick={handleOpenUploadModal}>
        Upload Your First Photo
      </Button>
    </div>
  </div>
);

export default UploadPhotosMessage;