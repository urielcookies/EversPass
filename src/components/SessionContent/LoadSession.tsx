import { useState, type FormEvent } from "react";
import { isEmpty, reduce } from "lodash-es";
import { CassetteTape, Folder, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SessionsTable from "./SessionsTable";
import { createSession, type SessionData } from "@/services/createSession";
import { type SessionRecord } from "@/services/loadSessions";
import { deleteSessionById } from "@/services/deleteSession";
import { getDataParam, setDataParam } from "@/lib/encryptRole";
import { maxSessions, storageLimitGB } from "@/lib/constants";
import InvitedSessionsGrid from "./InvitedSessions";
import NewSessionDialog from "./NewSessionDialog";
import { navigate } from "astro:transitions/client";
import type { User } from '@/types/user';


interface LoadSessionContentProps {
  deviceId: string;
  sessions: SessionRecord[];
  user: User | null;
}

const LoadSessionContent = ({ deviceId, sessions, user }: LoadSessionContentProps) => {
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  const [isCreationLoading, setIsCreationLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSessionDeleting, setIsSessionDeleting] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<SessionRecord | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sessionName, setSessionName] = useState('');
  const [key, setKey] = useState(false);

  const handleOpenCreateSessionDialog = () => {
    if (sessions.length >= maxSessions) {
      setShowLimitAlert(true);
    } else {
      setIsDialogOpen(true);
    }
  };

  const formSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data: SessionData = {
      device_id: deviceId,
      name: sessionName,
    };
    setIsCreationLoading(true);
    await createSession(data);

    setIsCreationLoading(false);
    setIsDialogOpen(false);
    setSessionName('');
  };

  const handleOpenDeleteDialog = (session: SessionRecord) => {
    setSessionToDelete(session);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!sessionToDelete) return;
    try {
      setIsSessionDeleting(true);
      await deleteSessionById(sessionToDelete.id);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setSessionToDelete(null);
      setIsSessionDeleting(false);
    }
  };

  const formatBytesToGB = (bytes: number) => {
    if (bytes === 0) return "0.00 GB";
    const gigabytes = bytes / 1024 ** 3;
    return gigabytes.toFixed(2);
  };

  const allSessionsSize = reduce(sessions, (total, { total_photos_bytes }) => total + total_photos_bytes, 0);
  const allSessionsSizeInGB = allSessionsSize / 1024 ** 3;
  const remainingGB = (storageLimitGB - allSessionsSizeInGB).toFixed(2);
  const sessionsRemaining = Math.max(0, maxSessions - sessions.length);
  const progressBarValue =
    storageLimitGB > 0
      ? Math.max(0, Math.min(100, (allSessionsSizeInGB / storageLimitGB) * 100))
      : 0;

  // Only get localStorage data if user is not logged in
  const localStorageData = !user ? getDataParam('useLocalStorage') : null;
  const invitedSessions = localStorageData?.invitedSessions || null;

  const activeTab =
    !isEmpty(sessions)
      ? 'my-sessions'
      : !user && !isEmpty(invitedSessions) && !isEmpty(Object.keys(invitedSessions))
      ? 'invited'
      : 'my-sessions';

  return (
    <Tabs defaultValue={activeTab} className="w-full">
      <TabsList className="mb-6 w-full lg:w-1/2">
        <TabsTrigger value="my-sessions" className="flex-1">
          My Sessions
        </TabsTrigger>
        {/* Only show invited tab for anonymous users */}
        {!user && (
          <TabsTrigger value="invited" className="flex-1">
            Invited
          </TabsTrigger>
        )}
      </TabsList>

      {/* --- My Sessions Tab --- */}
      <TabsContent value="my-sessions" className="space-y-8">
        <header className="flex flex-col gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-col items-center sm:flex-row sm:items-start sm:justify-between gap-6">
            <div className="flex-grow text-center sm:text-left">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Your Sessions
              </h1>

              <div className="mt-2 flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-start gap-1.5 justify-center sm:justify-normal">
                  <Folder className="h-4 w-4 shrink-0" />
                  <span>
                    {sessions.length} sessions of {maxSessions} total
                  </span>
                  <span className="ml-1 whitespace-nowrap">({sessionsRemaining} remaining)</span>
                </div>

                <div className="flex items-start gap-1.5 justify-center sm:justify-normal">
                  <CassetteTape className="h-4 w-4 shrink-0" />
                  <span className="font-semibold whitespace-nowrap">
                    {formatBytesToGB(allSessionsSize)} GB
                  </span>
                  <span className="whitespace-nowrap"> of {storageLimitGB} GB used</span>
                  <span className="ml-1 whitespace-nowrap">({remainingGB} GB remaining)</span>
                </div>
              </div>

              <div className="mt-4 w-full sm:max-w-sm mx-auto sm:mx-0">
                <div className="flex items-center justify-between gap-2">
                  <Progress value={progressBarValue} className="flex-grow" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {progressBarValue.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="inline-flex flex-col items-stretch gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
              <div className="flex items-center justify-center w-full">
                <Button
                  variant="primary-cta"
                  size="lg"
                  onClick={handleOpenCreateSessionDialog}
                  className="w-full">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Create Session
                </Button>
              </div>
            </div>
          </div>
        </header>

        <SessionsTable
          sessions={sessions}
          isSessionDeleting={isSessionDeleting}
          onDeleteSession={handleOpenDeleteDialog}
          user={user} />

        <NewSessionDialog
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          sessionName={sessionName}
          setSessionName={setSessionName}
          isCreating={isCreationLoading}
          onSubmit={formSubmitHandler} />

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the session named{" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  "{sessionToDelete?.name}"
                </span>{" "}
                and all of its data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800">
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={showLimitAlert} onOpenChange={setShowLimitAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Session Limit Reached</AlertDialogTitle>
              <AlertDialogDescription>
                To have more than 3 sessions, you need to upgrade to a subscription plan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button variant="primary-cta" onClick={() => navigate('/pricing')}>
                  Upgrade
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TabsContent>

      {/* --- Invited Tab (only for anonymous users) --- */}
      {!user && (
        <TabsContent value="invited">
        <InvitedSessionsGrid
          invitedSessions={invitedSessions}
          setKey={() => setKey(!key)} />
      </TabsContent>
      )}
    </Tabs>
  );
};

export default LoadSessionContent;
