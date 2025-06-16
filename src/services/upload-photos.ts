import axios from 'axios';
import { BACKEND_API } from '@/lib/constants';

interface UploadedPhoto {
  id: string;
  url: string;
  originalFilename: string;
  created: string;
  session_id: string;
}

interface UploadResponse {
  message: string;
  uploaded_photos: UploadedPhoto[];
}

interface UploadPhotosParams {
  sessionId: string;
  files: File[]; 
}

const uploadPhotosForSession = async ({ sessionId, files }: UploadPhotosParams): Promise<UploadResponse | undefined> => {
  try {
    const formData = new FormData();

    files.forEach(file => {
      formData.append('photos', file);
    });

    const response = await axios.post<UploadResponse>(
      `${BACKEND_API}/upload-photos/${sessionId}`, // Construct the full API endpoint URL
      formData, // The FormData object containing the files
      {
        // Optional: Add headers like Authorization if your API requires authentication
        // headers: {
        //   'Authorization': `Bearer ${yourAuthToken}`,
        // },
        // Optional: onUploadProgress for showing a progress bar
        // onUploadProgress: (progressEvent) => {
        //   const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        //   console.log(`Upload progress: ${percentCompleted}%`);
        // }
      }
    );

    return response.data;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Failed to upload photos (Axios error):', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to upload photos. Please try again.');
    } else {
      console.error('An unexpected error occurred during photo upload:', error);
      throw new Error('An unexpected error occurred during photo upload.');
    }
  }
};

export { uploadPhotosForSession };
export type { UploadedPhoto, UploadResponse, UploadPhotosParams };
