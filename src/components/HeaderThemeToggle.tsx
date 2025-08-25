import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const HeaderThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme
    const savedMode = localStorage.getItem('theme') === 'dark';
    setIsDark(savedMode);

    // Listen for theme changes from ThemePickerCool
    const handleThemeChange = (e: CustomEvent) => {
      setIsDark(e.detail.isDark);
    };

    window.addEventListener('theme-change' as any, handleThemeChange);
    return () => {
      window.removeEventListener('theme-change' as any, handleThemeChange);
    };
  }, []);

  const toggleDarkMode = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    
    // Update localStorage
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
    
    // Update document attribute for Astro's theme system
    document.documentElement.setAttribute('data-theme', newDark ? 'dark' : 'light');
    
    // Dispatch event so ThemePickerCool can listen
    window.dispatchEvent(new CustomEvent('theme-change', { 
      detail: { isDark: newDark } 
    }));
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="icon-link"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-live="polite"
    >
      {isDark ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
};

export default HeaderThemeToggle;