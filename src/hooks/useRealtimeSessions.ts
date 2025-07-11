import { useEffect, useMemo, useRef, useState } from "react";
import { isEqual, isUndefined } from "lodash-es";
import pb from "@/services/pocketbase";
import { fetchSessions } from '@/stores/sessionsStore'; 
import checkDeviceIdExists from "@/services/checkDeviceIdExists";
import { getDataParam, setDataParam, updateLocalSessionData } from "@/lib/encryptRole";
import { useStore } from '@nanostores/react';
import { $sessions } from '@/stores/sessionsStore';

const useRealtimeSessions = () => {
  const { sessions, deviceId: stateDeviceId } = useStore($sessions);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCreatedSessionBefore, setHasCreatedSessionBefore] = useState(() => {
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
    const urlData = getDataParam('useURL');
    const localData = getDataParam('useLocalStorage');

    const finalId = urlData?.deviceId || localData?.deviceId || crypto.randomUUID();

    if (!isEqual(localData?.deviceId, finalId)) {
      updateLocalSessionData({ deviceId: finalId });
    }

    return finalId;
  }, []);

  const setHasCreatedSessionTrueHandler = () => {
    setHasCreatedSessionBefore(true);
    updateLocalSessionData({ hasCreatedSessionBefore: true });
  };

  const clearData = () => {
    const currentUrl = new URL(window.location.href);
    currentUrl.search = '';
    window.history.replaceState({}, '', currentUrl.toString());
  };

  useEffect(() => {
    (async () => {
      if (stateDeviceId) setDataParam({ deviceId: stateDeviceId }, 'useURL');
      if (!hasCreatedSessionBefore || sessions.length > 0) return;
      setIsLoading(true);

      const deviceIdExists = await checkDeviceIdExists(deviceId);

      if (deviceIdExists?.exists) {

        // Save deviceId to URL encrypted param
        setDataParam({ deviceId: deviceIdExists.device_id }, 'useURL');

        // Load initial sessions
        await fetchSessions(deviceIdExists.device_id, 1, 10, true);

        // Will need to delete in future if no problems
        // // Setup real-time subscription
        // pb.collection('everspass_sessions').subscribe('*', (e) => {
        //   if (!isEqual(e.record.device_id, deviceIdExists.device_id)) return;
        //   fetchSessions(deviceIdExists.device_id, 1, 10, true);
        // });
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
  }, [hasCreatedSessionBefore, sessions.length]);

  return { deviceId, isLoading, hasCreatedSessionBefore, setHasCreatedSessionTrueHandler };
};

export default useRealtimeSessions;
