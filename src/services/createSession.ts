import pb from './pocketbase';

interface SessionData {
  device_id: string;
  name: string;
  expires_at: string;
  status: 'active' | 'expired' | 'deleting' | 'deleted';
}

const createSession = async (data: SessionData) => {
  try {
    const record = await pb.collection('everspass_sessions').create(data);
    return record;
  } catch (error) {
    console.error('Failed to create session:', error);
  }
};

export { createSession };
export type { SessionData };
