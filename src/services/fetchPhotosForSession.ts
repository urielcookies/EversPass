import axios from "axios";
import { BACKEND_API } from "@/lib/constants";

interface PhotoRecord {
  id: string;
  originalFilename: string;
  image_url: string;
  likes: number;
  created: string;
  session_id: string;
}
interface PagedPhotoResponse {
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
  items: PhotoRecord[];
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
