// Console art and DevTools easter eggs for arach.io resume

export function initConsoleArt() {
  // Only run in browser
  if (typeof window === 'undefined') return;

  // Get theme colors from CSS variables
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);

  // Determine if dark mode
  const isDark = root.getAttribute('data-theme') === 'dark';

  // Tactical color palette
  const colors = {
    primary: isDark ? '#00b4d8' : '#0088cc',      // Tactical blue
    highlight: isDark ? '#00ffd1' : '#00c896',    // Highlight cyan/green
    success: '#28c940',
    warning: '#fbbf24',
    error: '#ff4444',
    muted: isDark ? '#a0a0a0' : '#646464',
    text: isDark ? '#f0f0f0' : '#1e1e1e'
  };

  // Monospace font
  const monoFont = '"Space Mono", "Fira Code", monospace';

  // ASCII art banner - tactical/military style
  const asciiArt = `
%c
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║    ▄▀▄ █▀▄ ▄▀▄ ▄▀▀ █ █   ▀█▀ ▄▀▀ █ █ ▄▀▄ █ █ █▀▄ ▄▀▄ █▀▄ █                 ║
║    █▀█ █▀▄ █▀█ █   █▀█    █  █   █▀█ █ █ █ █ █▀  █▀█ █ █ █                 ║
║    ▀ ▀ ▀ ▀ ▀ ▀ ▀▀▀ ▀ ▀    ▀  ▀▀▀ ▀ ▀ ▀▄▀ ▀▄█ ▀   ▀ ▀ ▀ ▀ ▀                 ║
║                                                                              ║
║    [SYSTEM] Candidate Profile Terminal v2.0                                  ║
║    [STATUS] OPERATIONAL                                                      ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

%c[ACCESS GRANTED] Security clearance verified
%c[DATA LOADED] Engineering leader with 15+ years operational history

%cAvailable commands:
%c  resume.help()     %c- Display this help message
%c  resume.summary()  %c- Quick career summary
%c  resume.skills()   %c- Technical capabilities matrix
%c  resume.contact()  %c- Initiate contact protocol
%c  resume.download() %c- Download PDF dossier
%c  resume.matrix()   %c- Tactical data visualization
%c  resume.scan()     %c- Run system diagnostic
%c  resume.clear()    %c- Clear terminal

`;

  // Style definitions for the ASCII art
  const styles = [
    `color: ${colors.primary}; font-family: ${monoFont}; font-size: 10px; line-height: 1.2;`, // ASCII art
    `color: ${colors.success}; font-family: ${monoFont}; font-size: 11px;`, // Access granted
    `color: ${colors.highlight}; font-family: ${monoFont}; font-size: 11px;`, // Data loaded
    `color: ${colors.muted}; font-size: 12px; font-weight: 500; margin-top: 8px;`, // Available commands header
    `color: ${colors.primary}; font-family: ${monoFont}; font-size: 11px;`, // Command
    `color: ${colors.muted}; font-size: 11px;`, // Description
    `color: ${colors.primary}; font-family: ${monoFont}; font-size: 11px;`,
    `color: ${colors.muted}; font-size: 11px;`,
    `color: ${colors.primary}; font-family: ${monoFont}; font-size: 11px;`,
    `color: ${colors.muted}; font-size: 11px;`,
    `color: ${colors.primary}; font-family: ${monoFont}; font-size: 11px;`,
    `color: ${colors.muted}; font-size: 11px;`,
    `color: ${colors.primary}; font-family: ${monoFont}; font-size: 11px;`,
    `color: ${colors.muted}; font-size: 11px;`,
    `color: ${colors.primary}; font-family: ${monoFont}; font-size: 11px;`,
    `color: ${colors.muted}; font-size: 11px;`,
    `color: ${colors.primary}; font-family: ${monoFont}; font-size: 11px;`,
    `color: ${colors.muted}; font-size: 11px;`,
    `color: ${colors.primary}; font-family: ${monoFont}; font-size: 11px;`,
    `color: ${colors.muted}; font-size: 11px;`,
  ];

  // Clear any existing logs (like Astro dev logs) and print the banner
  console.clear();
  console.log(asciiArt, ...styles);

  // Create the resume global object with commands
  const resume = {
    help() {
      console.log(`
%c╔══════════════════════════════════════════════════════════════════════════════╗
║                          TACTICAL CONSOLE - HELP                             ║
╚══════════════════════════════════════════════════════════════════════════════╝

%c[COMMANDS]

%c  resume.help()      %c- You're looking at it
%c  resume.summary()   %c- Executive career summary
%c  resume.skills()    %c- Technical capabilities breakdown
%c  resume.experience()%c- Operational history details
%c  resume.contact()   %c- Contact information
%c  resume.download()  %c- Open PDF resume download
%c  resume.matrix()    %c- Run tactical data visualization
%c  resume.scan()      %c- System diagnostic (fun animation)
%c  resume.clear()     %c- Clear terminal output

%c[KEYBOARD]
%c  Cmd/Ctrl + K       - Open command palette on page

%c[EASTER EGGS]
%c  Find them yourself ;)
`,
        `color: ${colors.primary}; font-family: ${monoFont};`,
        `color: ${colors.highlight}; font-weight: bold; font-size: 12px;`,
        `color: ${colors.primary}; font-family: ${monoFont};`, `color: ${colors.muted};`,
        `color: ${colors.primary}; font-family: ${monoFont};`, `color: ${colors.muted};`,
        `color: ${colors.primary}; font-family: ${monoFont};`, `color: ${colors.muted};`,
        `color: ${colors.primary}; font-family: ${monoFont};`, `color: ${colors.muted};`,
        `color: ${colors.primary}; font-family: ${monoFont};`, `color: ${colors.muted};`,
        `color: ${colors.primary}; font-family: ${monoFont};`, `color: ${colors.muted};`,
        `color: ${colors.primary}; font-family: ${monoFont};`, `color: ${colors.muted};`,
        `color: ${colors.primary}; font-family: ${monoFont};`, `color: ${colors.muted};`,
        `color: ${colors.primary}; font-family: ${monoFont};`, `color: ${colors.muted};`,
        `color: ${colors.warning}; font-weight: bold; font-size: 12px;`,
        `color: ${colors.muted};`,
        `color: ${colors.success}; font-weight: bold; font-size: 12px;`,
        `color: ${colors.muted}; font-style: italic;`
      );
    },

    summary() {
      console.log(`
%c╔══════════════════════════════════════════════════════════════════════════════╗
║                        CANDIDATE PROFILE SUMMARY                             ║
╚══════════════════════════════════════════════════════════════════════════════╝

%c[DESIGNATION]  %cArach Tchoupani
%c[ROLE]         %cEngineering Leader & Founder
%c[STATUS]       %c3x CTO/VP Eng · 1 exit · 15 yrs building teams 0 to 50+
%c[LOCATION]     %cMontreal · Open to relocate · TN/O1 eligible

%c[OPERATIONAL METRICS]
%c┌─────────────────────────────────────────────────────────────────┐
│  Total Experience:  15+ years                                   │
│  Leadership Years:  10+ years                                   │
│  Executive Years:   5+ years (CTO/VP level)                     │
│  Teams Built:       0 → 50+ engineers                           │
│  Successful Exit:   1 (Breathe Life → Zinnia)                   │
└─────────────────────────────────────────────────────────────────┘

%c[NOTABLE OPERATIONS]
%c  • Meta            - Engineering Manager, Creator Platform
  • Breathe Life    - Co-Founder & CTO, $15M raised, acquired
  • Primary.com     - CTO, seed to $70M/yr revenue
  • Lot18           - Engineer → CTO progression

%c[END SUMMARY]
`,
        `color: ${colors.primary}; font-family: ${monoFont};`,
        `color: ${colors.muted};`, `color: ${colors.text}; font-weight: bold;`,
        `color: ${colors.muted};`, `color: ${colors.text};`,
        `color: ${colors.muted};`, `color: ${colors.highlight}; font-weight: bold;`,
        `color: ${colors.muted};`, `color: ${colors.text};`,
        `color: ${colors.warning}; font-weight: bold; font-size: 12px;`,
        `color: ${colors.primary}; font-family: ${monoFont};`,
        `color: ${colors.success}; font-weight: bold; font-size: 12px;`,
        `color: ${colors.muted};`,
        `color: ${colors.muted}; font-style: italic;`
      );
    },

    skills() {
      console.log(`
%c╔══════════════════════════════════════════════════════════════════════════════╗
║                         TECHNICAL CAPABILITIES MATRIX                        ║
╚══════════════════════════════════════════════════════════════════════════════╝

%c[LANGUAGES]
%c  TypeScript/JS  ████████████████████████ 95%
  Python         ████████████████████████ 95%
  Swift          ████████████████████     85%
  Golang         ██████████████████       75%
  Ruby           ██████████████████       75%

%c[FRONTEND]
%c  React/Next.js  ████████████████████████████ 100%
  SwiftUI        ████████████████████████     90%
  Tailwind CSS   ████████████████████████████ 100%

%c[BACKEND]
%c  Node.js        ████████████████████████     92%
  PostgreSQL     ████████████████████████     90%
  GraphQL        ████████████████████         80%

%c[INFRASTRUCTURE]
%c  AWS            ████████████████████████     88%
  Kubernetes     ████████████████████         80%
  Terraform      ████████████████████         80%
  CI/CD          ████████████████████████     90%

%c[AI/ML]
%c  LLMs           ████████████████████████     85%
  RAG Systems    ████████████████████         80%
  Agentic Dev    ████████████████████████     90%

%c[LEADERSHIP]
%c  Team Building  ████████████████████████████ 94%
  Tech Strategy  ████████████████████████████ 96%
  M&A/Exits      ████████████████████████     90%
  Fundraising    ████████████████████████     88%

%c[MATRIX COMPLETE]
`,
        `color: ${colors.primary}; font-family: ${monoFont};`,
        `color: ${colors.highlight}; font-weight: bold;`,
        `color: ${colors.primary}; font-family: ${monoFont}; font-size: 10px;`,
        `color: ${colors.highlight}; font-weight: bold;`,
        `color: ${colors.primary}; font-family: ${monoFont}; font-size: 10px;`,
        `color: ${colors.highlight}; font-weight: bold;`,
        `color: ${colors.primary}; font-family: ${monoFont}; font-size: 10px;`,
        `color: ${colors.highlight}; font-weight: bold;`,
        `color: ${colors.primary}; font-family: ${monoFont}; font-size: 10px;`,
        `color: ${colors.highlight}; font-weight: bold;`,
        `color: ${colors.primary}; font-family: ${monoFont}; font-size: 10px;`,
        `color: ${colors.highlight}; font-weight: bold;`,
        `color: ${colors.primary}; font-family: ${monoFont}; font-size: 10px;`,
        `color: ${colors.success}; font-style: italic;`
      );
    },

    experience() {
      console.log(`
%c╔══════════════════════════════════════════════════════════════════════════════╗
║                           OPERATIONAL HISTORY                                ║
╚══════════════════════════════════════════════════════════════════════════════╝

%c[2024-PRESENT] jdi.sh - Founder
%c  Technical sabbatical to rebuild hands-on skills
  Building Talkie (usetalkie.com) - native voice-to-action app
  Deep dive into AI-native development workflows

%c[2022-2023] Meta - Engineering Manager
%c  • 3 teams, 12 engineers
  • Launched Creator Education to 20M+ creators
  • Powered Meta Verified launch support experience

%c[2018-2021] Breathe Life - CTO & Co-Founder %c[EXIT]
%c  • Built 20-person engineering org from scratch
  • Raised $15M, scaled to $3M+ ARR
  • Acquired by SE2 LLC (Zinnia)

%c[2014-2015] Primary.com - CTO
%c  • Employee #2 at seed stage
  • Built technical foundation to $10M+/yr ARR
  • Company grew to $70M/yr by 2020

%c[2011-2014] Lot18 - Engineer → CTO
%c  • Grew from senior engineer to CTO
  • Launched first personalized wine club in US
  • $30M+/yr GMV

%c[FULL HISTORY] %cScroll up on the page for complete details
`,
        `color: ${colors.primary}; font-family: ${monoFont};`,
        `color: ${colors.highlight}; font-weight: bold;`,
        `color: ${colors.muted};`,
        `color: ${colors.highlight}; font-weight: bold;`,
        `color: ${colors.muted};`,
        `color: ${colors.highlight}; font-weight: bold;`, `color: ${colors.success}; font-weight: bold;`,
        `color: ${colors.muted};`,
        `color: ${colors.highlight}; font-weight: bold;`,
        `color: ${colors.muted};`,
        `color: ${colors.highlight}; font-weight: bold;`,
        `color: ${colors.muted};`,
        `color: ${colors.warning}; font-weight: bold;`, `color: ${colors.muted};`
      );
    },

    contact() {
      console.log(`
%c╔══════════════════════════════════════════════════════════════════════════════╗
║                          CONTACT PROTOCOL                                    ║
╚══════════════════════════════════════════════════════════════════════════════╝

%c[SECURE CHANNELS]
`,
        `color: ${colors.primary}; font-family: ${monoFont};`,
        `color: ${colors.highlight}; font-weight: bold; font-size: 12px;`
      );

      // Log clickable links
      console.log(`%c  Email:     %cmailto:arach@tchoupani.com`, `color: ${colors.muted};`, `color: ${colors.highlight}; font-family: ${monoFont};`);
      console.log(`             `, 'mailto:arach@tchoupani.com');
      console.log(`%c  GitHub:    %chttps://github.com/arach`, `color: ${colors.muted};`, `color: ${colors.highlight}; font-family: ${monoFont};`);
      console.log(`             `, 'https://github.com/arach');
      console.log(`%c  LinkedIn:  %chttps://linkedin.com/in/arach`, `color: ${colors.muted};`, `color: ${colors.highlight}; font-family: ${monoFont};`);
      console.log(`             `, 'https://linkedin.com/in/arach');
      console.log(`%c  Twitter:   %chttps://x.com/arach_tchoupani`, `color: ${colors.muted};`, `color: ${colors.highlight}; font-family: ${monoFont};`);
      console.log(`             `, 'https://x.com/arach_tchoupani');
      console.log(`%c  Website:   %chttps://arach.io`, `color: ${colors.muted};`, `color: ${colors.highlight}; font-family: ${monoFont};`);
      console.log(`             `, 'https://arach.io');

      console.log(`
%c[RESPONSE PROTOCOL]
%c  • Email: 24-48 hours typical response
  • LinkedIn: Active, accepts connections
  • GitHub: Check regularly for issues/PRs

%c[AVAILABILITY]
%c  • Location: Montreal, Canada
  • Open to: Relocation (TN/O1 eligible)
  • Interests: Leadership roles, AI/ML, startups

%c[INITIATE CONTACT] %cEmail preferred for serious inquiries
`,
        `color: ${colors.warning}; font-weight: bold; font-size: 12px;`,
        `color: ${colors.muted};`,
        `color: ${colors.success}; font-weight: bold; font-size: 12px;`,
        `color: ${colors.muted};`,
        `color: ${colors.primary}; font-weight: bold;`, `color: ${colors.muted}; font-style: italic;`
      );
    },

    download() {
      console.log(`%c[INITIATING] PDF download protocol...`, `color: ${colors.primary};`);

      // Try to trigger PDF download
      const pdfLink = document.querySelector('a[href*=".pdf"][download]') as HTMLAnchorElement;
      if (pdfLink) {
        pdfLink.click();
        console.log(`%c[SUCCESS] Download initiated`, `color: ${colors.success};`);
      } else {
        // Fallback to known PDF URL
        window.open('/Arach_Tchoupani_Resume.pdf', '_blank');
        console.log(`%c[SUCCESS] PDF opened in new tab`, `color: ${colors.success};`);
      }
    },

    matrix() {
      console.log('%c[INITIATING] Tactical data visualization...', `color: ${colors.primary};`);

      let matrixInterval: ReturnType<typeof setInterval>;
      let count = 0;
      const maxLines = 25;

      const dataChars = '█▓▒░│├┤┬┴┼─═║╔╗╚╝01ABCDEF';

      const generateDataLine = () => {
        let line = '';
        const styles: string[] = [];
        for (let i = 0; i < 60; i++) {
          if (Math.random() > 0.85) {
            line += '%c' + dataChars[Math.floor(Math.random() * dataChars.length)];
            const brightness = 0.3 + Math.random() * 0.7;
            styles.push(`color: rgba(0, 180, 216, ${brightness}); font-family: ${monoFont};`);
          } else {
            line += ' ';
          }
        }
        return { line, styles };
      };

      matrixInterval = setInterval(() => {
        const { line, styles } = generateDataLine();
        console.log(line, ...styles);
        count++;

        if (count >= maxLines) {
          clearInterval(matrixInterval);
          console.log('%c[COMPLETE] Data visualization terminated', `color: ${colors.success};`);
        }
      }, 80);
    },

    scan() {
      console.log('%c[SCAN] Initiating system diagnostic...', `color: ${colors.primary};`);

      const steps = [
        { delay: 300, msg: '[SCAN] Checking neural pathways...', color: colors.muted },
        { delay: 600, msg: '[OK] Leadership protocols: OPERATIONAL', color: colors.success },
        { delay: 900, msg: '[SCAN] Analyzing technical stack...', color: colors.muted },
        { delay: 1200, msg: '[OK] Frontend systems: OPTIMAL', color: colors.success },
        { delay: 1500, msg: '[OK] Backend systems: OPTIMAL', color: colors.success },
        { delay: 1800, msg: '[OK] Infrastructure: STABLE', color: colors.success },
        { delay: 2100, msg: '[SCAN] Verifying experience matrix...', color: colors.muted },
        { delay: 2400, msg: '[OK] 15+ years logged', color: colors.success },
        { delay: 2700, msg: '[OK] Exit achievement unlocked', color: colors.highlight },
        { delay: 3000, msg: '[COMPLETE] All systems nominal', color: colors.success },
        { delay: 3300, msg: '[READY] Candidate profile verified', color: colors.highlight },
      ];

      steps.forEach(({ delay, msg, color }) => {
        setTimeout(() => {
          console.log(`%c${msg}`, `color: ${color}; font-family: ${monoFont};`);
        }, delay);
      });
    },

    clear() {
      console.clear();
      console.log('%c[CLEARED] Terminal reset', `color: ${colors.muted};`);
      console.log(`%cType %cresume.help()%c for available commands`,
        `color: ${colors.muted};`,
        `color: ${colors.primary}; font-family: ${monoFont};`,
        `color: ${colors.muted};`
      );
    }
  };

  // Attach to window
  (window as any).resume = resume;

  // Konami code easter egg
  let konamiSequence: string[] = [];
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

  document.addEventListener('keydown', (e) => {
    konamiSequence.push(e.key);
    konamiSequence = konamiSequence.slice(-10);

    if (konamiSequence.join(',') === konamiCode.join(',')) {
      console.log(`
%c╔══════════════════════════════════════════════════════════════════════════════╗
║                          [SECRET UNLOCKED]                                   ║
╚══════════════════════════════════════════════════════════════════════════════╝
%c
  You found the konami code! Here's a secret:

  I once debugged a production issue at 3am while on a flight
  with nothing but a phone hotspot and vim on a tiny laptop.
  The fix? A single missing semicolon.

  - Arach
`,
        `color: ${colors.highlight}; font-family: ${monoFont};`,
        `color: ${colors.muted}; font-style: italic;`
      );
    }
  });
}
