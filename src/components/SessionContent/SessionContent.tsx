import { useEffect, useState } from 'react';
import CreateSession from '../SessionContent/CreateSession';
import LoadSession from '../SessionContent/LoadSession';

const SessionContent = () => {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  const storageKey = {
    deviceId: 'eversPassDeviceId',
    username: 'eversPassUsername'
  };

  useEffect(() => {
    const _deviceId = localStorage.getItem(storageKey.deviceId);
    const _username = localStorage.getItem(storageKey.username);
    setDeviceId(_deviceId);
    setUsername(_username);
  }, []);

  return deviceId && username
    ? <LoadSession deviceId={deviceId} username={username} />
    : <CreateSession storageKey={storageKey} setDeviceId={setDeviceId} />;
};

export default SessionContent;
