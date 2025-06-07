import { useEffect, useState } from 'react';
import CreateSession from '../SessionContent/CreateSession';
import LoadSession from '../SessionContent/LoadSession';

const SessionContent = () => {
  const [deviceId, setDeviceId] = useState<string | null>(null);

  const storageKey = {
    deviceId: 'eversPassDeviceId',
    username: 'eversPassUsername'
  };

  useEffect(() => {
    const storageKey = 'eversPassDeviceId';
    const id = localStorage.getItem(storageKey);
    setDeviceId(id);
  }, []);

  return deviceId
    ? <LoadSession storageKey={storageKey} />
    : <CreateSession storageKey={storageKey} setDeviceId={setDeviceId} />;
};

export default SessionContent;
