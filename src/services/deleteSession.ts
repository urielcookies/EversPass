import axios from 'axios';
import { BACKEND_API } from '@/lib/constants';

const deleteSessionById = async (sessionId: string): Promise<void> => {
  try {
    await axios.delete(`${BACKEND_API}/delete-session/${sessionId}`);
  } catch (error) {
    console.error(`Failed to delete session with ID ${sessionId}:`, error);
    throw new Error('Could not delete the session.');
  }
};

export { deleteSessionById };