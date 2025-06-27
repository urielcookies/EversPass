import axios from 'axios';
import { BACKEND_API } from '@/lib/constants';

interface SessionRecord {
  id: string;
  created: string;
  updated: string;
  device_id: string;
  name: string;
  expires_at: string;
  total_photos_bytes: number;
  total_photos: number;
}

interface PaginatedSessions {
  items: SessionRecord[];
  page: number;
  per_page: number;
  total_pages: number;
  total_items: number;
}

const loadSessionsByDeviceId = async (
  deviceId: string,
  page = 1,
  perPage = 10
): Promise<PaginatedSessions> => {
  try {
    const response = await axios.get(`${BACKEND_API}/load-session`, {
      params: { deviceId, page, per_page: perPage }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to load sessions:', error);
    throw error;
  }
};

export { loadSessionsByDeviceId };
export type { SessionRecord, PaginatedSessions };