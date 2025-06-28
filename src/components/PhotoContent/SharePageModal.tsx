import { useState, useEffect } from 'react';
import { Copy } from 'lucide-react';
import qrcode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface SharePageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SharePageModal = ({ isOpen, onClose }: SharePageModalProps) => {
  const [shareUrl, setShareUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [accessLevel, setAccessLevel] = useState('viewer'); // default to Viewer

  // Update shareUrl when modal opens, using everspass.com host
  useEffect(() => {
    if (isOpen) {
      const url = new URL(window.location.href);
      url.hostname = 'everspass.com';
      url.protocol = 'https:';
      url.port = '';
      setShareUrl(url.toString());
    }
  }, [isOpen]);

  // Generate QR code when shareUrl changes
  useEffect(() => {
    const generateQr = async () => {
      if (shareUrl) {
        try {
          const url = await qrcode.toDataURL(shareUrl, {
            errorCorrectionLevel: 'H',
            width: 200,
            margin: 1,
          });
          setQrCodeDataUrl(url);
        } catch (err) {
          console.error('Failed to generate QR code:', err);
          setQrCodeDataUrl(null);
        }
      } else {
        setQrCodeDataUrl(null);
      }
    };
    generateQr();
  }, [shareUrl]);

  // Copy shareUrl to clipboard
  const handleCopy = async () => {
    if (shareUrl) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text:', err);
        alert('Failed to copy URL. Please try manually.');
      }
    }
  };

  const accessMessages: Record<string, string> = {
    viewer: 'Viewer: basic access, can view the content.',
    editor: 'Editor: can upload and delete images.',
    owner: 'Owner: full control, including managing sessions and settings.',
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share This Page</DialogTitle>
          <DialogDescription>
            Scan the QR code or copy the link to share the current page.
          </DialogDescription>
        </DialogHeader>

        {/* Access Level Toggle + Description (MOVED TO TOP) */}
        <div className="flex flex-col items-center gap-2 py-4">
          <p className="text-sm font-medium text-muted-foreground">Grant access as:</p>
          <ToggleGroup
            type="single"
            value={accessLevel}
            onValueChange={(value) => value && setAccessLevel(value)}
            aria-label="Select access level"
            className="flex-wrap justify-center" // Allow wrapping on small screens
          >
            <ToggleGroupItem value="viewer" aria-label="Viewer access">
              Viewer
            </ToggleGroupItem>
            <ToggleGroupItem value="editor" aria-label="Editor access">
              Editor
            </ToggleGroupItem>
            <ToggleGroupItem value="owner" aria-label="Owner access">
              Owner
            </ToggleGroupItem>
          </ToggleGroup>

          <p className="mt-2 text-xs text-center text-slate-500 dark:text-slate-400 max-w-xs leading-snug">
            {accessMessages[accessLevel]}
          </p>
        </div>

        {/* QR Code Display (Now BELOW access level) */}
        <div className="flex justify-center p-4">
          {qrCodeDataUrl ? (
            <img
              src={qrCodeDataUrl}
              alt="QR Code for current page"
              width={200}
              height={200}
              className="rounded-md"
            />
          ) : (
            <div className="w-[200px] h-[200px] bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm text-slate-500 rounded-md">
              Loading QR...
            </div>
          )}
        </div>

        {/* URL Input Field with Copy Button */}
        <div className="flex items-center space-x-2">
          <Input
            id="share-link"
            value={shareUrl}
            disabled
            autoComplete="off"
            className="text-xs"
          />
          <Button type="button" variant="outline" size="icon" onClick={handleCopy}>
            <Copy
              className={`h-4 w-4 transition-transform ${
                isCopied ? 'scale-125 text-green-500' : ''
              }`}
            />
            <span className="sr-only">Copy link</span>
          </Button>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SharePageModal;