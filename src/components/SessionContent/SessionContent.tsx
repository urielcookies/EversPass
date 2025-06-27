import CreateSession from '@/components/SessionContent/CreateSession';
import LoadSession from '@/components/SessionContent/LoadSession';
import { useStore } from '@nanostores/react';
import { $sessions } from '@/stores/sessionsStore';
import useRealtimeSessions from '@/hooks/useRealtimeSessions';

const SessionContent = () => {
  const { sessions, deviceId: deviceIdSession } = useStore($sessions);
  const { deviceId, setDeviceId, isLoading } = useRealtimeSessions(deviceIdSession);
  console.log('sessions', sessions)
  if (isLoading) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-600 dark:text-slate-400">Loading Sessions...</p>
      </div>
    );
  }

  return deviceId
    ? <LoadSession deviceId={deviceId} sessions={sessions} />
    : <CreateSession setDeviceId={setDeviceId} />;
};

export default SessionContent;
