import axios from 'axios';
import { BACKEND_API } from '@/lib/constants';

interface PhotoSessionCheckResponse {
  exists: boolean;
  session_id: string;
}

const checkPhotoSessionExists = async (sessionId: string): Promise<PhotoSessionCheckResponse | null> => {
  if (!sessionId) {
    console.warn("Session ID is required for checkPhotoSessionExists.");
    return null;
  }

  try {
    const response = await axios.get<PhotoSessionCheckResponse>(`${BACKEND_API}/check-photosession-exists/${sessionId}`);
    return response.data;

  } catch (error) {
    console.error(`Failed to check existence for session ID ${sessionId}:`, error);
    return null;
  }
};

export default checkPhotoSessionExists;
export type { PhotoSessionCheckResponse };