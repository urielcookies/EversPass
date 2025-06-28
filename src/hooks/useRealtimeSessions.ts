import { useEffect, useState } from "react";
import pb from "@/services/pocketbase";
import { fetchSessions } from '@/stores/sessionsStore'; 
import checkDeviceIdExists from "@/services/checkDeviceIdExists";
import { getDecryptedUrlParam, setEncryptedUrlParam } from "@/lib/encryptRole";

const useRealtimeSessions = (deviceIdSession: string | null) => {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const clearData = () => {
    const currentUrl = new URL(window.location.href);
    currentUrl.search = '';
    window.history.replaceState({}, '', currentUrl.toString());
    setDeviceId(null);
  };

  const dataParam = getDecryptedUrlParam('data');
  const parsedData = dataParam ? JSON.parse(dataParam) : null;
  const deviceIdLocal: string | null = deviceId
    || deviceIdSession
    || (parsedData ? parsedData.deviceId : null);

  useEffect(() => {
    (async () => {
      if (!deviceIdLocal) {
        clearData()
        return;
      }
      setIsLoading(true);
      const deviceIdExists = await checkDeviceIdExists(deviceIdLocal);

      if (deviceIdExists?.exists) {       
        if (!deviceId) setDeviceId(deviceIdExists.device_id)
        const jsonString = JSON.stringify({
          deviceId: deviceIdExists.device_id,
        });
        setEncryptedUrlParam('data', jsonString);

        // Load initial data
        await fetchSessions(deviceIdExists.device_id, 1, 10, true);

        // Setup real-time subscription
        pb.collection('everspass_sessions').subscribe('*', (e) => {
          if (e.record.device_id !== deviceIdExists.device_id) return; // ignore unrelated changes
          fetchSessions(deviceIdExists.device_id, 1, 10, true);
        });
      } else {
        clearData();
      }
      setIsLoading(false);
    })()

    // Clean up on unmount
    return () => {
      pb.collection('everspass_sessions').unsubscribe('*');
    };
  }, [deviceId]);

  return { deviceId, setDeviceId, isLoading };
};

export default useRealtimeSessions;
