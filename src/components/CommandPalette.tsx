import { useState, useEffect, useRef, useCallback } from 'react';
import { resumeData } from '../data/resume';

// Theme definitions (matching ThemePickerCool)
const themes = [
  { name: 'minimal', displayName: 'Minimal', colors: { bg: '#ffffff', accent: '#18181b' } },
  { name: 'midnight', displayName: 'Midnight', colors: { bg: '#e1e7f5', accent: '#3b82f6' } },
  { name: 'ocean', displayName: 'Ocean', colors: { bg: '#f0f9ff', accent: '#0284c7' } },
  { name: 'sunset', displayName: 'Sunset', colors: { bg: '#fffbeb', accent: '#f59e0b' } },
  { name: 'neon', displayName: 'Neon', colors: { bg: '#fdf4ff', accent: '#d946ef' } },
  { name: 'paper', displayName: 'Paper', colors: { bg: '#fafaf9', accent: '#92400e' } },
];

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
    {
      id: 'view-mode',
      label: viewMode === 'detailed' ? 'Switch to Summary View' : 'Switch to Detailed View',
      shortcut: 'V',
      action: () => {
        onToggleViewMode();
        onClose();
      },
      category: 'Views',
    },
    {
      id: 'skills',
      label: 'View Systems Status',
      shortcut: 'S',
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
      id: 'theme',
      label: 'Toggle Theme',
      shortcut: 'T',
      action: () => {
        const themeBtn = document.getElementById('theme-btn');
        if (themeBtn) themeBtn.click();
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

    if (e.key === 'Escape') {
      if (activeView !== 'commands') {
        setActiveView('commands');
      } else {
        onClose();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, filteredCommands.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      e.preventDefault();
      filteredCommands[selectedIndex].action();
    }
  }, [isOpen, filteredCommands, selectedIndex, activeView, onClose]);

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
                          <span className="command-shortcut">{cmd.shortcut}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
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
                  <span className="settings-option-label">{isDark ? 'DARK MODE' : 'LIGHT MODE'}</span>
                  <span className="settings-option-icon">{isDark ? '☾' : '☀'}</span>
                </button>
                <div className="settings-divider" />
                {/* Theme options */}
                {themes.map((theme) => (
                  <button
                    key={theme.name}
                    className={`settings-option ${currentTheme === theme.name ? 'active' : ''}`}
                    onClick={() => { onSetTheme(theme.name); onClose(); }}
                  >
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

        {/* Footer */}
        <div className="command-palette-footer">
          <span><kbd>↑↓</kbd> navigate</span>
          <span><kbd>↵</kbd> select</span>
          <span><kbd>esc</kbd> close</span>
        </div>
      </div>
    </>
  );
}

// Wrapper component that handles the keyboard shortcut and view mode
export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialView, setInitialView] = useState<'commands' | 'skills' | 'contact' | 'size' | 'theme'>('commands');
  const [viewMode, setViewMode] = useState<'detailed' | 'summary'>('detailed');

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
  }, [isOpen]);

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
    document.documentElement.setAttribute('data-theme', newDark ? 'dark' : 'light');
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
    // Dispatch event for ThemePickerCool to sync
    window.dispatchEvent(new CustomEvent('theme-change', { detail: { isDark: newDark } }));
  };

  const setTheme = (themeName: string) => {
    setCurrentTheme(themeName);
    localStorage.setItem('cool-theme', themeName);
    // Trigger a storage event to sync with ThemePickerCool
    window.dispatchEvent(new StorageEvent('storage', { key: 'cool-theme', newValue: themeName }));
    // Reload to apply theme (ThemePickerCool will pick it up)
    window.location.reload();
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
    </>
  );
}
