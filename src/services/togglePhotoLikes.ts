import axios from 'axios';
import { BACKEND_API } from '@/lib/constants';

/**
 * Toggles the like status of a photo on the backend.
 *
 * @param photoId The ID of the photo to like/unlike.
 * @param action 'like' to increment likes, 'unlike' to decrement likes.
 * @returns A promise that resolves with the server response data,
 * which should contain `new_likes_count` and `photo_id`.
 */
const togglePhotoLikes = async (
  photoId: string,
  action: 'like' | 'unlike'
): Promise<{ photo_id: string; new_likes_count: number; message: string; action: 'like' | 'unlike' }> => {
  try {
    const response = await axios.post(`${BACKEND_API}/toggle-like/${photoId}`, { action });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Server responded with a status code that falls out of the range of 2xx
      console.error(`Failed to toggle like for photo ID ${photoId}:`, error.response.data);
      throw new Error(error.response.data.message || 'Could not toggle like for the photo.');
    } else if (axios.isAxiosError(error)) {
      // Request was made but no response was received (e.g., network error)
      console.error(`Network error while toggling like for photo ID ${photoId}:`, error.message);
      throw new Error('Network error. Could not connect to the server.');
    } else {
      // Something else happened while setting up the request
      console.error(`An unexpected error occurred while toggling like for photo ID ${photoId}:`, error);
      throw new Error('An unknown error occurred.');
    }
  }
};

export default togglePhotoLikes;