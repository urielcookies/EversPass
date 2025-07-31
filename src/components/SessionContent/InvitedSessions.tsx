import { Trash2 } from "lucide-react";
import { getDataParam, setDataParam, updateLocalSessionData } from "@/lib/encryptRole";
import { navigate } from "astro:transitions/client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import type { User } from "@/types/user";

type SessionData = {
  sessionName: string;
  deviceId: string;
  roleId: "VIEWER" | "EDITOR" | "OWNER";
  expire_at: string;
};

type InvitedSessionsGridProps = {
  invitedSessions: Record<string, SessionData> | null;
  setKey: () => void;
  user : User | null;
};

const InvitedSessionsGrid: React.FC<InvitedSessionsGridProps> = (props) => {
  const { invitedSessions, setKey, user } = props;

  const handleInvitedSession = (sessionId: string) => {
    const data = getDataParam("useLocalStorage");
    if (!data?.invitedSessions) return;

    const updatedInvitedSessions = { ...data.invitedSessions };
    delete updatedInvitedSessions[sessionId];

    updateLocalSessionData({
      invitedSessions: updatedInvitedSessions,
    });

    setKey(); // Force re-render
  };

  const navigatePhotoHandler = (
    deviceId: string,
    sessionId: string,
    roleId: "VIEWER" | "EDITOR" | "OWNER",
  ) => {
    const encryptedValue = setDataParam(
      {
        deviceId,
        sessionId,
        roleId,
      },
      "useURL"
    );

    if (encryptedValue) {
      if (user) navigate(`/app/sessions/photos/${sessionId}?data=${encryptedValue}`);
      else navigate(`/sessions/photos?data=${encryptedValue}`);
      
    } else {
      console.error("Failed to encrypt data param");
    }
  };

  const hasInvitedSessions = invitedSessions && Object.keys(invitedSessions).length > 0;

  return (
    <div className="space-y-8">
      <header className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Invited Sessions
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Sessions you've been invited to view or edit by other users.
        </p>
      </header>

      {hasInvitedSessions ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Object.entries(invitedSessions).map(([sessionId, sessionData]) => (
            <Card
              key={sessionId}
              className="relative flex flex-col justify-between hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-bold text-slate-800 dark:text-white break-all pr-8">
                    {sessionData.sessionName}
                  </CardTitle>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInvitedSession(sessionId);
                    }}
                    className="text-slate-400 hover:text-red-500 transition-colors duration-200"
                    aria-label="Remove session">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                  Invited Session
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Role:
                  </p>
                  <p
                    className={`text-base font-semibold ${
                      sessionData.roleId === "OWNER"
                        ? "text-red-600 dark:text-red-400"
                        : sessionData.roleId === "EDITOR"
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-green-600 dark:text-green-400"
                    }`}>
                    {sessionData.roleId}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Expires:
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {new Date(sessionData.expire_at).toLocaleString()}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="pt-4">
                <Button
                  onClick={() => {
                    navigatePhotoHandler(
                      sessionData.deviceId,
                      sessionId,
                      sessionData.roleId
                    )
                  }}
                  variant="primary-cta"
                  className="w-full"
                >
                  View Session
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-48 border border-dashed rounded-lg p-6 text-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/20">
          <p className="text-lg font-medium mb-2">No Invited Sessions Yet</p>
          <p className="text-sm">
            This section will show sessions you've been invited to by other users.
          </p>
        </div>
      )}
    </div>
  );
};

export default InvitedSessionsGrid;