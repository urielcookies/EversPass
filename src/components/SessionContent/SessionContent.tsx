import CreateSession from '@/components/SessionContent/CreateSession';
import LoadSession from '@/components/SessionContent/LoadSession';
import { useStore } from '@nanostores/react';
import { $sessions } from '@/stores/sessionsStore';
import useRealtimeSessions from '@/hooks/useRealtimeSessions';
import usePurgeExpiredInvitedSessions from '@/hooks/usePurgeExpiredInvitedSessions';


const SessionContent = () => {
  const { sessions } = useStore($sessions);
  const {
    deviceId,
    isLoading,
    hasCreatedSessionBefore,
    setHasCreatedSessionTrueHandler
  } = useRealtimeSessions();

  usePurgeExpiredInvitedSessions();

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-600 dark:text-slate-400">Loading Sessions...</p>
      </div>
    );
  }

  return hasCreatedSessionBefore
    ? <LoadSession deviceId={deviceId} sessions={sessions} />
    : <CreateSession
      deviceId={deviceId}
      setHasCreatedSessionTrueHandler={setHasCreatedSessionTrueHandler} />;
};

export default SessionContent;
