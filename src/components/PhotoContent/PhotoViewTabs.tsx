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
  ({ oneView, setOneView }, ref) => { // Accept ref as the second argument
    return (
      <div
        ref={ref} // Attach the ref to the root div
        className="flex justify-around items-center border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-black px-4 sm:px-0 mt-4 sticky top-0 z-20">
        {/* Grid View Tab */}
        <Button
          variant="ghost"
          size="lg" // Use a larger size for better tap target
          onClick={() => setOneView(false)}
          className={`relative flex-1 rounded-none text-slate-500 dark:text-slate-400 py-3 hover:bg-slate-100 dark:hover:bg-slate-900 ${
            !oneView ? 'text-blue-600 dark:text-blue-400' : '' // Active state text color
          }`}>
          <Grid3x3 className="mx-auto !w-5 !h-5" />
          {!oneView && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 transform scale-x-100 transition-transform duration-200"></span>
          )}
          <span className="sr-only">Grid View</span>
        </Button>

        {/* Single View Tab */}
        <Button
          variant="ghost"
          size="lg" // Use a larger size for better tap target
          onClick={() => setOneView(true)}
          className={`relative flex-1 rounded-none text-slate-500 dark:text-slate-400 py-3 hover:bg-slate-100 dark:hover:bg-slate-900 ${
            oneView ? 'text-blue-600 dark:text-blue-400' : '' // Active state text color
          }`}>
          <ImageIcon className="mx-auto !w-5 !h-5" />
          {oneView && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 transform scale-x-100 transition-transform duration-200"></span>
          )}
          <span className="sr-only">Single View</span>
        </Button>
      </div>
    );
  }
);

PhotoViewTabs.displayName = 'PhotoViewTabs'; // Good practice for debugging with forwardRef

export default PhotoViewTabs;