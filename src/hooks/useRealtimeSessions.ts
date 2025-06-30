import { useEffect, useState } from "react";
import pb from "@/services/pocketbase";
import { fetchSessions } from '@/stores/sessionsStore'; 
import checkDeviceIdExists from "@/services/checkDeviceIdExists";
import { getDecryptedParam, setEncryptedParam } from "@/lib/encryptRole";

const useRealtimeSessions = (deviceIdSession: string | null) => {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const clearData = () => {
    const currentUrl = new URL(window.location.href);
    currentUrl.search = '';
    window.history.replaceState({}, '', currentUrl.toString());
    setDeviceId(null);
  };

  const dataURLParam = getDecryptedParam({ key: 'data', options: { useUrl: true } });
  const parsedURLData = dataURLParam ? JSON.parse(dataURLParam) : null;

  const dataLocalParam = getDecryptedParam({ key: 'data', options: { useLocalStorage: true } });
  const parsedLocalData = dataLocalParam ? JSON.parse(dataLocalParam) : null;

  const deviceIdLocal: string | null = deviceId
    || deviceIdSession
    || (parsedURLData ? parsedURLData.deviceId : null) // will be used for sharing and getting invited
    || (parsedLocalData ? parsedLocalData.deviceId : null);

  useEffect(() => {
    (async () => {
      if (!deviceIdLocal) {
        clearData();
        return;
      }
      setIsLoading(true);
      const deviceIdExists = await checkDeviceIdExists(deviceIdLocal);

      if (deviceIdExists?.exists) {       
        if (!deviceId) setDeviceId(deviceIdExists.device_id);
        const jsonString = JSON.stringify({
          deviceId: deviceIdExists.device_id,
        });

        setEncryptedParam({ key: 'data', value: jsonString, options: { useUrl: true } });

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
