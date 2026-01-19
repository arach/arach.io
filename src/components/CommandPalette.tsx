import { useState, useEffect, useRef, useCallback } from 'react';
import { resumeData } from '../data/resume';

// Full theme definitions (matching ThemePickerCool)
interface Theme {
  name: string;
  displayName: string;
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
    colors: {
      bg: '#ffffff',
      text: '#09090b',
      accent: '#18181b',
      muted: '#71717a',
      border: '#e4e4e7',
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
    colors: {
      bg: '#e1e7f5',
      text: '#1e293b',
      accent: '#3b82f6',
      muted: '#64748b',
      border: '#cbd5e1',
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
    colors: {
      bg: '#f0f9ff',
      text: '#0c4a6e',
      accent: '#0284c7',
      muted: '#075985',
      border: '#bae6fd',
      gradient: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
    },
    fonts: {
      heading: '"Raleway", "Montserrat", system-ui, sans-serif',
      body: '"Source Sans 3", "Open Sans", system-ui, sans-serif',
      mono: '"Fira Code", "Cascadia Code", monospace',
    },
  },
  {
    name: 'sunset',
    displayName: 'Sunset',
    colors: {
      bg: '#fffbeb',
      text: '#78350f',
      accent: '#f59e0b',
      muted: '#92400e',
      border: '#fcd34d',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)',
    },
    fonts: {
      heading: '"Merriweather", "Georgia", serif',
      body: '"Lora", "Crimson Pro", serif',
      mono: '"Courier Prime", "IBM Plex Mono", monospace',
    },
  },
  {
    name: 'neon',
    displayName: 'Neon',
    colors: {
      bg: '#fdf4ff',
      text: '#701a75',
      accent: '#d946ef',
      muted: '#86198f',
      border: '#f0abfc',
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
    colors: {
      bg: '#fafaf9',
      text: '#292524',
      accent: '#92400e',
      muted: '#57534e',
      border: '#d6d3d1',
    },
    fonts: {
      heading: '"Literata", "Merriweather", serif',
      body: '"Source Serif 4", "Charter", "Georgia", serif',
      mono: '"JetBrains Mono", "Courier Prime", monospace',
    },
  },
];

// Dark mode variants for each theme
const darkThemes: Record<string, Partial<Theme['colors']>> = {
  minimal: {
    bg: '#18181b',
    text: '#f5f5f4',
    accent: '#fbbf24',
    muted: '#a1a1aa',
    border: '#27272a',
  },
  midnight: {
    bg: '#0f172a',
    text: '#e2e8f0',
    accent: '#60a5fa',
    muted: '#94a3b8',
    border: '#334155',
    gradient: 'linear-gradient(135deg, #60a5fa 0%, #818cf8 100%)',
  },
  ocean: {
    bg: '#082f49',
    text: '#e0f2fe',
    accent: '#38bdf8',
    muted: '#7dd3fc',
    border: '#0c4a6e',
    gradient: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)',
  },
  sunset: {
    bg: '#451a03',
    text: '#fef3c7',
    accent: '#fbbf24',
    muted: '#fde68a',
    border: '#78350f',
    gradient: 'linear-gradient(135deg, #fbbf24 0%, #f87171 100%)',
  },
  neon: {
    bg: '#2e1065',
    text: '#f3e8ff',
    accent: '#e879f9',
    muted: '#d8b4fe',
    border: '#581c87',
    gradient: 'linear-gradient(90deg, #e879f9 0%, #f472b6 100%)',
  },
  paper: {
    bg: '#1c1917',
    text: '#f5f5f4',
    accent: '#fbbf24',
    muted: '#d6d3d1',
    border: '#44403c',
  },
};

// Helper to convert hex to RGB
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 0, 0';
};

// Font loading map
const fontMap: Record<string, string> = {
  'Space Grotesk': 'Space+Grotesk:wght@400;700',
  'Inter': 'Inter:wght@400;600',
  'JetBrains Mono': 'JetBrains+Mono:wght@400;500',
  'Raleway': 'Raleway:wght@400;600;700',
  'Montserrat': 'Montserrat:wght@400;600;700',
  'Source Sans 3': 'Source+Sans+3:wght@400;600',
  'Open Sans': 'Open+Sans:wght@400;600',
  'Fira Code': 'Fira+Code:wght@400;500',
  'Cascadia Code': 'Cascadia+Code:wght@400',
  'Merriweather': 'Merriweather:wght@400;700;900',
  'Lora': 'Lora:wght@400;500;600',
  'Crimson Pro': 'Crimson+Pro:wght@400;600',
  'Courier Prime': 'Courier+Prime:wght@400',
  'IBM Plex Mono': 'IBM+Plex+Mono:wght@400;500',
  'Orbitron': 'Orbitron:wght@400;700;900',
  'Exo 2': 'Exo+2:wght@400;700',
  'Victor Mono': 'Victor+Mono:wght@400',
  'Literata': 'Literata:wght@400;700;900',
  'Source Serif 4': 'Source+Serif+4:wght@400;600;700',
  'Charter': 'Charter:wght@400;700',
};

const loadFonts = (theme: Theme) => {
  Object.values(theme.fonts).forEach((fontStack) => {
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

const applyTheme = (theme: Theme, dark: boolean) => {
  const root = document.documentElement;

  // Apply colors based on mode
  const colors = dark && darkThemes[theme.name]
    ? { ...theme.colors, ...darkThemes[theme.name] }
    : theme.colors;

  root.style.setProperty('--color-fill', hexToRgb(colors.bg!));
  root.style.setProperty('--color-text-base', hexToRgb(colors.text!));
  root.style.setProperty('--color-accent', hexToRgb(colors.accent!));
  root.style.setProperty('--color-card', hexToRgb(colors.bg!));
  root.style.setProperty('--color-card-muted', hexToRgb(colors.border!));
  root.style.setProperty('--color-border', hexToRgb(colors.border!));

  // Apply fonts
  root.style.setProperty('--font-heading', theme.fonts.heading);
  root.style.setProperty('--font-body', theme.fonts.body);
  root.style.setProperty('--font-mono', theme.fonts.mono);

  // Apply gradient if available
  if (colors.gradient) {
    root.style.setProperty('--theme-gradient', colors.gradient);
  }

  // Store preferences
  localStorage.setItem('cool-theme', theme.name);
  localStorage.setItem('theme', dark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');

  // Load fonts if needed
  loadFonts(theme);
};

interface Command {
  id: string;
  label: string;
  shortcut?: string;
  action: () => void;
  category: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  viewMode: 'detailed' | 'summary';
  onToggleViewMode: () => void;
  fontSize: 'S' | 'M' | 'L';
  onSetFontSize: (size: 'S' | 'M' | 'L') => void;
  isDark: boolean;
  onToggleDarkMode: () => void;
  currentTheme: string;
  onSetTheme: (themeName: string) => void;
  initialView?: 'commands' | 'skills' | 'contact' | 'size' | 'theme';
}

export default function CommandPalette({
  isOpen, onClose, viewMode, onToggleViewMode,
  fontSize, onSetFontSize, isDark, onToggleDarkMode, currentTheme, onSetTheme, initialView = 'commands'
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeView, setActiveView] = useState<'commands' | 'skills' | 'contact' | 'size' | 'theme'>(initialView);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Reset to initial view when opening
  useEffect(() => {
    if (isOpen) {
      setActiveView(initialView);
    }
  }, [isOpen, initialView]);

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    onClose();
  };

  const commands: Command[] = [
    // Display Settings
    {
      id: 'view-mode',
      label: viewMode === 'detailed' ? 'Switch to Summary View' : 'Switch to Detailed View',
      shortcut: 'V',
      action: () => {
        onToggleViewMode();
        onClose();
      },
      category: 'Display',
    },
    {
      id: 'font-size',
      label: 'Change Font Size',
      shortcut: 'S',
      action: () => setActiveView('size'),
      category: 'Display',
    },
    {
      id: 'theme-settings',
      label: 'Change Theme',
      shortcut: 'T',
      action: () => setActiveView('theme'),
      category: 'Display',
    },
    {
      id: 'dark-mode',
      label: isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      action: () => {
        onToggleDarkMode();
        onClose();
      },
      category: 'Display',
    },
    // Views
    {
      id: 'skills',
      label: 'View Systems Status',
      action: () => setActiveView('skills'),
      category: 'Views',
    },
    {
      id: 'contact',
      label: 'Contact Information',
      shortcut: 'C',
      action: () => setActiveView('contact'),
      category: 'Views',
    },
    // Navigation
    {
      id: 'nav-experience',
      label: 'Go to Operational History',
      action: () => scrollToSection('.experience-section'),
      category: 'Navigation',
    },
    {
      id: 'nav-education',
      label: 'Go to Training',
      action: () => scrollToSection('.education-section'),
      category: 'Navigation',
    },
    {
      id: 'nav-volunteer',
      label: 'Go to Allied Operations',
      action: () => scrollToSection('.volunteer-section'),
      category: 'Navigation',
    },
    // Actions
    {
      id: 'download',
      label: 'Download PDF Resume',
      shortcut: 'D',
      action: () => {
        const link = document.querySelector('.download-btn') as HTMLAnchorElement;
        if (link) link.click();
        onClose();
      },
      category: 'Actions',
    },
    {
      id: 'console-mode',
      label: 'Activate Console Mode',
      action: () => {
        window.dispatchEvent(new Event('activate-console-mode'));
        onClose();
      },
      category: 'Actions',
    },
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, Command[]>);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;

    // Escape: go back or close
    if (e.key === 'Escape') {
      if (activeView !== 'commands') {
        setActiveView('commands');
      } else {
        onClose();
      }
      return;
    }

    // Size view shortcuts: S, M, L
    if (activeView === 'size') {
      const key = e.key.toUpperCase();
      if (key === 'S') {
        e.preventDefault();
        onSetFontSize('S');
        onClose();
      } else if (key === 'M') {
        e.preventDefault();
        onSetFontSize('M');
        onClose();
      } else if (key === 'L') {
        e.preventDefault();
        onSetFontSize('L');
        onClose();
      }
      return;
    }

    // Theme view shortcuts: 1-6 for themes, D for dark mode toggle
    if (activeView === 'theme') {
      const key = e.key;
      if (key >= '1' && key <= '6') {
        e.preventDefault();
        const themeIndex = parseInt(key) - 1;
        if (themes[themeIndex]) {
          onSetTheme(themes[themeIndex].name);
          onClose();
        }
      } else if (key.toUpperCase() === 'D') {
        e.preventDefault();
        onToggleDarkMode();
      }
      return;
    }

    // Commands view: arrow navigation and enter
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, filteredCommands.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      e.preventDefault();
      filteredCommands[selectedIndex].action();
    }
  }, [isOpen, filteredCommands, selectedIndex, activeView, onClose, onSetFontSize, onSetTheme, onToggleDarkMode]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      // activeView is set by the other useEffect that uses initialView
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current && activeView === 'commands') {
      const selectedElement = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex, activeView]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="command-palette-backdrop"
        onClick={onClose}
      />

      {/* Palette */}
      <div className="command-palette">
        {/* Header */}
        <div className="command-palette-header">
          <span className="command-palette-label">COMMAND_INTERFACE</span>
          <span className="command-palette-hint">ESC to close</span>
        </div>

        {/* Search input */}
        <div className="command-palette-input-wrapper">
          <span className="command-palette-prompt">{'>'}</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={activeView === 'commands' ? 'Type a command...' : 'Press ESC to go back'}
            className="command-palette-input"
            autoFocus
          />
        </div>

        {/* Content */}
        <div className="command-palette-content" ref={listRef}>
          {activeView === 'commands' && (
            <>
              <div className="command-groups-grid">
                {Object.entries(groupedCommands).map(([category, cmds]) => (
                  <div key={category} className="command-group">
                    <div className="command-group-label">{category.toUpperCase()}</div>
                    {cmds.map((cmd) => {
                      const globalIndex = filteredCommands.findIndex(c => c.id === cmd.id);
                      return (
                        <div
                          key={cmd.id}
                          data-index={globalIndex}
                          className={`command-item ${globalIndex === selectedIndex ? 'selected' : ''}`}
                          onClick={() => cmd.action()}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                        >
                          <span className="command-label">{cmd.label}</span>
                          {cmd.shortcut && (
                            <kbd className="command-shortcut">{cmd.shortcut}</kbd>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              {filteredCommands.length === 0 && (
                <div className="command-empty">No commands found</div>
              )}
            </>
          )}

          {activeView === 'skills' && (
            <div className="command-view">
              <div className="command-view-header">◆ SYSTEMS STATUS</div>
              {resumeData.skills.map((skill, index) => (
                <div key={skill.name} className="skill-row">
                  <div className="skill-row-header">
                    <span className="skill-row-name">{skill.name.toUpperCase()}</span>
                    <span className="skill-row-level">{skill.level}%</span>
                  </div>
                  <div className="skill-row-bar">
                    <div
                      className="skill-row-fill"
                      style={{
                        width: `${skill.level}%`,
                        animationDelay: `${index * 0.1}s`
                      }}
                    />
                  </div>
                  <div className="skill-row-items">
                    {skill.items.map(item => (
                      <span key={item} className="skill-row-item">{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeView === 'contact' && (
            <div className="command-view">
              <div className="command-view-header">◆ COMM CHANNELS</div>
              <div className="contact-grid">
                <div className="contact-row">
                  <span className="contact-label">WEBSITE</span>
                  <a href={`https://${resumeData.contact.website}`} target="_blank" rel="noopener" className="contact-value">
                    {resumeData.contact.website}
                  </a>
                </div>
                {resumeData.contact.email && (
                  <div className="contact-row">
                    <span className="contact-label">EMAIL</span>
                    <a href={`mailto:${resumeData.contact.email}`} className="contact-value">
                      {resumeData.contact.email}
                    </a>
                  </div>
                )}
                {resumeData.contact.linkedin && (
                  <div className="contact-row">
                    <span className="contact-label">LINKEDIN</span>
                    <a href={`https://linkedin.com/in/${resumeData.contact.linkedin}`} target="_blank" rel="noopener" className="contact-value">
                      linkedin.com/in/{resumeData.contact.linkedin}
                    </a>
                  </div>
                )}
                <div className="contact-row">
                  <span className="contact-label">LOCATION</span>
                  <span className="contact-value">{resumeData.location}</span>
                </div>
              </div>
            </div>
          )}

          {activeView === 'size' && (
            <div className="command-view">
              <div className="command-view-header">◆ FONT SIZE</div>
              <div className="settings-options">
                {(['S', 'M', 'L'] as const).map((size) => (
                  <button
                    key={size}
                    className={`settings-option ${fontSize === size ? 'active' : ''}`}
                    onClick={() => { onSetFontSize(size); onClose(); }}
                  >
                    <kbd className="settings-shortcut">{size}</kbd>
                    <span className="settings-option-label">
                      {size === 'S' ? 'SMALL' : size === 'M' ? 'MEDIUM' : 'LARGE'}
                    </span>
                    <span className="settings-option-preview" style={{ fontSize: size === 'S' ? '12px' : size === 'M' ? '14px' : '16px' }}>
                      Aa
                    </span>
                    {fontSize === size && <span className="settings-option-check">●</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeView === 'theme' && (
            <div className="command-view">
              <div className="command-view-header">◆ THEME</div>
              <div className="settings-options">
                {/* Dark mode toggle */}
                <button
                  className="settings-option settings-option-toggle"
                  onClick={onToggleDarkMode}
                >
                  <kbd className="settings-shortcut">D</kbd>
                  <span className="settings-option-label">{isDark ? 'DARK MODE' : 'LIGHT MODE'}</span>
                  <span className="settings-option-icon">{isDark ? '☾' : '☀'}</span>
                </button>
                <div className="settings-divider" />
                {/* Theme options */}
                {themes.map((theme, index) => (
                  <button
                    key={theme.name}
                    className={`settings-option ${currentTheme === theme.name ? 'active' : ''}`}
                    onClick={() => { onSetTheme(theme.name); onClose(); }}
                  >
                    <kbd className="settings-shortcut">{index + 1}</kbd>
                    <span className="theme-swatches">
                      <span className="theme-swatch" style={{ backgroundColor: theme.colors.bg, border: '1px solid rgba(0,0,0,0.1)' }} />
                      <span className="theme-swatch" style={{ backgroundColor: theme.colors.accent }} />
                    </span>
                    <span className="settings-option-label">{theme.displayName.toUpperCase()}</span>
                    {currentTheme === theme.name && <span className="settings-option-check">●</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer - view-specific hints */}
        <div className="command-palette-footer">
          {activeView === 'commands' && (
            <>
              <span><kbd>↑↓</kbd> navigate</span>
              <span><kbd>↵</kbd> select</span>
              <span><kbd>esc</kbd> close</span>
            </>
          )}
          {activeView === 'size' && (
            <>
              <span><kbd>S</kbd> <kbd>M</kbd> <kbd>L</kbd> select size</span>
              <span><kbd>esc</kbd> back</span>
            </>
          )}
          {activeView === 'theme' && (
            <>
              <span><kbd>1</kbd>-<kbd>6</kbd> select theme</span>
              <span><kbd>D</kbd> toggle dark</span>
              <span><kbd>esc</kbd> back</span>
            </>
          )}
          {(activeView === 'skills' || activeView === 'contact') && (
            <span><kbd>esc</kbd> back</span>
          )}
        </div>
      </div>
    </>
  );
}

// Easter egg messages
const easterEggs: Record<string, { title: string; lines: string[]; accent: string }> = {
  enea: {
    title: 'ENEA',
    accent: '#00a3e0',
    lines: [
      '> SIGNAL DETECTED: ENEA',
      '',
      'Hey Enea,',
      '',
      'Really appreciate the intro—',
      'means a lot coming from you.',
      '',
      'Looking forward to seeing',
      'where this goes.',
      '',
      'Thanks for thinking of me.',
      '',
      '—A',
    ],
  },
  xai: {
    title: 'xAI',
    accent: '#000000',
    lines: [
      '> SIGNAL DETECTED: xAI',
      '',
      'Understanding the universe,',
      'one model at a time.',
      '',
      'I\'ve been building with LLMs daily—',
      'agentic workflows, RAG systems,',
      'and tools that amplify human capability.',
      '',
      'Ready to help Grok think bigger.',
      '',
      '— Arach',
    ],
  },
};

// Wrapper component that handles the keyboard shortcut and view mode
export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialView, setInitialView] = useState<'commands' | 'skills' | 'contact' | 'size' | 'theme'>('commands');
  const [viewMode, setViewMode] = useState<'detailed' | 'summary'>('detailed');
  const [easterEgg, setEasterEgg] = useState<string | null>(null);
  const keyBufferRef = useRef<string>('');

  // Initialize view mode from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('resume-view-mode');
    if (saved === 'summary' || saved === 'detailed') {
      setViewMode(saved);
    }
  }, []);

  // Apply view mode class to document
  useEffect(() => {
    const resume = document.querySelector('.tactical-resume');
    if (resume) {
      resume.classList.remove('view-detailed', 'view-summary');
      resume.classList.add(`view-${viewMode}`);
    }
    localStorage.setItem('resume-view-mode', viewMode);
  }, [viewMode]);

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'detailed' ? 'summary' : 'detailed');
  };

  // Easter egg key sequence detection
  useEffect(() => {
    const sequences = Object.keys(easterEggs);
    const maxLength = Math.max(...sequences.map(s => s.length));

    const handleKeyPress = (e: KeyboardEvent) => {
      // Skip if in input or if modals are open
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (isOpen || easterEgg) return;

      // Only track letter keys
      if (e.key.length === 1 && /[a-z]/i.test(e.key)) {
        keyBufferRef.current = (keyBufferRef.current + e.key.toLowerCase()).slice(-maxLength);

        // Check for matches
        for (const seq of sequences) {
          if (keyBufferRef.current.endsWith(seq)) {
            setEasterEgg(seq);
            keyBufferRef.current = '';
            break;
          }
        }
      }
    };

    // Clear buffer after 2 seconds of inactivity
    let clearTimer: NodeJS.Timeout;
    const handleKeyUp = () => {
      clearTimeout(clearTimer);
      clearTimer = setTimeout(() => {
        keyBufferRef.current = '';
      }, 2000);
    };

    document.addEventListener('keypress', handleKeyPress);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keypress', handleKeyPress);
      document.removeEventListener('keyup', handleKeyUp);
      clearTimeout(clearTimer);
    };
  }, [isOpen, easterEgg]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openPalette('commands');
      }
      // Skip shortcuts when typing in an input
      if (e.target instanceof HTMLInputElement) return;
      // Skip when palette is open (let it handle its own keys)
      if (isOpen) return;
      // Skip when easter egg is showing
      if (easterEgg) {
        if (e.key === 'Escape') {
          setEasterEgg(null);
        }
        return;
      }

      // V to toggle view mode
      if (e.key === 'v') {
        e.preventDefault();
        toggleViewMode();
      }
      // D to download PDF
      if (e.key === 'd') {
        e.preventDefault();
        const link = document.querySelector('.download-btn') as HTMLAnchorElement;
        if (link) link.click();
      }
      // S to open size picker
      if (e.key === 's') {
        e.preventDefault();
        openPalette('size');
      }
      // T to open theme picker
      if (e.key === 't') {
        e.preventDefault();
        openPalette('theme');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, easterEgg]);

  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const [fontSize, setFontSize] = useState<'S' | 'M' | 'L'>('M');

  // Initialize font size from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('resume-font-size');
    if (saved === 'S' || saved === 'M' || saved === 'L') {
      setFontSize(saved);
    }
  }, []);

  // Apply font size class to resume
  useEffect(() => {
    const resume = document.querySelector('.tactical-resume');
    if (resume) {
      resume.classList.remove('font-small', 'font-medium', 'font-large');
      resume.classList.add(`font-${fontSize === 'S' ? 'small' : fontSize === 'M' ? 'medium' : 'large'}`);
    }
    localStorage.setItem('resume-font-size', fontSize);
  }, [fontSize]);

  const [isDark, setIsDark] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('minimal');

  // Sync with theme state
  useEffect(() => {
    const updateThemeState = () => {
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
      const savedTheme = localStorage.getItem('cool-theme') || 'minimal';
      setCurrentTheme(savedTheme);
    };
    updateThemeState();

    // Listen for storage changes (from ThemePickerCool)
    window.addEventListener('storage', updateThemeState);
    const observer = new MutationObserver(updateThemeState);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => {
      window.removeEventListener('storage', updateThemeState);
      observer.disconnect();
    };
  }, []);

  const toggleDarkMode = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    // Find current theme object and apply with new dark mode setting
    const theme = themes.find(t => t.name === currentTheme) || themes[0];
    applyTheme(theme, newDark);
    // Dispatch event for ThemePickerCool to sync
    window.dispatchEvent(new CustomEvent('theme-change', { detail: { isDark: newDark } }));
  };

  const setTheme = (themeName: string) => {
    setCurrentTheme(themeName);
    // Find theme object and apply immediately (no reload!)
    const theme = themes.find(t => t.name === themeName) || themes[0];
    applyTheme(theme, isDark);
    // Trigger a storage event to sync with ThemePickerCool
    window.dispatchEvent(new StorageEvent('storage', { key: 'cool-theme', newValue: themeName }));
  };

  const openPalette = (view: 'commands' | 'skills' | 'contact' | 'size' | 'theme' = 'commands') => {
    setInitialView(view);
    setIsOpen(true);
  };

  return (
    <>
      {children}
      {/* Left toolbar: Actions */}
      <div className="resume-toolbar resume-toolbar-left">
        <button
          className="toolbar-section"
          onClick={toggleViewMode}
          title="Toggle view mode (V)"
        >
          <span className="toolbar-label">{viewMode === 'detailed' ? 'DETAILED' : 'SUMMARY'}</span>
          <kbd>V</kbd>
        </button>
        <span className="toolbar-divider" />
        <button
          className="toolbar-section"
          onClick={() => {
            const link = document.querySelector('.download-btn') as HTMLAnchorElement;
            if (link) link.click();
          }}
          title="Download PDF (D)"
        >
          <span className="toolbar-label">DOWNLOAD</span>
          <kbd>D</kbd>
        </button>
        <span className="toolbar-divider" />
        <button
          className="toolbar-section"
          onClick={() => openPalette('commands')}
          title="Open command palette"
        >
          <span className="toolbar-label">COMMANDS</span>
          <span className="toolbar-keys"><kbd>{isMac ? '⌘' : 'Ctrl'}</kbd><kbd>K</kbd></span>
        </button>
      </div>
      {/* Right toolbar: Display controls */}
      <div className="resume-toolbar resume-toolbar-right">
        <button
          className="toolbar-section"
          onClick={() => openPalette('size')}
          title="Change font size (S)"
        >
          <span className="toolbar-label">SIZE</span>
          <kbd>S</kbd>
        </button>
        <span className="toolbar-divider" />
        <button
          className="toolbar-section"
          onClick={() => openPalette('theme')}
          title="Change theme (T)"
        >
          <span className="toolbar-label">THEME</span>
          <kbd>T</kbd>
        </button>
      </div>
      <CommandPalette
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        viewMode={viewMode}
        onToggleViewMode={toggleViewMode}
        fontSize={fontSize}
        onSetFontSize={setFontSize}
        isDark={isDark}
        onToggleDarkMode={toggleDarkMode}
        currentTheme={currentTheme}
        onSetTheme={setTheme}
        initialView={initialView}
      />

      {/* Easter egg overlay */}
      {easterEgg && easterEggs[easterEgg] && (
        <>
          <div
            className="easter-egg-backdrop"
            onClick={() => setEasterEgg(null)}
          />
          <div
            className="easter-egg-modal"
            style={{ '--egg-accent': easterEggs[easterEgg].accent } as React.CSSProperties}
          >
            <div className="easter-egg-content">
              {easterEggs[easterEgg].lines.map((line, i) => (
                <div
                  key={i}
                  className={`easter-egg-line ${line.startsWith('>') ? 'easter-egg-signal' : ''} ${line.startsWith('—') ? 'easter-egg-signature' : ''}`}
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  {line || '\u00A0'}
                </div>
              ))}
            </div>
            <div className="easter-egg-hint">press esc to close</div>
          </div>
        </>
      )}
    </>
  );
}
