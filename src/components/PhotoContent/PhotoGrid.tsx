// import { useRef, useEffect, useState } from 'react';
// import { Download, ExternalLink, Heart, MoreVertical, Trash2 } from 'lucide-react';
// import { isEqual } from 'lodash-es';
// import { Button } from '@/components/ui/button';
// import { type PhotoRecord } from '@/services/fetchPhotosForSession';
// import { deletePhotoById } from '@/services/deletePhotoById';
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
// } from '@/components/ui/dropdown-menu';
// interface PhotoGridProps {
//   photoSession: PhotoRecord[];
//   oneView: boolean;
//   selectedPhotoId: string | null;
//   setSelectedPhotoId: (id: string | null) => void;
//   setOneView: (view: boolean) => void;
//   handleOpenPhotoViewModal: (photo: PhotoRecord) => void;
//   handleToggleLike: (photoId: string) => void;
//   getIsLiked: (photoId: string) => boolean;
//   roleId: 'VIEWER' | 'EDITOR' | 'OWNER';
// }

// const PhotoGrid = (props: PhotoGridProps) => {
//   const {
//     photoSession,
//     oneView,
//     selectedPhotoId,
//     setSelectedPhotoId,
//     setOneView,
//     handleOpenPhotoViewModal,
//     handleToggleLike,
//     getIsLiked,
//     roleId
//   } = props;
//   const [isDownloading, setIsDownloading] = useState(false);
//   const photoRefs = useRef<Record<string, HTMLDivElement | null>>({});
//   const gridContainerRef = useRef<HTMLDivElement>(null);

//   // Scroll behavior based on view mode
//   useEffect(() => {
//     if (oneView && selectedPhotoId) {
//       const el = photoRefs.current[selectedPhotoId];
//       if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
//     } else if (!oneView && gridContainerRef.current) {
//       gridContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   }, [oneView, selectedPhotoId]);

//   const handleDeletePhoto = (photoId: string) => {
//     deletePhotoById(photoId);
//   };

//   const downloadImage = async (url: string, filename = 'image.jpg') => {
//     setIsDownloading(true);
//     const response = await fetch(url);
//     const blob = await response.blob();

//     const blobUrl = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = blobUrl;
//     link.download = filename;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(blobUrl);
//     setIsDownloading(false);
//   };

//   return (
//     <div
//       id="photo-grid"
//       ref={gridContainerRef}
//       className={
//         oneView
//           ? 'grid grid-cols-1 gap-2 sm:gap-4 overflow-y-auto h-full'
//           : 'grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 overflow-y-auto h-full'
//       }>
//       {photoSession.map(photo => (
//         <div
//           key={photo.id}
//           ref={el => (photoRefs.current[photo.id] = el)}
//           className={
//             oneView
//               ? 'bg-white dark:bg-slate-900 rounded-lg overflow-hidden flex flex-col shadow-lg'
//               : 'relative aspect-square bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden flex flex-col cursor-pointer'
//           }>
//           {oneView ? (
//             <div className="flex flex-col h-full">
//               {/* Top */}
//               <div className="flex items-center p-3 sm:p-4 bg-gray-100 text-gray-900 dark:bg-slate-900 dark:text-white">
//                 <p className="text-sm font-semibold truncate flex-grow">
//                   {photo.originalFilename || 'Unnamed Photo'}
//                 </p>

//                 {(isEqual(roleId, 'EDITOR') || isEqual(roleId, 'OWNER')) && (
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <button
//                         className="ml-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-800"
//                         aria-label="Options">
//                         <MoreVertical className="w-5 h-5" />
//                       </button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                       <DropdownMenuItem
//                         onClick={() => handleDeletePhoto(photo.id)}
//                         className="text-red-600 focus:bg-red-50 dark:text-red-500 dark:focus:bg-red-900/30">
//                         <Trash2 className="mr-2 h-4 w-4" />
//                         Delete
//                       </DropdownMenuItem>
//                       {/* You can add more items here like "Download", "Rename", etc. */}
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 )}
//               </div>

//               {/* Image */}
//               <div
//                 className="flex-grow flex items-center justify-center bg-black"
//                 onClick={() => {
//                   setSelectedPhotoId(photo.id);
//                   if (window.innerWidth <= 768) {
//                     setOneView(true);
//                   } else {
//                     handleOpenPhotoViewModal(photo);
//                   }
//                 }}>
//                 <img
//                   src={photo.image_url}
//                   alt={photo.originalFilename || 'Session photo'}
//                   className="max-w-full max-h-[80vh] object-contain cursor-pointer" />
//               </div>

//               {/* Actions */}
//               <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-100 dark:bg-slate-900">
//                 {/* Left side: Like button */}
//                 <div className="flex items-center">
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={e => {
//                       e.stopPropagation();
//                       handleToggleLike(photo.id);
//                     }}
//                     className="bg-transparent hover:bg-gray-200 dark:hover:bg-slate-800 text-gray-700 dark:text-white">
//                     <Heart
//                       className={`!h-6 !w-6 transition-colors duration-200 ${
//                         getIsLiked(photo.id)
//                           ? 'text-red-500 fill-red-500'
//                           : 'text-gray-500 dark:text-white'
//                       }`}
//                     />
//                     {photo.likes > 0 && (
//                       <span className="!text-gray-600 dark:!text-gray-300 !text-sm !font-medium ml-1">
//                         {photo.likes}
//                       </span>
//                     )}
//                   </Button>
//                 </div>

//                 {/* Right side: Preview + Download */}
//                 <div className="ml-auto flex items-center gap-2">
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={e => {
//                       e.stopPropagation();
//                       window.open(photo.image_url, '_blank');
//                     }}
//                     className="bg-transparent hover:bg-gray-200 dark:hover:bg-slate-800 text-gray-700 dark:text-white">
//                     <ExternalLink className="!h-6 !w-6" />
//                     <span className="sr-only">Preview</span>
//                   </Button>

//                   <Button
//                     loading={isDownloading}
//                     disabled={isDownloading}
//                     variant="ghost"
//                     size="icon"
//                     onClick={e => {
//                       e.stopPropagation();
//                       downloadImage(photo.image_url, photo.originalFilename);
//                     }}
//                     className="bg-transparent hover:bg-gray-200 dark:hover:bg-slate-800 text-gray-700 dark:text-white">
//                     <Download className="!h-6 !w-6" />
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div
//               onClick={() => {
//                 setSelectedPhotoId(photo.id);
//                 if (window.innerWidth <= 768) {
//                   setOneView(true);
//                 } else {
//                   handleOpenPhotoViewModal(photo);
//                 }
//               }}
//               className="relative aspect-square cursor-pointer">
//               <img
//                 src={photo.image_url}
//                 alt={photo.originalFilename || 'Session photo'}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default PhotoGrid;



import { useRef, useEffect } from 'react';
import { Download, ExternalLink, Heart, MoreVertical, Trash2 } from 'lucide-react';
// Removed isEqual from lodash-es, as direct comparison is used for roleId
import { Button } from '@/components/ui/button';
// Updated PhotoRecord type to include new fields
// import { type PhotoRecord } from '@/services/fetchPhotosForSession';
import { deletePhotoById } from '@/services/deletePhotoById';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

// IMPORTANT: Update this PhotoRecord interface to match the data sent from your backend
// Ensure these fields exist in the response from get_session_photos
export interface PhotoRecord {
  id: string;
  image_url: string; // Original (full-size) image URL
  thumbnail_420_url: string; // URL for 420x420 thumbnail
  thumbnail_800_url: string; // URL for 800x800 thumbnail
  thumbnail_1200_url: string; // URL for 1200x1200 thumbnail
  likes: number;
  created: string;
  session_id: string;
  originalFilename: string;
  size: number;
  width?: number; // Optional: Original image width from PocketBase metadata
  height?: number; // Optional: Original image height from PocketBase metadata
}

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
  console.log('photoSession-->>', photoSession)
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

                {/* Using direct comparison instead of isEqual */}
                {(roleId === 'EDITOR' || roleId === 'OWNER') && (
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
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {/* Image for oneView (Larger, responsive images) */}
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
                  // Use srcset for responsive loading based on screen size/resolution
                  // Assuming photo.width is the original width, use it for the 'w' descriptor
                  srcSet={`${photo.thumbnail_800_url} 800w, ${photo.thumbnail_1200_url} 1200w, ${photo.image_url} ${photo.width || 2000}w`}
                  // Define sizes to tell the browser how wide the image will be at different breakpoints
                  // Adjust these values to match your actual CSS breakpoints and how the image is displayed
                  sizes="(max-width: 768px) 80vw, (max-width: 1200px) 70vw, 900px" // Example: 80% viewport width on small screens, 70% on medium, max 900px on large
                  src={photo.thumbnail_800_url} // Fallback for browsers not supporting srcset, or if no match
                  alt={photo.originalFilename || 'Session photo'}
                  className="max-w-full max-h-[80vh] object-contain cursor-pointer"
                  // Add fetchPriority for the currently selected/viewed photo for LCP optimization
                  fetchPriority={selectedPhotoId === photo.id ? 'high' : 'auto'}
                  // Add width and height for CLS (if available from backend)
                  width={photo.width}
                  height={photo.height}
                />
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
                    className="bg-transparent hover:bg-transparent active:bg-transparent focus:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-700 dark:text-white">
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
                      // Use the original (full) image_url for preview/download
                      window.open(photo.image_url, '_blank');
                    }}
                    className="bg-transparent hover:bg-transparent active:bg-transparent focus:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-700 dark:text-white">
                    <ExternalLink className="!h-6 !w-6" />
                    <span className="sr-only">Preview</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={e => {
                      e.stopPropagation();
                      // Use the original (full) image_url for download
                      downloadImage(photo.image_url, photo.originalFilename);
                    }}
                    className="bg-transparent hover:bg-transparent active:bg-transparent focus:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-700 dark:text-white">
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
              {/* Image for grid view (Thumbnails, lazy loaded) */}
              <img
                src={photo.thumbnail_800_url} // Changed from thumbnail_420_url
                alt={photo.originalFilename || 'Session photo'}
                className="w-full h-full object-cover"
                loading="lazy"
                width={photo.width ? Math.min(photo.width, 800) : 800} // Changed from 420 to 800
                height={photo.height ? Math.min(photo.height, 800) : 800} // Changed from 420 to 800
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PhotoGrid;