import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { getDataParam, setDataParam } from "@/lib/encryptRole";
import { navigate } from "astro:transitions/client";

type SessionData = {
  sessionName: string;
  deviceId: string;
  roleId: 'VIEWER' | 'EDITOR' | 'OWNER';
  expire_at: string;
};

type InvitedSessionsGridProps = {
  invitedSessions: Record<string, SessionData> | null;
};

const InvitedSessionsGrid: React.FC<InvitedSessionsGridProps> = (props) => {
  const { invitedSessions } = props;
  const [key, setKey] = useState(false);
  const handleInvitedSession = (sessionId: string) => {
    const localStorageData = getDataParam('useLocalStorage');
    if (!localStorageData || !localStorageData.invitedSessions) return;

    const updatedInvitedSessions = { ...localStorageData.invitedSessions };
    delete updatedInvitedSessions[sessionId];

    const newData = { ...localStorageData };

    if (Object.keys(updatedInvitedSessions).length === 0) {
      delete newData.invitedSessions; // remove the key completely
    } else {
      newData.invitedSessions = updatedInvitedSessions;
    }

    setDataParam(newData, 'useLocalStorage');
    setKey(!key);
  };

  const navigatePhotoHandler = (deviceId: string, sessionId: string, roleId: 'VIEWER' | 'EDITOR' | 'OWNER') => {
    const encryptedValue = setDataParam({
      deviceId,
      sessionId,
      roleId,
    }, 'useURL');

    if (encryptedValue) {
      navigate(`/sessions/photos?data=${encryptedValue}`);
    } else {
      // Handle error case if needed
      console.error('Failed to encrypt data param');
    }
  };

  if (!invitedSessions || Object.keys(invitedSessions).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 border border-dashed rounded-lg p-6 text-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/20">
        <p className="text-lg font-medium mb-2">No Invited Sessions Yet</p>
        <p className="text-sm">
          This section will show sessions you've been invited to by other users.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 cursor-pointer">
      {Object.entries(invitedSessions).map(([sessionId, sessionData]) => (
        <div
          key={sessionId}
          onClick={() =>
            navigatePhotoHandler(sessionData.deviceId, sessionId, sessionData.roleId)
          }
          className="relative rounded-xl border p-4 bg-white dark:bg-slate-800 shadow-sm">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleInvitedSession(sessionId);
            }}
            className="absolute top-2 right-2 text-slate-400 hover:text-red-500">
            <Trash2 className="w-4 h-4" />
          </button>

          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Session Name:</p>
          <p className="font-semibold text-slate-700 dark:text-white break-all">
            {sessionData.sessionName}
          </p>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Role:</p>
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
            {sessionData.roleId}
          </p>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Expires At:</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {new Date(sessionData.expire_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default InvitedSessionsGrid;