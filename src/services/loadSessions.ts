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

const loadSessionsByDeviceId = async (deviceId: string): Promise<SessionRecord[]> => {
  try {
    const response = await axios.get(`${BACKEND_API}/load-session?deviceId=${deviceId}`)
    const records: SessionRecord[] = response.data;

    return records;
  } catch (error) {
    console.error('Failed to load sessions:', error);
    return [];
  }
};

export { loadSessionsByDeviceId };
export type { SessionRecord };
