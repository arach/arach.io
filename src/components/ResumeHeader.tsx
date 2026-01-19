import { useState, useEffect, useRef } from 'react';

interface ResumeHeaderProps {
  name: string;
  title: string;
  location: string;
  oneLiner: string;
  locationLine: string;
  contact: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
    email?: string;
  };
}

interface LogLine {
  text: string;
  type: 'system' | 'success' | 'info' | 'data' | 'highlight' | 'ascii';
  delay: number;
  href?: string;
}

export default function ResumeHeader({ name, title, location, oneLiner, locationLine, contact }: ResumeHeaderProps) {
  const [consoleMode, setConsoleMode] = useState(false);
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [currentText, setCurrentText] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [shimmerActive, setShimmerActive] = useState(false);
  const nameRef = useRef<HTMLHeadingElement>(null);

  const currentYear = new Date().getFullYear();
  const docId = `ID-001-${currentYear}`;

  // Handle Cmd+Click on name to toggle console mode
  const handleNameClick = (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey) {
      e.preventDefault();
      setConsoleMode(true);
    }
  };

  // Listen for custom event to activate console mode (from command palette)
  useEffect(() => {
    const handleActivateConsole = () => setConsoleMode(true);
    const handleDeactivateConsole = () => {
      setConsoleMode(false);
      setVisibleLines(0);
      setCurrentText('');
      setIsTyping(false);
    };

    window.addEventListener('activate-console-mode', handleActivateConsole);
    window.addEventListener('deactivate-console-mode', handleDeactivateConsole);

    return () => {
      window.removeEventListener('activate-console-mode', handleActivateConsole);
      window.removeEventListener('deactivate-console-mode', handleDeactivateConsole);
    };
  }, []);

  // Handle Escape key to exit console mode
  useEffect(() => {
    if (!consoleMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setConsoleMode(false);
        setVisibleLines(0);
        setCurrentText('');
        setIsTyping(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [consoleMode]);

  // ASCII art - figlet standard font
  const asciiArt = [
    '    _                   _',
    '   / \\   _ __ __ _  ___| |__',
    '  / _ \\ | \'__/ _` |/ __| \'_ \\',
    ' / ___ \\| | | (_| | (__| | | |',
    '/_/   \\_\\_|  \\__,_|\\___|_| |_|                _',
    '|_   _|__| |__   ___  _   _ _ __   __ _ _ __ (_)',
    '  | |/ __| \'_ \\ / _ \\| | | | \'_ \\ / _` | \'_ \\| |',
    '  | | (__| | | | (_) | |_| | |_) | (_| | | | | |',
    '  |_|\\___|_| |_|\\___/ \\__,_| .__/ \\__,_|_| |_|_|',
    '                           |_|',
  ];

  const asciiStartIndex = 3;
  const asciiEndIndex = asciiStartIndex + asciiArt.length;
  const githubUrl = `https://github.com/${contact.github}`;
  const linkedinUrl = `https://linkedin.com/in/${contact.linkedin}`;
  const twitterUrl = `https://x.com/${contact.twitter}`;

  const logLines: LogLine[] = [
    { text: `[INIT] Loading candidate profile...`, type: 'system', delay: 0 },
    { text: `[AUTH] Security clearance: VERIFIED`, type: 'success', delay: 400 },
    { text: '', type: 'system', delay: 600 },
    ...asciiArt.map((line, i) => ({ text: line, type: 'ascii' as const, delay: 700 + i * 50 })),
    { text: '', type: 'system', delay: 1000 },
    { text: `[DATA] Designation: ${name.toUpperCase()}`, type: 'data', delay: 1100 },
    { text: `[DATA] Classification: ${title.toUpperCase()}`, type: 'data', delay: 1300 },
    { text: `[DATA] ${oneLiner}`, type: 'highlight', delay: 1500 },
    { text: `[DATA] Status: ${locationLine}`, type: 'info', delay: 1700 },
    { text: '', type: 'system', delay: 1900 },
    { text: `[LINK] ${githubUrl}`, type: 'info', delay: 2000, href: githubUrl },
    { text: `[LINK] ${linkedinUrl}`, type: 'info', delay: 2100, href: linkedinUrl },
    { text: `[LINK] ${twitterUrl}`, type: 'info', delay: 2200, href: twitterUrl },
    { text: '', type: 'system', delay: 2400 },
    { text: `[SYS] Document ${docId} loaded successfully`, type: 'success', delay: 2500 },
    { text: `[SYS] Ready. Scroll to view operational history.`, type: 'system', delay: 2700 },
  ];

  // Start typewriter effect when console mode is activated
  useEffect(() => {
    if (!consoleMode) return;

    setIsTyping(true);
    setVisibleLines(0);
    setCurrentText('');

    let lineIndex = 0;
    let charIndex = 0;

    const typeNextChar = () => {
      if (lineIndex >= logLines.length) {
        setIsTyping(false);
        return;
      }

      const line = logLines[lineIndex];

      if (charIndex === 0) {
        setTimeout(typeChar, lineIndex === 0 ? 0 : 30);
      } else {
        typeChar();
      }
    };

    const typeChar = () => {
      if (lineIndex >= logLines.length) {
        setIsTyping(false);
        return;
      }

      const line = logLines[lineIndex];

      if (charIndex < line.text.length) {
        setCurrentText(line.text.slice(0, charIndex + 1));
        charIndex++;
        const speed = line.type === 'ascii' ? 2 : (Math.random() * 15 + 10);
        setTimeout(typeNextChar, speed);
      } else {
        setVisibleLines(prev => prev + 1);
        setCurrentText('');
        lineIndex++;
        charIndex = 0;

        if (lineIndex < logLines.length) {
          const nextDelay = logLines[lineIndex].delay - logLines[lineIndex - 1].delay;
          setTimeout(typeNextChar, Math.max(nextDelay, 50));
        } else {
          setIsTyping(false);
        }
      }
    };

    setTimeout(typeNextChar, 300);
  }, [consoleMode]);

  // Trigger shimmer after ASCII art finishes
  useEffect(() => {
    if (consoleMode && visibleLines === asciiEndIndex) {
      const timer = setTimeout(() => {
        setShimmerActive(true);
        setTimeout(() => setShimmerActive(false), 1200);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [consoleMode, visibleLines]);

  const getLineClass = (type: LogLine['type']) => {
    switch (type) {
      case 'system': return 'console-line-system';
      case 'success': return 'console-line-success';
      case 'info': return 'console-line-info';
      case 'data': return 'console-line-data';
      case 'highlight': return 'console-line-highlight';
      case 'ascii': return 'console-line-ascii';
      default: return '';
    }
  };

  const renderConsoleLine = (line: LogLine, textOverride?: string) => {
    const text = textOverride ?? line.text;

    if (!line.href) return text;

    return (
      <a className="console-link" href={line.href} target="_blank" rel="noopener noreferrer">
        {text}
      </a>
    );
  };

  // Default header view
  if (!consoleMode) {
    return (
      <header className="resume-header">
        <h1
          ref={nameRef}
          className="resume-name resume-name-clickable"
          onClick={handleNameClick}
          title="Cmd+Click for console mode"
        >
          {name.replace(' ', '_').toUpperCase()}
        </h1>
        <div className="resume-subtitle">
          <span className="resume-title">{title.toUpperCase()}</span>
          <span className="resume-divider">|</span>
          <span className="resume-location">{location.toUpperCase().replace(/ /g, '_')}</span>
        </div>

        <div className="comm-channels">
          {contact.github && (
            <a href={`https://github.com/${contact.github}`} className="comm-link" target="_blank" rel="noopener" title="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
              <span>@{contact.github}</span>
            </a>
          )}
          {contact.twitter && (
            <a href={`https://x.com/${contact.twitter}`} className="comm-link" target="_blank" rel="noopener" title="X (Twitter)">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              <span>@{contact.twitter}</span>
            </a>
          )}
          {contact.linkedin && (
            <a href={`https://linkedin.com/in/${contact.linkedin}`} className="comm-link" target="_blank" rel="noopener" title="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              <span>in/{contact.linkedin}</span>
            </a>
          )}
        </div>

        <div className="tactical-id">{docId}</div>
      </header>
    );
  }

  // Console mode view
  return (
    <div className="console-header">
      <div className="console-chrome">
        <div className="console-dots">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
        </div>
        <div className="console-title">arach@arach.io:~</div>
        <div className="console-id">{docId}</div>
      </div>
      <div className="console-body">
        {logLines.slice(0, visibleLines).map((line, i) => {
          const isAsciiLine = line.type === 'ascii';
          const isFirstAscii = i === asciiStartIndex;

          if (isFirstAscii) {
            return (
              <div key={i} className={`console-ascii-container ${shimmerActive ? 'shimmer' : ''}`}>
                <div className={`console-line ${getLineClass(line.type)}`}>
                  {line.text}
                </div>
                {logLines.slice(asciiStartIndex + 1, Math.min(visibleLines, asciiEndIndex)).map((asciiLine, j) => (
                  <div key={`ascii-${j}`} className={`console-line ${getLineClass(asciiLine.type)}`}>
                    {asciiLine.text}
                  </div>
                ))}
              </div>
            );
          }

          if (isAsciiLine) return null;

          return (
            <div key={i} className={`console-line ${getLineClass(line.type)}`}>
              {renderConsoleLine(line)}
            </div>
          );
        })}
        {isTyping && visibleLines < logLines.length && (
          <div className={`console-line ${getLineClass(logLines[visibleLines].type)}`}>
            {renderConsoleLine(logLines[visibleLines], currentText)}
            <span className="console-cursor">▌</span>
          </div>
        )}
      </div>
    </div>
  );
}
