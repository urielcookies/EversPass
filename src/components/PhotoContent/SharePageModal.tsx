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
import { isEmpty, isEqual } from 'lodash-es';
import { setDataParam, setEncryptedParam } from '@/lib/encryptRole';
import { SITE_URL } from '@/lib/constants';
import { shortenUrl } from '@/services/shortenUrl';

interface SharePageModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  sessionName: string;
  expireAt: string;
  roleId: 'VIEWER' | 'EDITOR' | 'OWNER';
  deviceId: string;
}


const SharePageModal = ({
  isOpen,
  onClose,
  sessionId,
  sessionName,
  expireAt,
  roleId,
  deviceId
}: SharePageModalProps) => {
  const [shareUrl, setShareUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isShortening, setIsShortening] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [accessLevel, setAccessLevel] = useState<'VIEWER' | 'EDITOR' | 'OWNER'>('VIEWER');

  // Update shareUrl when modal opens, including session name and expiry
  useEffect(() => {
    if (isOpen) {
      const encryptedValue = setDataParam({
        sessionId,
        sessionName,
        expire_at: expireAt,
        roleId: accessLevel,
        deviceId,
      });

      const fullUrl = `${SITE_URL}/sessions/photos?data=${encryptedValue}`;
      setShareUrl(fullUrl);
      setShortUrl('');
      setIsShortening(true);

      shortenUrl(fullUrl)
        .then(setShortUrl)
        .catch(() => setShortUrl(fullUrl))
        .finally(() => setIsShortening(false));
    }
  }, [isOpen, sessionId, sessionName, expireAt, accessLevel, deviceId]);

  // Generate QR code when shortUrl (or fallback shareUrl) changes
  useEffect(() => {
    const urlToEncode = shortUrl || shareUrl;
    const generateQr = async () => {
      if (urlToEncode) {
        try {
          const url = await qrcode.toDataURL(urlToEncode, {
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
  }, [shortUrl, shareUrl]);

  useEffect(() => {
    if (!isOpen) {
      setShareUrl('');
      setShortUrl('');
      setIsShortening(false);
      setAccessLevel('VIEWER');
      setQrCodeDataUrl(null);
    }
  }, [isOpen]);

  // Copy shortUrl (or fallback shareUrl) to clipboard
  const handleCopy = async () => {
    const urlToCopy = shortUrl || shareUrl;
    if (urlToCopy) {
      try {
        await navigator.clipboard.writeText(urlToCopy);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch {
        alert('Failed to copy URL. Please try manually.');
      }
    }
  };

  const accessMessages: Record<string, string> = {
    VIEWER: 'can view photos but not upload or delete.',
    EDITOR: 'can view, upload and delete photos.',
    OWNER: 'full control, including managing both related sessions and photos.',
  };

  const setAccessRoleHandler = (value: 'VIEWER' | 'EDITOR' | 'OWNER') => {
    if (!isEmpty(value)) {
      setAccessLevel(value)
    }
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
        {isEqual(roleId, 'OWNER') && (
          <div className="flex flex-col items-center gap-2 py-4">
            <p className="text-sm font-medium text-muted-foreground">Grant access as:</p>
            <ToggleGroup
              type="single"
              value={accessLevel}
              onValueChange={setAccessRoleHandler}
              aria-label="Select access level"
              className="flex-wrap justify-center">
              <ToggleGroupItem value="VIEWER" aria-label="Viewer access">
                Viewer
              </ToggleGroupItem>
              <ToggleGroupItem value="EDITOR" aria-label="Editor access">
                Editor
              </ToggleGroupItem>
              <ToggleGroupItem value="OWNER" aria-label="Owner access">
                Owner
              </ToggleGroupItem>
            </ToggleGroup>

            <p className="mt-2 text-xs text-center text-slate-500 dark:text-slate-400 max-w-xs leading-snug">
              {accessMessages[accessLevel]}
              {isEqual(accessLevel, 'OWNER') && (
                <span className="text-red-500"> Share with caution.</span>
              )}
            </p>
          </div>
        )}
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
            value={isShortening ? '' : (shortUrl || shareUrl)}
            placeholder={isShortening ? 'Shortening...' : ''}
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
