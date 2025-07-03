import { useEffect, useState } from "react";
import pb from "@/services/pocketbase";
import { fetchSessions } from '@/stores/sessionsStore'; 
import checkDeviceIdExists from "@/services/checkDeviceIdExists";
import { getDataParam, setDataParam } from "@/lib/encryptRole";

const useRealtimeSessions = (deviceIdSession: string | null) => {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const clearData = () => {
    const currentUrl = new URL(window.location.href);
    currentUrl.search = '';
    window.history.replaceState({}, '', currentUrl.toString());
    setDeviceId(null);
  };

  // Get decrypted & parsed data from URL and localStorage
  const urlData = getDataParam('useURL');
  const localData = getDataParam('useLocalStorage');

  // Resolve deviceId by priority
  const deviceIdLocal: string | null = deviceId
    || deviceIdSession
    || urlData?.deviceId
    || localData?.deviceId
    || null;

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

        // Save deviceId to URL encrypted param
        setDataParam({ deviceId: deviceIdExists.device_id }, 'useURL');

        // Load initial sessions
        await fetchSessions(deviceIdExists.device_id, 1, 10, true);

        // Setup real-time subscription
        pb.collection('everspass_sessions').subscribe('*', (e) => {
          if (e.record.device_id !== deviceIdExists.device_id) return;
          fetchSessions(deviceIdExists.device_id, 1, 10, true);
        });
      } else {
        console.log('CLEAR')
        clearData();
      }

      setIsLoading(false);
    })();

    return () => {
      pb.collection('everspass_sessions').unsubscribe('*');
    };
  }, [deviceIdLocal, deviceId]);

  return { deviceId, setDeviceId, isLoading };
};

export default useRealtimeSessions;
