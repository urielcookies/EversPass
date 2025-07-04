import { useEffect, useState, type FormEvent } from "react";
import { isEmpty, reduce } from "lodash-es";
import { CassetteTape, Copy, Folder, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SessionsTable from "./SessionsTable";
import { createSession, type SessionData } from "@/services/createSession";
import { type SessionRecord } from "@/services/loadSessions";
import { deleteSessionById } from "@/services/deleteSession";
import { getDataParam, setDataParam } from "@/lib/encryptRole";
import { navigate } from "astro:transitions/client";

interface LoadSessionContentProps {
  deviceId: string;
  sessions: SessionRecord[];
}

const LoadSessionContent = ({ deviceId, sessions }: LoadSessionContentProps) => {
  const [isCreationLoading, setIsCreationLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<SessionRecord | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState(() => {
    const localStorageData = getDataParam('useLocalStorage');
    const localDeviceId = localStorageData && localStorageData.deviceId;
    const _deviceId = deviceId || localDeviceId || crypto.randomUUID()
    return {
      deviceId: _deviceId,
      name: ""
    }
  });
  // const [form, setForm] = useState({
  //   deviceId,
  //   name: "",
  // });

    //   const localStorageData = getDataParam('useLocalStorage');
    // // const parsedLocalData = dataLocalParam ? JSON.parse(dataLocalParam) : null;
    // formStateHandler(
    //   'deviceId',
    //   localStorageData ? localStorageData.deviceId as string : crypto.randomUUID()
    // );

  const formStateHandler = (key: string, value: string) =>
    setForm((prevState) => ({
      ...prevState,
      [key]: value,
    }));

  const handleOpenCreateSessionDialog = () => {
    if (sessions.length >= 3) {
      alert('GET SUBSCRIPTION YOU BUM');
    } else {
      setIsDialogOpen(true);
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(form.deviceId || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const formSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data: SessionData = {
      device_id: form.deviceId,
      name: form.name,
    };
    setIsCreationLoading(true);
    await createSession(data);
    
    const localStorageData = getDataParam('useLocalStorage');
    if (!localStorageData?.deviceId) setDataParam({ deviceId: form.deviceId }, 'useLocalStorage');
  
    formStateHandler("name", "");
    setIsDialogOpen(false);
    setIsCreationLoading(false);
  };

  const handleOpenDeleteDialog = (session: SessionRecord) => {
    setSessionToDelete(session);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!sessionToDelete) return;
    try {
      await deleteSessionById(sessionToDelete.id);
      if (sessions.length === 1) {
        const localStorageData = getDataParam('useLocalStorage');
        if (!localStorageData) return;
        const { deviceId, ...rest } = localStorageData;
        setDataParam(rest, 'useLocalStorage');
      }
      console.log(sessions);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setSessionToDelete(null);
    }
  };

  const formatBytesToGB = (bytes: number) => {
    if (bytes === 0) return "0.00 GB";
    const gigabytes = bytes / 1024 ** 3;
    return gigabytes.toFixed(2);
  };

  const storageLimitGB = 2;
  const maxSessions = 3;
  const allSessionsSize = reduce(sessions, (total, { total_photos_bytes }) => total + total_photos_bytes, 0);
  const allSessionsSizeInGB = allSessionsSize / 1024 ** 3;
  const remainingGB = (storageLimitGB - allSessionsSizeInGB).toFixed(2);
  const sessionsRemaining = Math.max(0, maxSessions - sessions.length);
  const progressBarValue =
    storageLimitGB > 0
      ? Math.max(0, Math.min(100, (allSessionsSizeInGB / storageLimitGB) * 100))
      : 0;


  // const invitedSessions = () => {

  // };

  const localStorageData = getDataParam('useLocalStorage');
  const invitedSessions = localStorageData?.invitedSessions

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
    setKey(!key); // trigger rerender
  };

  const activeTab =
  !isEmpty(sessions)
    ? 'my-sessions'
    : !isEmpty(invitedSessions) && !isEmpty(Object.keys(invitedSessions))
    ? 'invited'
    : 'my-sessions';

  return (
    <Tabs defaultValue={activeTab} className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="my-sessions">My Sessions</TabsTrigger>
        <TabsTrigger value="invited">Invited</TabsTrigger>
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

        <SessionsTable sessions={sessions} onDeleteSession={handleOpenDeleteDialog} />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent
            className="sm:max-w-[600px]"
            hideClose={isCreationLoading}
            onInteractOutside={(e) => {
              if (isCreationLoading) e.preventDefault();
              else setIsDialogOpen(false);
            }}>
            <form autoComplete="off" onSubmit={formSubmitHandler}>
              <DialogHeader>
                <DialogTitle>Start New Session</DialogTitle>
                <DialogDescription>
                  Enter the details for your new session here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="session-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="session-name"
                    name="sessionName"
                    placeholder="Hiking Trip"
                    value={form.name}
                    autoComplete="off"
                    className="col-span-3"
                    onChange={(e) => formStateHandler("name", e.target.value)} />
                </div>
              </div>
              <DialogFooter className="flex-shrink-0 pt-4 flex gap-2 justify-end">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  variant="primary-cta"
                  disabled={isEmpty(form.name) || isCreationLoading}>
                  Create Session
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

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
      </TabsContent>

      {/* --- Invited Tab --- */}
      <TabsContent value="invited">
        {invitedSessions && Object.keys(invitedSessions).length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 cursor-pointer">
            {Object.entries(invitedSessions).map(([sessionId, sessionData]) => (
              <div
                key={sessionId}
                onClick={() => navigatePhotoHandler(sessionData.deviceId, sessionId, sessionData.roleId)}
                className="relative rounded-xl border p-4 bg-white dark:bg-slate-800 shadow-sm"
              >
                {/* Trash icon */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering navigatePhotoHandler
                    handleInvitedSession(sessionId);
                  }}
                  className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                  Session Name:
                </p>
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
        ) : (
          <div className="flex flex-col items-center justify-center h-48 border border-dashed rounded-lg p-6 text-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/20">
            <p className="text-lg font-medium mb-2">No Invited Sessions Yet</p>
            <p className="text-sm">
              This section will show sessions you've been invited to by other users.
            </p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default LoadSessionContent;
