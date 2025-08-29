import React, { useState, useEffect } from 'react';
import { Palette } from 'lucide-react';

interface Theme {
  name: string;
  displayName: string;
  emoji: string;
  colors: {
    bg: string;
    text: string;
    accent: string;
    muted: string;
    border: string;
    gradient?: string;
  };
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
}

const themes: Theme[] = [
  {
    name: 'minimal',
    displayName: 'Minimal',
    emoji: '○',
    colors: {
      bg: '#ffffff',  // Pure white
      text: '#09090b',  // zinc-950
      accent: '#18181b',  // zinc-900
      muted: '#71717a',  // zinc-500
      border: '#e4e4e7',  // zinc-200
    },
    fonts: {
      heading: 'system-ui, -apple-system, sans-serif',
      body: 'system-ui, -apple-system, sans-serif',
      mono: 'ui-monospace, monospace',
    },
  },
  {
    name: 'midnight',
    displayName: 'Midnight',
    emoji: '●',
    colors: {
      bg: '#e1e7f5',  // Light blue-gray
      text: '#1e293b',  // slate-800
      accent: '#3b82f6',  // blue-500
      muted: '#64748b',  // slate-500
      border: '#cbd5e1',  // slate-300
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
    },
    fonts: {
      heading: '"Space Grotesk", system-ui, sans-serif',
      body: '"Inter", system-ui, sans-serif',
      mono: '"JetBrains Mono", monospace',
    },
  },
  {
    name: 'ocean',
    displayName: 'Ocean',
    emoji: '〜',
    colors: {
      bg: '#f0f9ff',  // sky-50
      text: '#0c4a6e',  // sky-900
      accent: '#0284c7',  // sky-600
      muted: '#075985',  // sky-800
      border: '#bae6fd',  // sky-200
      gradient: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
    },
    fonts: {
      heading: '"Raleway", "Montserrat", system-ui, sans-serif',  // Clean, modern, flowing
      body: '"Source Sans 3", "Open Sans", system-ui, sans-serif',  // Readable, friendly
      mono: '"Fira Code", "Cascadia Code", monospace',
    },
  },
  {
    name: 'sunset',
    displayName: 'Sunset',
    emoji: '◐',
    colors: {
      bg: '#fffbeb',  // amber-50
      text: '#78350f',  // amber-900
      accent: '#f59e0b',  // amber-500
      muted: '#92400e',  // amber-800
      border: '#fcd34d',  // amber-300
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)',
    },
    fonts: {
      heading: '"Merriweather", "Georgia", serif',  // More readable serif for headers
      body: '"Lora", "Crimson Pro", serif',  // Keep the good body font
      mono: '"Courier Prime", "IBM Plex Mono", monospace',
    },
  },
  {
    name: 'neon',
    displayName: 'Neon',
    emoji: '◈',
    colors: {
      bg: '#fdf4ff',  // fuchsia-50
      text: '#701a75',  // fuchsia-900
      accent: '#d946ef',  // fuchsia-500
      muted: '#86198f',  // fuchsia-800
      border: '#f0abfc',  // fuchsia-300
      gradient: 'linear-gradient(90deg, #d946ef 0%, #ec4899 100%)',
    },
    fonts: {
      heading: '"Orbitron", monospace',
      body: '"Exo 2", sans-serif',
      mono: '"Victor Mono", monospace',
    },
  },
  {
    name: 'paper',
    displayName: 'Paper',
    emoji: '□',
    colors: {
      bg: '#fafaf9',  // stone-50
      text: '#292524',  // stone-800
      accent: '#92400e',  // amber-800
      muted: '#57534e',  // stone-600
      border: '#d6d3d1',  // stone-300
    },
    fonts: {
      heading: '"Literata", "Merriweather", serif',  // Modern literary serif
      body: '"Source Serif 4", "Charter", "Georgia", serif',  // Excellent reading font
      mono: '"JetBrains Mono", "Courier Prime", monospace',
    },
  },
];

const ThemePickerCool: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Load saved theme
    const savedTheme = localStorage.getItem('cool-theme') || 'minimal';
    const savedMode = localStorage.getItem('theme') === 'dark';
    
    const theme = themes.find(t => t.name === savedTheme) || themes[0];
    setCurrentTheme(theme);
    setIsDark(savedMode);
    applyTheme(theme, savedMode);

    // Listen for theme changes from header toggle or system changes
    const handleThemeChange = (e: CustomEvent) => {
      const newIsDark = e.detail.isDark;
      setIsDark(newIsDark);
      applyTheme(theme, newIsDark);  // Use the current theme state
    };

    window.addEventListener('theme-change' as any, handleThemeChange);
    return () => {
      window.removeEventListener('theme-change' as any, handleThemeChange);
    };
  }, []);

  const applyTheme = (theme: Theme, dark: boolean) => {
    const root = document.documentElement;
    
    // Helper function
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? 
        `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
        '0, 0, 0';
    };
    
    // Define dark mode versions for each theme - thematically aligned
    const darkThemes: Record<string, Partial<Theme['colors']>> = {
      minimal: {
        bg: '#18181b',  // Lighter dark gray (24, 24, 27) - matches base.css
        text: '#f5f5f4',  // Soft warm white (245, 245, 244) - matches base.css
        accent: '#fbbf24',  // Warm amber (251, 191, 36) - matches base.css
        muted: '#a1a1aa',  // zinc-400
        border: '#27272a',  // zinc-800
      },
      midnight: {
        bg: '#0f172a',  // slate-900 - deeper blue-black
        text: '#e2e8f0',  // slate-200
        accent: '#60a5fa',  // blue-400 - brighter in dark
        muted: '#94a3b8',  // slate-400
        border: '#334155',  // slate-700
        gradient: 'linear-gradient(135deg, #60a5fa 0%, #818cf8 100%)',
      },
      ocean: {
        bg: '#082f49',  // sky-950 - deep ocean blue
        text: '#e0f2fe',  // sky-100
        accent: '#38bdf8',  // sky-400 - bright cyan
        muted: '#7dd3fc',  // sky-300
        border: '#0c4a6e',  // sky-900
        gradient: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)',
      },
      sunset: {
        bg: '#451a03',  // amber-950 - deep warm brown
        text: '#fef3c7',  // amber-100
        accent: '#fbbf24',  // amber-400 - golden
        muted: '#fde68a',  // amber-200
        border: '#78350f',  // amber-900
        gradient: 'linear-gradient(135deg, #fbbf24 0%, #f87171 100%)',
      },
      neon: {
        bg: '#2e1065',  // purple-950 - deep cyberpunk purple
        text: '#f3e8ff',  // purple-100
        accent: '#e879f9',  // fuchsia-400 - bright neon pink
        muted: '#d8b4fe',  // purple-300
        border: '#581c87',  // purple-900
        gradient: 'linear-gradient(90deg, #e879f9 0%, #f472b6 100%)',
      },
      paper: {
        bg: '#1c1917',  // stone-900 - dark paper/parchment
        text: '#f5f5f4',  // stone-100
        accent: '#fbbf24',  // amber-400 - aged gold accent
        muted: '#d6d3d1',  // stone-300
        border: '#44403c',  // stone-700
      },
    };
    
    // Apply colors based on mode
    const colors = dark && darkThemes[theme.name] 
      ? { ...theme.colors, ...darkThemes[theme.name] }
      : theme.colors;
      
    root.style.setProperty('--color-fill', hexToRgb(colors.bg));
    root.style.setProperty('--color-text-base', hexToRgb(colors.text));
    root.style.setProperty('--color-accent', hexToRgb(colors.accent));
    root.style.setProperty('--color-card', hexToRgb(colors.bg));
    root.style.setProperty('--color-card-muted', hexToRgb(colors.border));
    root.style.setProperty('--color-border', hexToRgb(colors.border));
    
    // Apply fonts
    root.style.setProperty('--font-heading', theme.fonts.heading);
    root.style.setProperty('--font-body', theme.fonts.body);
    root.style.setProperty('--font-mono', theme.fonts.mono);
    
    // Apply gradient if available
    if (theme.colors.gradient) {
      root.style.setProperty('--theme-gradient', theme.colors.gradient);
    }
    
    // Store preferences
    localStorage.setItem('cool-theme', theme.name);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    
    // Load fonts if needed
    loadFonts(theme);
  };

  const loadFonts = (theme: Theme) => {
    const fontMap: Record<string, string> = {
      // Minimal & Midnight
      'Space Grotesk': 'Space+Grotesk:wght@400;700',
      'Inter': 'Inter:wght@400;600',
      'JetBrains Mono': 'JetBrains+Mono:wght@400;500',
      // Ocean
      'Raleway': 'Raleway:wght@400;600;700',
      'Montserrat': 'Montserrat:wght@400;600;700',
      'Source Sans 3': 'Source+Sans+3:wght@400;600',
      'Open Sans': 'Open+Sans:wght@400;600',
      'Fira Code': 'Fira+Code:wght@400;500',
      'Cascadia Code': 'Cascadia+Code:wght@400',
      // Sunset
      'Merriweather': 'Merriweather:wght@400;700;900',
      'Lora': 'Lora:wght@400;500;600',
      'Crimson Pro': 'Crimson+Pro:wght@400;600',
      'Courier Prime': 'Courier+Prime:wght@400',
      'IBM Plex Mono': 'IBM+Plex+Mono:wght@400;500',
      // Neon
      'Orbitron': 'Orbitron:wght@400;700;900',
      'Exo 2': 'Exo+2:wght@400;700',
      'Victor Mono': 'Victor+Mono:wght@400',
      // Paper
      'Literata': 'Literata:wght@400;700;900',
      'Source Serif 4': 'Source+Serif+4:wght@400;600;700',
      'Charter': 'Charter:wght@400;700',
    };
    
    Object.entries(theme.fonts).forEach(([, fontStack]) => {
      const fontName = fontStack.split(',')[0].replace(/['"]/g, '').trim();
      const googleFont = fontMap[fontName];
      
      if (googleFont) {
        const linkId = `font-${fontName.replace(/\s+/g, '-').toLowerCase()}`;
        if (!document.getElementById(linkId)) {
          const link = document.createElement('link');
          link.id = linkId;
          link.rel = 'stylesheet';
          link.href = `https://fonts.googleapis.com/css2?family=${googleFont}&display=swap`;
          document.head.appendChild(link);
        }
      }
    });
  };

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
    applyTheme(theme, isDark);
    setIsOpen(false);
  };

  const toggleDarkMode = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    applyTheme(currentTheme, newDark);
    
    // Dispatch event so header toggle can sync
    window.dispatchEvent(new CustomEvent('theme-change', { 
      detail: { isDark: newDark } 
    }));
  };

  return (
    <>
      {/* Translucent circular button with backdrop glow */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed bottom-4 right-4 z-50
          w-9 h-9 rounded-full
          backdrop-blur-xl
          transition-all duration-500
          group
          ring-1
          flex items-center justify-center
        `}
        style={{
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          boxShadow: isDark 
            ? '0 0 20px rgba(255, 255, 255, 0.05), inset 0 0 20px rgba(255, 255, 255, 0.02)' 
            : '0 0 20px rgba(0, 0, 0, 0.05)',
        }}
        aria-label="Theme"
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = isDark 
            ? 'rgba(255, 255, 255, 0.08)' 
            : 'rgba(0, 0, 0, 0.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = isDark 
            ? 'rgba(255, 255, 255, 0.05)' 
            : 'rgba(0, 0, 0, 0.03)';
        }}
      >
        <Palette 
          className="w-3.5 h-3.5 transition-all duration-300"
          style={{
            color: currentTheme.colors.accent,
            opacity: isOpen ? 1 : 0.6,
          }}
        />
      </button>

      {/* Adaptive theme panel with current theme colors */}
      {isOpen && (
        <div 
          className={`
            fixed bottom-16 right-4 z-50
            backdrop-blur-2xl
            rounded-lg shadow-2xl
            ring-1
            p-1.5 min-w-[160px]
            animate-in fade-in slide-in-from-bottom-2 duration-200
          `}
          style={{
            backgroundColor: `${currentTheme.colors.bg}e6`, // 90% opacity
            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            boxShadow: `0 20px 25px -5px ${currentTheme.colors.bg}40, 0 10px 10px -5px ${currentTheme.colors.bg}20`,
          }}
        >
          {/* Dark mode toggle with theme colors */}
          <button
            onClick={toggleDarkMode}
            className={`
              w-full px-2.5 py-1.5 mb-1
              text-[11px] font-light text-left
              rounded-md
              transition-colors duration-200
              flex items-center justify-between
            `}
            style={{
              color: currentTheme.colors.text,
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${currentTheme.colors.accent}15`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span style={{ opacity: 0.7 }}>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
            <span className="text-[8px]" style={{ opacity: 0.4 }}>{isDark ? '●' : '○'}</span>
          </button>
          
          <div className="h-px mb-1" style={{ backgroundColor: `${currentTheme.colors.border}40` }} />
          
          {/* Theme options with color dots */}
          <div className="space-y-1">
            {themes.map((theme) => (
              <button
                key={theme.name}
                onClick={() => handleThemeChange(theme)}
                className={`
                  w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md
                  transition-all duration-200 text-left
                `}
                style={{
                  backgroundColor: currentTheme.name === theme.name 
                    ? `${currentTheme.colors.accent}15`
                    : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (currentTheme.name !== theme.name) {
                    e.currentTarget.style.backgroundColor = `${currentTheme.colors.accent}08`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentTheme.name !== theme.name) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div className="flex items-center gap-2 flex-1">
                  {/* Color preview dots */}
                  <div className="flex gap-0.5">
                    <span 
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ 
                        backgroundColor: theme.colors.bg,
                        border: `1px solid ${currentTheme.colors.border}20`,
                      }}
                    />
                    <span 
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: theme.colors.accent }}
                    />
                  </div>
                  <span 
                    className="text-[11px] font-light"
                    style={{ 
                      color: currentTheme.colors.text,
                      opacity: 0.7,
                    }}
                  >
                    {theme.displayName}
                  </span>
                </div>
                {currentTheme.name === theme.name && (
                  <span 
                    className="w-1 h-1 rounded-full" 
                    style={{ backgroundColor: currentTheme.colors.accent }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ThemePickerCool;