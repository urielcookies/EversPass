import { useState } from "react";
import type { Dispatch, SetStateAction } from 'react';
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

interface LoadSessionContentProps {
  storageKey: {
    deviceId: string;
    username: string;
  }
}

const LoadSessionContent = ({ storageKey }: LoadSessionContentProps) => {
  const [copied, setCopied] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({
    deviceId: '',
    username: '',
  });

  const formHandler = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleLoadSession = () => {
    const deviceId = localStorage.getItem(storageKey.deviceId) || '';
    const storedUsername = localStorage.getItem(storageKey.username) || '';

    setForm({
      deviceId,
      username: storedUsername,
    });

    setIsDialogOpen(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(form.deviceId || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <>
      <div className="text-center">
        <h1 className="text-4xl font-bold">Load Your Session</h1>
        <p className="mt-4 text-lg">Click below to load your previous session.</p>
        <div className="mt-8">
          <Button
            variant="secondary"
            size="lg"
            onClick={handleLoadSession}>
            Load Session
          </Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Load Session</DialogTitle>
            <DialogDescription>
              Review your saved session info below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="device-id" className="text-right">Device Id</Label>
              <div className="col-span-3 flex items-center gap-2">
                <Input
                  id="device-id"
                  name="deviceId"
                  value={form.deviceId}
                  autoComplete="off"
                  disabled
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-2 rounded hover:bg-muted transition"
                >
                  <Copy className={`w-4 h-4 transition-colors ${copied ? 'text-green-500' : ''}`} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">Username</Label>
              <Input
                id="username"
                name="username"
                value={form.username}
                autoComplete="off"
                className="col-span-3"
                onChange={(e) => formHandler('username', e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoadSessionContent;