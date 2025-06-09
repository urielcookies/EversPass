import { useEffect, useState, type FormEvent } from "react";
import { isEmpty, isNull } from "lodash-es";
import { Copy, PlusCircle, Trash2 } from "lucide-react";
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
import SessionsTable from "./SessionsTable";
import { createSession, type SessionData } from "@/services/createSession";
import { type SessionRecord } from "@/services/loadSessions";
import { deleteSessionById } from "@/services/deleteSession";

interface LoadSessionContentProps {
  deviceId: string;
  sessions: SessionRecord[]
}

const LoadSessionContent = ({ deviceId, sessions }: LoadSessionContentProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<SessionRecord | null>(null); 
  const [copied, setCopied] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({
    deviceId,
    name: '',
  });

  const formStateHandler = (key: string, value: string) =>
    setForm((prevState) => ({
      ...prevState,
      [key]: value
    }));

  const handleOpenCreateSessionDialog = () => setIsDialogOpen(true);

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

    await createSession(data);
    formStateHandler('name', '')
    setIsDialogOpen(false);
  };

  const handleOpenDeleteDialog = (session: SessionRecord) => {
    setSessionToDelete(session);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!sessionToDelete) return;

    try {
      deleteSessionById(sessionToDelete.id);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      // Close the dialog regardless of success or failure
      setIsDeleteDialogOpen(false);
      setSessionToDelete(null);
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Your Sessions
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            View and manage your active photo sharing sessions.
          </p>
        </div>
        <Button
          variant="primary-cta"
          size="lg"
          onClick={handleOpenCreateSessionDialog}>
          <PlusCircle className="mr-2 h-5 w-5" />
          Create Session
        </Button>
      </div>

      <SessionsTable sessions={sessions} onDeleteSession={handleOpenDeleteDialog} />

      {/* --- CREATE SESSSION DIALOG --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <form autoComplete="off" onSubmit={formSubmitHandler}>
            <DialogHeader>
              <DialogTitle>Create a New Session</DialogTitle>
              <DialogDescription>
                Give your new session a name to get started. It will expire automatically in 48 hours.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="device-id" className="text-right">Device ID</Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Input
                    id="device-id"
                    autoComplete="off"
                    value={form.deviceId}
                    disabled
                    className="text-xs text-slate-500" />
                  <Button type="button" variant="outline" size="icon" onClick={handleCopy}>
                    <Copy className={`h-4 w-4 transition-transform ${copied ? 'scale-125 text-green-500' : ''}`} />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="session-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="session-name"
                  name="sessionName"
                  placeholder="eg. John & Jane's Wedding"
                  value={form.name} 
                  autoComplete="off"
                  className="col-span-3"
                  onChange={(e) => formStateHandler('name', e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" variant="primary-cta" disabled={isEmpty(form.name)}>Create Session</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* --- DELETE CONFIRMATION DIALOG --- */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              session named <span className="font-semibold text-slate-900 dark:text-white">"{sessionToDelete?.name}"</span> and all of its data.
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
    </>
  );
};

export default LoadSessionContent;
