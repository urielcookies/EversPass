import { Grid3x3, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React from 'react'; // Import React

interface PhotoViewTabsProps {
  oneView: boolean;
  setOneView: (view: boolean) => void;
  // You can add more tabs here if needed, e.g., for shared photos, tagged photos etc.
  // currentTab: 'grid' | 'oneView' | 'shared' | 'tagged';
  // onTabChange: (tab: 'grid' | 'oneView' | 'shared' | 'tagged') => void;
}

// Use React.forwardRef to allow the parent to pass a ref to this component's div
const PhotoViewTabs = React.forwardRef<HTMLDivElement, PhotoViewTabsProps>(
  ({ oneView, setOneView }, ref) => {
    return (
      <div
        ref={ref}
        className="flex justify-around items-center border-b border-slate-200 dark:border-slate-800 px-4 sm:px-0 mt-4">
        {/* Grid View Tab */}
        <Button
          variant="ghost"
          size="lg"
          onClick={() => setOneView(false)}
          className={`relative flex-1 rounded-none py-3
            text-slate-500 dark:text-slate-400
            ${!oneView ? 'text-blue-600 dark:text-blue-400' : ''}
            focus:outline-none focus:ring-0 focus:bg-transparent active:bg-transparent
          `}>
          <Grid3x3 className="mx-auto !w-5 !h-5" />
          {!oneView && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400" />
          )}
          <span className="sr-only">Grid View</span>
        </Button>

        {/* Single View Tab */}
        <Button
          variant="ghost"
          size="lg"
          onClick={() => setOneView(true)}
          className={`relative flex-1 rounded-none py-3
            text-slate-500 dark:text-slate-400
            ${oneView ? 'text-blue-600 dark:text-blue-400' : ''}
            focus:outline-none focus:ring-0 focus:bg-transparent active:bg-transparent
          `}>
          <ImageIcon className="mx-auto !w-5 !h-5" />
          {oneView && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400" />
          )}
          <span className="sr-only">Single View</span>
        </Button>
      </div>
    );
  }
);

PhotoViewTabs.displayName = 'PhotoViewTabs'; // Good practice for debugging with forwardRef

export default PhotoViewTabs;