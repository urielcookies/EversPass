import axios from 'axios';
import { BACKEND_API } from '@/lib/constants';
import type { SessionRecord } from '@/stores/sessionsStore';

interface SessionCheckResponse {
  exists: boolean;
  record: SessionRecord;
}

const findSession = async (sessionId: string): Promise<SessionCheckResponse | null> => {
  if (!sessionId) return null;

  try {
    const response = await axios.get<SessionCheckResponse>(`${BACKEND_API}/find-session/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to find session for sessionId ${sessionId}:`, error);
    return null;
  }
};

export default findSession;
export type { SessionCheckResponse };
