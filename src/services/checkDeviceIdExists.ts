import axios from 'axios';
import { BACKEND_API } from '@/lib/constants';

interface DeviceIdCheckResponse {
  exists: boolean;
  device_id: string;
}

const checkDeviceIdExists = async (deviceId: string): Promise<DeviceIdCheckResponse | null> => {
  if (!deviceId) {
    return null;
  }

  try {
    const response = await axios.get<DeviceIdCheckResponse>(`${BACKEND_API}/check-deviceid-exists/${deviceId}`);
    return response.data;

  } catch (error) {
    console.error(`Failed to check existence for deviceId ${deviceId}:`, error);
    return null;
  }
};

export default checkDeviceIdExists;
export type { DeviceIdCheckResponse };