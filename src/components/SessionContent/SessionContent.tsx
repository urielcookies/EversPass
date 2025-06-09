import { useEffect, useState } from 'react';
import { isEmpty } from 'lodash-es';
import checkDeviceIdExists from '@/services/checkDeviceIdExists';
import CreateSession from '@/components/SessionContent/CreateSession';
import LoadSession from '@/components/SessionContent/LoadSession';
import { loadSessionsByDeviceId, type SessionRecord } from '@/services/loadSessions';

const SessionContent = () => {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<SessionRecord[]>([]);

  const storageKey = {
    deviceId: 'eversPassDeviceId',
  };

  useEffect(() => {
    (async () => {
      // fetch sessions with deviceId from URL params or localstorage
      const deviceIdLocal = deviceId
        || localStorage.getItem(storageKey.deviceId)
        || new URLSearchParams(window.location.search).get(storageKey.deviceId);

      if (deviceIdLocal) {
        setDeviceId(deviceIdLocal);
        const deviceIdExists = await checkDeviceIdExists(deviceIdLocal)
        if (deviceIdExists?.exists) { // if exist, set BOTH URL params, localstorage (just incase), and fetch sessions
          localStorage.setItem(storageKey.deviceId, deviceIdExists.device_id);
          const currentUrl = new URL(window.location.href);
          currentUrl.searchParams.set(storageKey.deviceId, deviceIdExists.device_id)
          window.history.replaceState({ path: currentUrl.href }, '', currentUrl.href);
          
          const sessionsData = await loadSessionsByDeviceId(deviceIdExists.device_id);
          if (sessionsData && !isEmpty(sessionsData)) {
            setSessions(sessionsData);
          }
        } else { // else remove from URL params, localstorage, and change deviceId state
          localStorage.removeItem(storageKey.deviceId);
          const currentUrl = new URL(window.location.href);
          currentUrl.searchParams.delete('eversPassDeviceId');
          window.history.replaceState({}, '', currentUrl.href);
          setDeviceId(null);
        }
      }
    })()
  }, [deviceId]);

  return deviceId
    ? <LoadSession deviceId={deviceId} sessions={sessions} />
    : <CreateSession setDeviceId={setDeviceId} />;
};

export default SessionContent;
