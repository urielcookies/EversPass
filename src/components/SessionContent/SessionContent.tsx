import { useEffect, useState } from 'react';
import CreateSession from '../SessionContent/CreateSession';
import LoadSession from '../SessionContent/LoadSession';
import checkDeviceIdExists from '@/services/checkDeviceIdExists';
import { isNull } from 'lodash-es';

const SessionContent = () => {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  const storageKey = {
    deviceId: 'eversPassDeviceId',
    username: 'eversPassUsername'
  };

  useEffect(() => {
    (async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const deviceIdParams = queryParams.get('deviceId');
      const usernameParams = queryParams.get('username');

      if (!isNull(deviceIdParams)) {
        const deviceIdExists = await checkDeviceIdExists(deviceIdParams)
        if (deviceIdExists?.exists) {
          setDeviceId(deviceIdExists.device_id)
          setUsername(usernameParams)
        }
      }

      if (deviceId && username) {
        // may need to encrypt this
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('deviceId', deviceId)
        currentUrl.searchParams.set('username', username)
        window.history.replaceState({ path: currentUrl.href }, '', currentUrl.href);
      }
    })()
  }, [deviceId, username]);

  return (deviceId && username)
    ? <LoadSession deviceId={deviceId} username={username} />
    : <CreateSession setDeviceId={setDeviceId} setUsername={setUsername} />;
};

export default SessionContent;
