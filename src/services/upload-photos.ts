import axios from 'axios';
import { BACKEND_API } from '@/lib/constants';

interface FileUploadResult {
  filename: string;
  record_id?: string;
  record_data?: any;
  error?: string;
  details?: any;
  status_code?: number;
  reason?: string;
  quota_bytes?: number;
  used_bytes?: number;
  file_size_bytes?: number;
}

interface UploadResponse {
  message: string;
  total_files_processed: number;
  successful_uploads_count: number;
  successful_uploads: FileUploadResult[];
  failed_uploads_count: number;
  failed_uploads: FileUploadResult[];
  skipped_uploads_count: number;
  skipped_uploads: FileUploadResult[];
}

interface UploadPhotosParams {
  sessionId: string;
  files: File[]; 
}

const uploadPhotosForSession = async ({ sessionId, files }: UploadPhotosParams): Promise<UploadResponse> => {
  try {
    const formData = new FormData();

    files.forEach(file => {
      formData.append('image', file);
    });

    const response = await axios.post<UploadResponse>(
      `${BACKEND_API}/upload-photos/${sessionId}`,
      formData,
    );

    return response.data;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorResponseData = error.response?.data;
      
      console.error('Failed to upload photos (Axios error):', errorResponseData || error.message);

      if (errorResponseData && typeof errorResponseData === 'object' && 'message' in errorResponseData) {
        const partialResponse: Partial<UploadResponse> = errorResponseData;
        
        partialResponse.successful_uploads = partialResponse.successful_uploads || [];
        partialResponse.failed_uploads = partialResponse.failed_uploads || [];
        partialResponse.skipped_uploads = partialResponse.skipped_uploads || [];
        
        throw new Error(partialResponse.message || 'An error occurred during upload processing.');

      } else {
        throw new Error(error.message || 'An unexpected network error occurred.');
      }
    } else {
      console.error('An unexpected error occurred during photo upload:', error);
      throw new Error('An unexpected error occurred during photo upload.');
    }
  }
};

export { uploadPhotosForSession };
export type { FileUploadResult, UploadResponse, UploadPhotosParams };