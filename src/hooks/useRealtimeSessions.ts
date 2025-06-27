import { useEffect, useState } from "react";
import pb from "@/services/pocketbase";
import { fetchSessions } from '@/stores/sessionsStore'; 
import checkDeviceIdExists from "@/services/checkDeviceIdExists";

const storageKey = {
  deviceId: 'eversPassDeviceId',
};

const useRealtimeSessions = (deviceIdSession: string | null) => {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const clearData = () => {
    // localStorage.removeItem(storageKey.deviceId);
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete(storageKey.deviceId);
    window.history.replaceState({}, '', currentUrl.href);
    setDeviceId(null);
  };

  const deviceIdLocal = deviceId
    || deviceIdSession
    // || localStorage.getItem(storageKey.deviceId)
    || new URLSearchParams(window.location.search).get(storageKey.deviceId);

  useEffect(() => {
    (async () => {
      if (!deviceIdLocal) return;
      setIsLoading(true);
      const deviceIdExists = await checkDeviceIdExists(deviceIdLocal);

      if (deviceIdExists?.exists) {       
        // set localstorage, url params, and local state
        if (!deviceId) setDeviceId(deviceIdExists.device_id)
        // localStorage.setItem(storageKey.deviceId, deviceIdExists.device_id);
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set(storageKey.deviceId, deviceIdExists.device_id)
        window.history.replaceState({ path: currentUrl.href }, '', currentUrl.href);

        // Load initial data
        // await fetchSessions(deviceIdExists.device_id, true);
        await fetchSessions(deviceIdExists.device_id, 1, 10, true);

        // Setup real-time subscription
        pb.collection('everspass_sessions').subscribe('*', (e) => {
          if (e.record.device_id !== deviceIdExists.device_id) return; // ignore unrelated changes
          // fetchSessions(deviceIdExists.device_id, true); // only fetch if relevant
          fetchSessions(deviceIdExists.device_id, 1, 10, true);
        });
      } else { // if does not exist remove localstorage and url params
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
