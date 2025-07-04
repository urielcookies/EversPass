import { useEffect, useState } from 'react';
import type { Dispatch, FormEvent, SetStateAction } from 'react';
import { isEmpty } from 'lodash-es';
import { setDataParam } from '@/lib/encryptRole';
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

interface SessionContentProps {
  deviceId: string;
  setHasCreatedSessionTrueHandler: () => void;
}

const SessionContent = ({ deviceId, setHasCreatedSessionTrueHandler }: SessionContentProps) => {
  const [isCreationLoading, setIsCreationLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sessionName, setSessionName] = useState('');

  useEffect(() => {
    if (!isDialogOpen) {
      resetForm();
    }
  }, [isDialogOpen]);

  const resetForm = () => setSessionName('');

  const formSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data: SessionData = {
      device_id: deviceId,
      name: sessionName,
    };

    setIsCreationLoading(true)
    await createSession(data);
    setDataParam({ deviceId }, 'useURL');
    setHasCreatedSessionTrueHandler()
    setIsCreationLoading(false)
    setIsDialogOpen(false);
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
            onClick={() => setIsDialogOpen(true)}>
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name-1" className="text-right">Session Name</Label>
                <Input
                  id="name-1"
                  name="name"
                  value={sessionName}
                  placeholder="Hiking Trip"
                  autoComplete="off"
                  className="col-span-3"
                  onChange={(event) => setSessionName(event.target.value)} />
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
                disabled={isEmpty(sessionName) || isCreationLoading}>
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