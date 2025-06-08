import { useEffect, useState } from 'react';
import type { Dispatch, FormEvent, SetStateAction } from 'react';
import { isEmpty } from 'lodash-es';
import { Copy } from "lucide-react";
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

import { createSession, type SessionData } from '../../services/createSession';
interface SessionContentProps {
  setDeviceId: Dispatch<SetStateAction<string | null>>;
  storageKey: {
    deviceId: string;
    username: string;
  }
}

const SessionContent = ({ setDeviceId, storageKey }: SessionContentProps) => {
  const [copied, setCopied] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({
    deviceId: '',
    name: 'Hiking Trip',
    username: '@urielcookies',
  });

  useEffect(() => {
    if (!isDialogOpen) {
      resetForm();
    }
  }, [isDialogOpen]);

  const formStateHandler = (key: string, value: string) =>
    setForm((prevState) => ({
      ...prevState,
      [key]: value
    }));

  const openDialogHandler = () => {
    formStateHandler('deviceId', crypto.randomUUID());
    setIsDialogOpen(true);
  };

  const resetForm = () =>
    setForm({
      deviceId: '',
      name: '',
      username: '',
    })

  const handleCopy = () => {
    navigator.clipboard.writeText(form.deviceId || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const formSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsDialogOpen(false);
    setDeviceId(form.deviceId);
    localStorage.setItem(storageKey.deviceId, form.deviceId);
    localStorage.setItem(storageKey.username, form.username);

      const data: SessionData = {
        device_id: form.deviceId,
        name: form.name,
        expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      };

      createSession(data);
  };

  return (
    <>
      <div className="text-center">
        <h1 className="text-4xl font-bold">Create a New Session</h1>
        <p className="mt-4 text-lg">Click the button below to begin.</p>
        <div className="mt-8">
          <Button
            variant="primary-cta"
            size="lg"
            rounded="lg"
            onClick={openDialogHandler}>
            Begin Session
          </Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <form autoComplete="off" onSubmit={formSubmitHandler}>
            <DialogHeader>
              <DialogTitle>Start New Session</DialogTitle>
              <DialogDescription>
                Enter the details for your new session here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="device-1" className="text-right">Device Id</Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Input
                    id="device-1"
                    name="deviceId"
                    defaultValue={form.deviceId}
                    autoComplete="off"
                    disabled />
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-2 rounded hover:bg-muted transition">
                    <Copy className={`w-4 h-4 transition-colors ${copied ? 'text-green-500' : ''}`} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name-1" className="text-right">Session Name</Label>
                <Input
                  id="name-1"
                  name="name"
                  defaultValue={form.name}
                  autoComplete="off"
                  className="col-span-3"
                  onChange={(event) => formStateHandler(event.target.name, event.target.value)} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username-1" className="text-right">Username</Label>
                <Input
                  id="username-1"
                  name="username"
                  defaultValue={form.username}
                  autoComplete="off"
                  className="col-span-3"
                  onChange={(event) => formStateHandler(event.target.name, event.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" variant="primary-cta" disabled={isEmpty(form.name)}>Create Session</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SessionContent;