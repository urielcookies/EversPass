import CreateSession from '@/components/SessionContent/CreateSession';
import LoadSession from '@/components/SessionContent/LoadSession';
import { useStore } from '@nanostores/react';
import { $sessions } from '@/stores/sessionsStore';
import useRealtimeSessions from '@/hooks/useRealtimeSessions';
import usePurgeExpiredInvitedSessions from '@/hooks/usePurgeExpiredInvitedSessions';
import { getDataParam } from '@/lib/encryptRole';

const SessionContent = () => {
  const { sessions, deviceId: deviceIdSession } = useStore($sessions);
  const { deviceId, setDeviceId, isLoading } = useRealtimeSessions(deviceIdSession);

  usePurgeExpiredInvitedSessions();
  if (isLoading) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-600 dark:text-slate-400">Loading Sessions...</p>
      </div>
    );
  }

  const localStorageData = getDataParam('useLocalStorage');
  console.log('localStorageData-->>', localStorageData);

  return deviceId || localStorageData?.invitedSessions
    ? <LoadSession deviceId={deviceId} sessions={sessions} />
    : <CreateSession setDeviceId={setDeviceId} />;
};

export default SessionContent;
