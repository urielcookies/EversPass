import { type FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { isEmpty } from "lodash-es";

type NewSessionDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  sessionName: string;
  setSessionName: (name: string) => void;
  isCreating: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

const NewSessionDialog: React.FC<NewSessionDialogProps> = ({
  isOpen,
  setIsOpen,
  sessionName,
  setSessionName,
  isCreating,
  onSubmit,
}) => (
  <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogContent
      hideClose={isCreating}
      className="sm:max-w-[600px]"
      onInteractOutside={(e) => {
        if (isCreating) e.preventDefault();
        else setIsOpen(false);
      }}>
      <form autoComplete="off" onSubmit={onSubmit}>
        <DialogHeader>
          <DialogTitle>Start New Session</DialogTitle>
          <DialogDescription>
            Enter the details for your new session here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="session-name" className="text-right">
              Session Name
            </Label>
            <Input
              id="session-name"
              name="name"
              value={sessionName}
              placeholder="Hiking Trip"
              autoComplete="off"
              className="col-span-3"
              onChange={(e) => setSessionName(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 pt-4 flex gap-2 justify-end">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            variant="primary-cta"
            loading={isCreating}
            disabled={isEmpty(sessionName) || isCreating}>
            Create Session
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
);

export default NewSessionDialog;