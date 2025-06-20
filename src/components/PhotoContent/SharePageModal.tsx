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


interface SharePageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SharePageModal = ({ isOpen, onClose }: SharePageModalProps) => {
  const [shareUrl, setShareUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null); // State for QR code image data

  // Effect to get the current URL when the modal opens
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      setShareUrl(window.location.href);
    }
  }, [isOpen]);

  // Effect to generate QR code whenever shareUrl changes
  useEffect(() => {
    const generateQr = async () => {
      if (shareUrl) {
        try {
          // Generate QR code as a Data URL (base64 image string)
          const url = await qrcode.toDataURL(shareUrl, {
            errorCorrectionLevel: 'H', // High error correction
            width: 200, // Desired width of the QR code image
            margin: 1, // Margin around the QR code
          });
          setQrCodeDataUrl(url);
        } catch (err) {
          console.error('Failed to generate QR code:', err);
          setQrCodeDataUrl(null); // Clear QR if error
        }
      } else {
        setQrCodeDataUrl(null); // Clear QR if no shareUrl
      }
    };

    generateQr();
  }, [shareUrl]); // Re-run when shareUrl changes

  // Function to copy the URL to the clipboard
  const handleCopy = async () => {
    if (shareUrl) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setIsCopied(true);
        // Reset the "Copied!" state after 2 seconds
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy URL. Please try manually.');
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md"> {/* Adjust max-width as needed */}
        <DialogHeader>
          <DialogTitle>Share This Page</DialogTitle>
          <DialogDescription>
            Scan the QR code or copy the link to share the current page.
          </DialogDescription>
        </DialogHeader>

        {/* QR Code Display */}
        <div className="flex justify-center p-4">
          {qrCodeDataUrl ? (
            <img
              src={qrCodeDataUrl}
              alt="QR Code for current page"
              width={200} // Explicit width/height for the img tag
              height={200}
              className="rounded-md" // Optional: add some styling
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
            <Copy className={`h-4 w-4 transition-transform ${isCopied ? 'scale-125 text-green-500' : ''}`} />
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