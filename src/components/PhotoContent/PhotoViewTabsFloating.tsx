import type { SetStateAction } from "react";
import { Grid3x3, Image } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PhotoViewTabsFloating {
  viewState: {
    oneView: boolean;
    setOneView: (value: SetStateAction<boolean>) => void
  }
}

const PhotoViewTabsFloating = ({ viewState }: PhotoViewTabsFloating) => (
  <div className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:hidden z-40">
    <div className="flex items-center space-x-2 p-2 rounded-full shadow-lg bg-gradient-to-r from-sky-500 to-blue-600">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => viewState.setOneView(false)}
        className={`rounded-full text-white ${
          !viewState.oneView ? 'bg-white/20' : ''
        }`}
        aria-label="Grid View">
        <Grid3x3 className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => viewState.setOneView(true)}
        className={`rounded-full text-white ${
          viewState.oneView ? 'bg-white/20' : ''
        }`}
        aria-label="Single View">
        <Image className="h-6 w-6" />
      </Button>
    </div>
  </div>
);

export default PhotoViewTabsFloating;