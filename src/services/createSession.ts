import axios from 'axios';
import { BACKEND_API } from '@/lib/constants';

interface SessionData {
  device_id: string;
  name: string;
}

const createSession = async (data: SessionData) => {
  try {
    const record = await axios.post(`${BACKEND_API}/create-session`, {
        device_id: data.device_id,
        name: data.name
      }).catch((error) => console.error(error))

    return record;
  } catch (error) {
    console.error('Failed to create session:', error);
  }
};

export { createSession };
export type { SessionData };
