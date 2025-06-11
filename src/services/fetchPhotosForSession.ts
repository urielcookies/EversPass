import axios from "axios";
import { BACKEND_API } from "@/lib/constants";

interface PhotoRecord {
  id: string;
  url: string;
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
  sessionId: string | null | undefined,
  page: number = 1,
  perPage: number = 50
): Promise<PagedPhotoResponse> => {
  if (!sessionId) {
    throw new Error('fetchPhotosForSession: sessionId is required');
  }
  try {
    const response = await axios.get(
      `${BACKEND_API}/sessions/${sessionId}/photos?page=${page}&perPage=${perPage}`
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to load photos for session ${sessionId}:`, error);
    throw error;
  }
};

export default fetchPhotosForSession;
export type { PhotoRecord,  PagedPhotoResponse};
