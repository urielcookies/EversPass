import { useEffect, useMemo, useRef, useState } from "react";
import { isEqual, isUndefined } from "lodash-es";
import pb from "@/services/pocketbase";
import { fetchSessions } from '@/stores/sessionsStore'; 
import checkDeviceIdExists from "@/services/checkDeviceIdExists";
import { getDataParam, setDataParam, updateLocalSessionData } from "@/lib/encryptRole";
import { useStore } from '@nanostores/react';
import { $sessions } from '@/stores/sessionsStore';

interface User {
  id: string;
}

const useRealtimeSessions = (user: User | null = null) => {
  const { sessions, deviceId: stateDeviceId } = useStore($sessions);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCreatedSessionBefore, setHasCreatedSessionBefore] = useState(() => {
    // If user is logged in, check their database records instead
    if (user) {
      return true; // Or fetch from user's database
    }

    const localData = getDataParam('useLocalStorage');
    const urlData = getDataParam('useURL');

    const invited = !isUndefined(localData?.invitedSessions);
    const sharedLink = Boolean(urlData?.deviceId);
    const created = Boolean(localData?.hasCreatedSessionBefore);

    const hasCreated = created || invited || sharedLink;

    updateLocalSessionData({ hasCreatedSessionBefore: hasCreated });

    return hasCreated;
  });

  const deviceId = useMemo(() => {
    // For logged in users, use their user ID or a consistent identifier
    if (user) {
      return user.id; // or some other consistent identifier
    }

    const urlData = getDataParam('useURL');
    const localData = getDataParam('useLocalStorage');

    const finalId = urlData?.deviceId || localData?.deviceId || crypto.randomUUID();

    if (!isEqual(localData?.deviceId, finalId)) {
      updateLocalSessionData({ deviceId: finalId });
    }

    return finalId;
  }, [user]);

  const setHasCreatedSessionTrueHandler = () => {
    setHasCreatedSessionBefore(true);
    // Only update localStorage if user is not logged in
    if (!user) {
      updateLocalSessionData({ hasCreatedSessionBefore: true });
    }
  };

  const clearData = () => {    
    const currentUrl = new URL(window.location.href);
    currentUrl.search = '';
    window.history.replaceState({}, '', currentUrl.toString());
  };

  useEffect(() => {
    (async () => {
      // Skip URL param setting if user is logged in
      if (user) clearData();
      if (stateDeviceId && !user) {
        setDataParam({ deviceId: stateDeviceId }, 'useURL');
      }
      
      if (!hasCreatedSessionBefore || sessions.length > 0) return;
      setIsLoading(true);

      const deviceIdExists = await checkDeviceIdExists(deviceId);

      if (deviceIdExists?.exists) {
        // Only save to URL if user is not logged in
        if (!user) {
          setDataParam({ deviceId: deviceIdExists.device_id }, 'useURL');
        }

        // Load initial sessions
        await fetchSessions(deviceIdExists.device_id, 1, 10, true);
      } else {
        clearData();
      }

      setIsLoading(false);
    })();

    // Setup real-time subscription
    pb.collection('everspass_sessions').subscribe('*', (e) => {
      if (!isEqual(e.record.device_id, deviceId)) return;
      fetchSessions(deviceId, 1, 10, true);
    });

    return () => {
      pb.collection('everspass_sessions').unsubscribe('*');
    };
  }, [hasCreatedSessionBefore, sessions.length, user]);

  return { deviceId, isLoading, hasCreatedSessionBefore, setHasCreatedSessionTrueHandler };
};

export default useRealtimeSessions;
