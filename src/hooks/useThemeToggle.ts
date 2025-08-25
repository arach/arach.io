import { useEffect, useState } from 'react';

export const useThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme
    const savedMode = localStorage.getItem('theme') === 'dark';
    setIsDark(savedMode);
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

  return { isDark, toggleDarkMode };
};