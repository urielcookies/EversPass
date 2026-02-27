import axios from "axios";
import { BACKEND_API } from "@/lib/constants";

interface PhotoRecord {
  id: string;
  media_type: 'photo' | 'video';
  originalFilename: string;
  image_url: string;
  thumbnail_420_url: string;
  thumbnail_800_url: string;
  thumbnail_1200_url: string;
  likes: number;
  created: string;
  session_id: string;
  size: number;
  width?: number | null;
  height?: number | null;
}
interface PagedPhotoResponse {
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
  sessionSize: number;
  items: PhotoRecord[];
  totalDeviceSessionsSize: number;
}

const fetchPhotosForSession = async (
  sessionId: string,
  page: number = 1,
  perPage: number = 50
): Promise<PagedPhotoResponse> => {
  if (!sessionId) {
    throw new Error('fetchPhotosForSession: sessionId is required');
  }
  try {
    const response = await axios.get(
      `${BACKEND_API}/photosession/${sessionId}/photos?page=${page}&perPage=${perPage}`
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to load photos for session ${sessionId}:`, error);
    throw error;
  }
};

export default fetchPhotosForSession;
export type { PhotoRecord,  PagedPhotoResponse};
