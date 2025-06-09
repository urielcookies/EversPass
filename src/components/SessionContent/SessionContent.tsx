import CreateSession from '@/components/SessionContent/CreateSession';
import LoadSession from '@/components/SessionContent/LoadSession';
import { useStore } from '@nanostores/react';
import { $sessions } from '@/stores/sessionsStore';
import useRealtimeSessions from '@/hooks/useRealtimeSessions';

const SessionContent = () => {
  const { sessions, deviceId: deviceIdSession } = useStore($sessions);
  const { deviceId, setDeviceId } = useRealtimeSessions(deviceIdSession);

  return deviceId
    ? <LoadSession deviceId={deviceId} sessions={sessions} />
    : <CreateSession setDeviceId={setDeviceId} />;
};

export default SessionContent;
