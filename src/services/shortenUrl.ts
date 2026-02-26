import axios from 'axios';
import { BACKEND_API } from '@/lib/constants';

const shortenUrl = async (url: string): Promise<string> => {
  const response = await axios.post(`${BACKEND_API}/shorten-url`, { url });
  return response.data.shortUrl;
};

export { shortenUrl };
