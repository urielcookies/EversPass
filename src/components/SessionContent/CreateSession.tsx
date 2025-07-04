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

import { createSession, type SessionData } from '@/services/createSession';
import { getDataParam, getDecryptedParam, setDataParam, setEncryptedParam } from '@/lib/encryptRole';
interface SessionContentProps {
  setDeviceId: Dispatch<SetStateAction<string | null>>;
}

const SessionContent = ({ setDeviceId }: SessionContentProps) => {
  const [isCreationLoading, setIsCreationLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({
    deviceId: '',
    name: '',
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
    // const dataLocalParam = getDecryptedParam({ key: 'data', options: { useLocalStorage: true } });
    const localStorageData = getDataParam('useLocalStorage');
    console.log((localStorageData && localStorageData.deviceId) ? localStorageData.deviceId : crypto.randomUUID())
    // const parsedLocalData = dataLocalParam ? JSON.parse(dataLocalParam) : null;
    formStateHandler(
      'deviceId',
      (localStorageData && localStorageData.deviceId) ? localStorageData.deviceId : crypto.randomUUID()
    );
    setIsDialogOpen(true);
  };

  const resetForm = () =>
    setForm({
      deviceId: '',
      name: '',
    })

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

    setIsCreationLoading(true)
    await createSession(data);
    setIsCreationLoading(false)
    setIsDialogOpen(false);
    setDeviceId(form.deviceId);

    const localStorageData = getDataParam('useLocalStorage');
    if (!localStorageData?.deviceId) setDataParam({ deviceId: form.deviceId }, 'useLocalStorage');

    // const jsonString = JSON.stringify({
    //   deviceId: form.deviceId
    // });

    // setEncryptedParam({
    //   key: 'data',
    //   value: jsonString,
    //   mode: 'useLocalStorage'
    // });

    resetForm();
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
        <DialogContent
          hideClose={isCreationLoading}
          className="sm:max-w-[600px]"
          onInteractOutside={e => {
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
              {/* <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="device-1" className="text-right">Device Id</Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Input
                    id="device-1"
                    name="deviceId"
                    value={form.deviceId}
                    autoComplete="off"
                    disabled />
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-2 rounded hover:bg-muted transition">
                    <Copy className={`w-4 h-4 transition-colors ${copied ? 'text-green-500' : ''}`} />
                  </button>
                </div>
              </div> */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name-1" className="text-right">Session Name</Label>
                <Input
                  id="name-1"
                  name="name"
                  value={form.name}
                  placeholder="Hiking Trip"
                  autoComplete="off"
                  className="col-span-3"
                  onChange={(event) => formStateHandler(event.target.name, event.target.value)} />
              </div>
            </div>
            <DialogFooter className="flex-shrink-0 pt-4 flex gap-2 justify-end">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                type="submit"
                variant="primary-cta"
                loading={isCreationLoading}
                disabled={isEmpty(form.name) || isCreationLoading}>
                Create Session
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SessionContent;