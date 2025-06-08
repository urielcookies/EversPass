import { useEffect, useState, type FormEvent } from "react";
import { isEmpty } from "lodash-es";
import { Copy, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { loadSessionsByDeviceId, type SessionRecord } from "@/services/loadSessions";
import SessionsTable from "./SessionsTable";
import { createSession, type SessionData } from "@/services/createSession";

interface LoadSessionContentProps {
  deviceId: string;
  username: string;
}

const LoadSessionContent = ({ deviceId, username }: LoadSessionContentProps) => {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [copied, setCopied] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({
    deviceId,
    name: '',
    username,
  });

  useEffect(() => {
    (async () => {
      const sessionsData = await loadSessionsByDeviceId(deviceId);
      if (sessionsData) {
        setSessions(sessionsData);
      }
    })()
  }, []);

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

    setIsDialogOpen(false);

    const data: SessionData = {
      device_id: form.deviceId,
      name: form.name,
    };

    createSession(data);
  };

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

      <SessionsTable sessions={sessions} />

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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="device-id" className="text-right">Device ID</Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Input
                    id="device-id"
                    value={form.deviceId}
                    disabled
                    className="text-xs text-slate-500" />
                  <Button type="button" variant="outline" size="icon" onClick={handleCopy}>
                    <Copy className={`h-4 w-4 transition-transform ${copied ? 'scale-125 text-green-500' : ''}`} />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="device-id" className="text-right">Username</Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Input
                    id="device-id"
                    value={form.username}
                    disabled
                    className="text-xs text-slate-500" />
                </div>
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
    </>
  );
};

export default LoadSessionContent;
