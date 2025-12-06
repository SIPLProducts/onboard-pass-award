import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ColorTheme = 'blue' | 'purple' | 'green' | 'orange' | 'rose' | 'teal' | 'kpc';

interface ColorThemeContextType {
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
}

const ColorThemeContext = createContext<ColorThemeContextType | undefined>(undefined);

export const colorThemes: { id: ColorTheme; name: string; primary: string; accent: string }[] = [
  { id: 'kpc', name: 'KPC Gold', primary: '#D4A017', accent: '#C87533' },
  { id: 'blue', name: 'Ocean Blue', primary: '#3B82F6', accent: '#8B5CF6' },
  { id: 'purple', name: 'Royal Purple', primary: '#8B5CF6', accent: '#EC4899' },
  { id: 'green', name: 'Forest Green', primary: '#10B981', accent: '#14B8A6' },
  { id: 'orange', name: 'Sunset Orange', primary: '#F97316', accent: '#EAB308' },
  { id: 'rose', name: 'Rose Pink', primary: '#F43F5E', accent: '#EC4899' },
  { id: 'teal', name: 'Ocean Teal', primary: '#14B8A6', accent: '#06B6D4' },
];

export const ColorThemeProvider = ({ children }: { children: ReactNode }) => {
  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    const saved = localStorage.getItem('color-theme');
    return (saved as ColorTheme) || 'kpc';
  });

  useEffect(() => {
    localStorage.setItem('color-theme', colorTheme);
    
    // Remove all theme classes
    document.documentElement.classList.remove('theme-blue', 'theme-purple', 'theme-green', 'theme-orange', 'theme-rose', 'theme-teal', 'theme-kpc');
    
    // Add current theme class
    document.documentElement.classList.add(`theme-${colorTheme}`);
  }, [colorTheme]);

  return (
    <ColorThemeContext.Provider value={{ colorTheme, setColorTheme }}>
      {children}
    </ColorThemeContext.Provider>
  );
};

export const useColorTheme = () => {
  const context = useContext(ColorThemeContext);
  if (!context) {
    throw new Error('useColorTheme must be used within a ColorThemeProvider');
  }
  return context;
};
