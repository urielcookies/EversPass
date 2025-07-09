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
import NewSessionDialog from './NewSessionDialog';

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

      <NewSessionDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        sessionName={sessionName}
        setSessionName={setSessionName}
        isCreating={isCreationLoading}
        onSubmit={formSubmitHandler} />
    </>
  );
};

export default SessionContent;