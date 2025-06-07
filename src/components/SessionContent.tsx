import { useState } from "react";
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

const SessionContent = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleBeginSession = () => {
    setIsDialogOpen(true);
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
            onClick={handleBeginSession}>
            Begin Session
          </Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={(e) => {
            e.preventDefault();
            console.log("Form submitted!");
            setIsDialogOpen(false);
          }}>
            <DialogHeader>
              <DialogTitle>Start New Session</DialogTitle>
              <DialogDescription>
                Enter the details for your new session here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name-1" className="text-right">Name</Label>
                <Input id="name-1" name="name" defaultValue="Hiking Trip" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username-1" className="text-right">Username</Label>
                <Input id="username-1" name="username" defaultValue="@urielcookies" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Create Session</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SessionContent;