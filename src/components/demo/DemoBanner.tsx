import { useDemoContext } from '@/contexts/DemoContext';
import { Button } from '@/components/ui/button';
import { X, Eye } from 'lucide-react';

const DemoBanner = () => {
  const { isDemoMode, disableDemoMode } = useDemoContext();

  if (!isDemoMode) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-2 px-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          <span className="text-sm font-medium">
            Demo Mode - Viewing sample data. Sign up for your own learning experience.
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={disableDemoMode}
          className="text-primary-foreground hover:bg-primary-foreground/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DemoBanner;
