import axios from 'axios';
import { BACKEND_API } from '@/lib/constants';

const deletePhotoById = async (photoId: string): Promise<void> => {
  try {
    await axios.delete(`${BACKEND_API}/delete-photo/${photoId}`);
  } catch (error) {
    console.error(`Failed to delete photo with ID ${photoId}:`, error);
    throw new Error('Could not delete the photo.');
  }
};

export { deletePhotoById };
