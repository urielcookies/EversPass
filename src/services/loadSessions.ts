import axios from 'axios';
import { BACKEND_API } from '@/lib/constants';

interface SessionRecord {
  id: string;
  created: string;
  updated: string;
  device_id: string;
  name: string;
  expires_at: string;
  status: 'active' | 'expired' | 'deleting' | 'deleted';
}

const loadSessionsByDeviceId = async (deviceId: string): Promise<SessionRecord[] | undefined> => {
  try {
    const response = await axios.get(`${BACKEND_API}/load-session?deviceId=${deviceId}`)
    const records: SessionRecord[] = response.data;

    // Map raw PocketBase records to your defined SessionRecord structure
    const typedRecords: SessionRecord[] = records.map((record) => ({
      id: record.id,
      created: record.created,
      updated: record.updated,
      device_id: record.device_id,
      name: record.name,
      expires_at: record.expires_at,
      status: record.status,
    }));

    return typedRecords;
  } catch (error) {
    console.error('Failed to load sessions:', error);
  }
};

export { loadSessionsByDeviceId };
export type { SessionRecord };
