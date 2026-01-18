import { useState, useEffect, useRef } from 'react';

interface ConsoleHeaderProps {
  name: string;
  title: string;
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
}

export default function ConsoleHeader({ name, title, oneLiner, locationLine, contact }: ConsoleHeaderProps) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [currentText, setCurrentText] = useState<string>('');
  const [isTyping, setIsTyping] = useState(true);
  const [bootComplete, setBootComplete] = useState(false);
  const [shimmerActive, setShimmerActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentYear = new Date().getFullYear();
  const docId = `ID-001-${currentYear}`;

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

  // Track where ASCII art starts and ends in logLines
  const asciiStartIndex = 3; // After [INIT], [AUTH], and empty line
  const asciiEndIndex = asciiStartIndex + asciiArt.length;

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
    { text: `[LINK] github.com/${contact.github}`, type: 'info', delay: 2000 },
    { text: `[LINK] linkedin.com/in/${contact.linkedin}`, type: 'info', delay: 2100 },
    { text: `[LINK] x.com/${contact.twitter}`, type: 'info', delay: 2200 },
    { text: '', type: 'system', delay: 2400 },
    { text: `[SYS] Document ${docId} loaded successfully`, type: 'success', delay: 2500 },
    { text: `[SYS] Ready. Scroll to view operational history.`, type: 'system', delay: 2700 },
  ];

  useEffect(() => {
    // Sequential reveal of lines with typewriter effect
    let lineIndex = 0;
    let charIndex = 0;
    let currentLineText = '';

    const typeNextChar = () => {
      if (lineIndex >= logLines.length) {
        setIsTyping(false);
        setBootComplete(true);
        return;
      }

      const line = logLines[lineIndex];

      if (charIndex === 0) {
        // Start of new line - set the delay
        setTimeout(() => {
          typeChar();
        }, lineIndex === 0 ? 0 : 30);
      } else {
        typeChar();
      }
    };

    const typeChar = () => {
      if (lineIndex >= logLines.length) {
        setIsTyping(false);
        setBootComplete(true);
        return;
      }

      const line = logLines[lineIndex];

      if (charIndex < line.text.length) {
        currentLineText = line.text.slice(0, charIndex + 1);
        setCurrentText(currentLineText);
        charIndex++;
        // Faster typing for ASCII art, slower for text
        const speed = line.type === 'ascii' ? 2 : (Math.random() * 15 + 10);
        setTimeout(typeNextChar, speed);
      } else {
        // Line complete - move to next line
        setVisibleLines(prev => prev + 1);
        setCurrentText('');
        lineIndex++;
        charIndex = 0;
        currentLineText = '';

        if (lineIndex < logLines.length) {
          const nextDelay = logLines[lineIndex].delay - logLines[lineIndex - 1].delay;
          setTimeout(typeNextChar, Math.max(nextDelay, 50));
        } else {
          setIsTyping(false);
          setBootComplete(true);
        }
      }
    };

    // Start the sequence
    setTimeout(typeNextChar, 300);

    return () => {
      // Cleanup timeouts on unmount
    };
  }, []);

  // Trigger shimmer once after ASCII art finishes rendering
  useEffect(() => {
    if (visibleLines === asciiEndIndex) {
      // Small delay before shimmer starts
      const timer = setTimeout(() => {
        setShimmerActive(true);
        // Remove shimmer class after animation completes
        setTimeout(() => setShimmerActive(false), 1200);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [visibleLines, asciiEndIndex]);

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

  return (
    <div className="console-header" ref={containerRef}>
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
          const isLastAscii = i === asciiEndIndex - 1;

          // Wrap ASCII lines in a container for hover effect
          if (isFirstAscii) {
            return (
              <div key={i} className={`console-ascii-container ${shimmerActive ? 'shimmer' : ''}`}>
                <div className={`console-line ${getLineClass(line.type)}`}>
                  {line.text}
                </div>
                {/* Rest of ASCII lines will be rendered inside */}
                {logLines.slice(asciiStartIndex + 1, Math.min(visibleLines, asciiEndIndex)).map((asciiLine, j) => (
                  <div key={`ascii-${j}`} className={`console-line ${getLineClass(asciiLine.type)}`}>
                    {asciiLine.text}
                  </div>
                ))}
              </div>
            );
          }

          // Skip other ASCII lines as they're rendered in the container above
          if (isAsciiLine) return null;

          return (
            <div key={i} className={`console-line ${getLineClass(line.type)}`}>
              {line.text}
            </div>
          );
        })}
        {isTyping && visibleLines < logLines.length && (
          <div className={`console-line ${getLineClass(logLines[visibleLines].type)}`}>
            {currentText}
            <span className="console-cursor">▌</span>
          </div>
        )}
      </div>
    </div>
  );
}
