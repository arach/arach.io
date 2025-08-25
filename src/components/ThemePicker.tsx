import React, { useState, useEffect } from 'react';
import { themes, getTheme, applyTheme, type Theme } from '../utils/themes';

const ThemePicker: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);
  const [currentMode, setCurrentMode] = useState<'light' | 'dark'>('light');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Load saved theme
    const savedThemeId = localStorage.getItem('theme-palette') || 'default';
    const savedMode = (localStorage.getItem('theme') || 'light') as 'light' | 'dark';
    
    const theme = getTheme(savedThemeId);
    setCurrentTheme(theme);
    setCurrentMode(savedMode);
    applyTheme(theme, savedMode);
  }, []);

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
    applyTheme(theme, currentMode);
    localStorage.setItem('theme-palette', theme.id);
  };

  const handleModeToggle = () => {
    const newMode = currentMode === 'light' ? 'dark' : 'light';
    setCurrentMode(newMode);
    applyTheme(currentTheme, newMode);
    localStorage.setItem('theme', newMode);
    document.documentElement.setAttribute('data-theme', newMode);
  };

  const getColorPreview = (theme: Theme) => {
    const colors = theme.colors[currentMode];
    return {
      bg: `rgb(${colors.fill})`,
      text: `rgb(${colors.textBase})`,
      accent: `rgb(${colors.accent})`,
      border: `rgb(${colors.border})`,
    };
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
        style={{
          backgroundColor: `rgb(${currentTheme.colors[currentMode].accent})`,
          color: currentMode === 'dark' ? '#000' : '#fff',
        }}
        aria-label="Theme Picker"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.591a.75.75 0 101.06 1.06l1.591-1.591zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.591-1.591a.75.75 0 10-1.06 1.06l1.591 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.591a.75.75 0 001.06 1.06l1.591-1.591zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06L6.166 5.106a.75.75 0 00-1.06 1.06l1.591 1.591z" />
        </svg>
      </button>

      {/* Theme picker panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-80 bg-skin-card border border-skin-line rounded-lg shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-skin-line">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-skin-base">Theme Settings</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-skin-base opacity-60 hover:opacity-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Dark mode toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-skin-base">Dark Mode</span>
              <button
                onClick={handleModeToggle}
                className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${
                  currentMode === 'dark' ? 'bg-skin-accent' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                    currentMode === 'dark' ? 'transform translate-x-7' : ''
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Theme list */}
          <div className={`p-2 ${isExpanded ? 'max-h-96' : 'max-h-64'} overflow-y-auto`}>
            {themes.map((theme) => {
              const colors = getColorPreview(theme);
              const isActive = theme.id === currentTheme.id;
              
              return (
                <button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme)}
                  className={`w-full p-3 mb-2 rounded-lg border-2 transition-all duration-200 ${
                    isActive 
                      ? 'border-skin-accent shadow-md' 
                      : 'border-transparent hover:border-skin-line'
                  }`}
                  style={{
                    backgroundColor: colors.bg,
                    color: colors.text,
                    borderColor: isActive ? colors.accent : undefined,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{theme.name}</span>
                    {isActive && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  
                  <p className="text-xs opacity-75 text-left mb-2">
                    {theme.description}
                  </p>
                  
                  {/* Color swatches */}
                  <div className="flex gap-1">
                    <div 
                      className="w-6 h-6 rounded-full border"
                      style={{ 
                        backgroundColor: colors.bg,
                        borderColor: colors.border 
                      }}
                    />
                    <div 
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: colors.text }}
                    />
                    <div 
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: colors.accent }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Expand button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full p-2 text-xs text-skin-base opacity-60 hover:opacity-100 border-t border-skin-line"
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
        </div>
      )}
    </>
  );
};

export default ThemePicker;