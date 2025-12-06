import { Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useColorTheme, colorThemes } from '@/contexts/ColorThemeContext';
import { cn } from '@/lib/utils';

const ColorThemeSwitcher = () => {
  const { colorTheme, setColorTheme } = useColorTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Palette className="h-5 w-5" />
          <span className="sr-only">Toggle color theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-background">
        {colorThemes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => setColorTheme(theme.id)}
            className={cn(
              'flex items-center gap-3 cursor-pointer',
              colorTheme === theme.id && 'bg-muted'
            )}
          >
            <div className="flex gap-1">
              <div
                className="h-4 w-4 rounded-full border border-border"
                style={{ backgroundColor: theme.primary }}
              />
              <div
                className="h-4 w-4 rounded-full border border-border"
                style={{ backgroundColor: theme.accent }}
              />
            </div>
            <span className="flex-1">{theme.name}</span>
            {colorTheme === theme.id && (
              <span className="text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ColorThemeSwitcher;
