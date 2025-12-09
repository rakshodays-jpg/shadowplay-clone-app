import React, { createContext, useContext, useEffect, useState } from 'react';

type ColorTheme = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'cyan';

interface ThemeContextType {
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    const stored = localStorage.getItem('shadowplay-color-theme');
    return (stored as ColorTheme) || 'blue';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('theme-blue', 'theme-green', 'theme-purple', 'theme-orange', 'theme-red', 'theme-cyan');
    
    // Add the selected theme class
    root.classList.add(`theme-${colorTheme}`);
    
    // Always keep dark mode
    root.classList.add('dark');
  }, [colorTheme]);

  useEffect(() => {
    localStorage.setItem('shadowplay-color-theme', colorTheme);
  }, [colorTheme]);

  return (
    <ThemeContext.Provider value={{ colorTheme, setColorTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export const colorThemes: { value: ColorTheme; label: string; color: string }[] = [
  { value: 'blue', label: 'Electric Blue', color: 'hsl(214, 84%, 34%)' },
  { value: 'green', label: 'Emerald', color: 'hsl(152, 76%, 40%)' },
  { value: 'purple', label: 'Violet', color: 'hsl(270, 70%, 50%)' },
  { value: 'orange', label: 'Sunset', color: 'hsl(25, 95%, 53%)' },
  { value: 'red', label: 'Ruby', color: 'hsl(0, 84%, 50%)' },
  { value: 'cyan', label: 'Ocean', color: 'hsl(187, 85%, 43%)' },
];
