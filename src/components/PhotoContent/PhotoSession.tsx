import { type PhotoRecord } from '@/services/fetchPhotosForSession'; 
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog"; // For your upload modal
import { Camera, Clock, Share, Upload } from 'lucide-react';
import { type SessionRecord } from '@/stores/sessionsStore';
import { formatDistanceToNow, parseISO } from 'date-fns';

interface PhotoSessionContent {
  session: SessionRecord;
  photoSession: PhotoRecord[];
  isLoadingMore: boolean;
}

const PhotoSessionContent = ({ session, photoSession }: PhotoSessionContent) => {
  const formatExpiration = (expiresAt: string) =>
    `Expires in ${formatDistanceToNow(parseISO(expiresAt))}`;

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
              <span>{photoSession && photoSession.length} Photos</span>
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
          {/* This button would open your upload dialog */}
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Photos
          </Button>
        </div>
      </header>

      {/* Photo Grid Section */}
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
              <Button size="lg">
                Upload Your First Photo
              </Button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default PhotoSessionContent;