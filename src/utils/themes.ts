export interface ColorPalette {
  fill: string;
  textBase: string;
  accent: string;
  card: string;
  cardMuted: string;
  border: string;
}

export interface FontPalette {
  heading: string;
  body: string;
  mono: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    light: ColorPalette;
    dark: ColorPalette;
  };
  fonts: FontPalette;
}

export const themes: Theme[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Clean and professional',
    colors: {
      light: {
        fill: '255, 255, 255',
        textBase: '0, 0, 0',
        accent: '0, 0, 0',
        card: '255, 255, 255',
        cardMuted: '250, 250, 250',
        border: '229, 229, 229',
      },
      dark: {
        fill: '24, 24, 27',
        textBase: '245, 245, 244',
        accent: '251, 191, 36',
        card: '39, 39, 42',
        cardMuted: '52, 52, 56',
        border: '100, 100, 108',
      },
    },
    fonts: {
      heading: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", "Roboto", sans-serif',
      body: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", "Roboto", sans-serif',
      mono: '"Fira Code", "Fira Mono", Consolas, Monaco, monospace',
    },
  },
  {
    id: 'sepia',
    name: 'Sepia',
    description: 'Warm, vintage newspaper feel',
    colors: {
      light: {
        fill: '251, 245, 235',      // Warm paper
        textBase: '61, 37, 20',      // Dark brown
        accent: '153, 27, 27',       // Deep red
        card: '254, 249, 242',       // Light cream
        cardMuted: '251, 241, 228',  // Muted cream
        border: '217, 194, 169',     // Tan
      },
      dark: {
        fill: '28, 25, 23',          // Dark coffee
        textBase: '231, 220, 200',   // Cream text
        accent: '239, 138, 98',      // Burnt orange
        card: '41, 37, 33',
        cardMuted: '57, 51, 46',
        border: '92, 83, 74',
      },
    },
    fonts: {
      heading: '"Playfair Display", "Georgia", serif',
      body: '"Crimson Text", "Georgia", serif',
      mono: '"Courier New", "Courier", monospace',
    },
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Neon-lit dystopian future',
    colors: {
      light: {
        fill: '250, 250, 255',       // Blue-white
        textBase: '15, 0, 30',       // Deep purple
        accent: '255, 0, 128',       // Hot pink
        card: '245, 245, 255',
        cardMuted: '235, 235, 250',
        border: '200, 150, 255',     // Purple
      },
      dark: {
        fill: '10, 0, 20',           // Deep purple-black
        textBase: '200, 255, 255',   // Cyan
        accent: '255, 0, 255',       // Magenta
        card: '20, 10, 35',
        cardMuted: '35, 20, 50',
        border: '100, 50, 150',
      },
    },
    fonts: {
      heading: '"Orbitron", "Exo 2", sans-serif',
      body: '"Rajdhani", "Roboto", sans-serif',
      mono: '"Fira Code", "Source Code Pro", monospace',
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Natural, calming earth tones',
    colors: {
      light: {
        fill: '247, 250, 247',       // Pale green
        textBase: '22, 46, 33',      // Forest green
        accent: '34, 139, 34',       // Forest green
        card: '242, 247, 242',
        cardMuted: '235, 243, 235',
        border: '169, 196, 169',
      },
      dark: {
        fill: '19, 27, 24',          // Dark forest
        textBase: '229, 231, 218',   // Pale sage
        accent: '134, 239, 172',     // Mint green
        card: '28, 38, 34',
        cardMuted: '38, 50, 44',
        border: '74, 94, 84',
      },
    },
    fonts: {
      heading: '"Merriweather", "Georgia", serif',
      body: '"Source Sans Pro", "Helvetica", sans-serif',
      mono: '"Ubuntu Mono", "Consolas", monospace',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Deep sea blues and teals',
    colors: {
      light: {
        fill: '240, 248, 255',       // Alice blue
        textBase: '3, 37, 65',       // Navy
        accent: '0, 119, 190',       // Ocean blue
        card: '235, 245, 255',
        cardMuted: '225, 240, 255',
        border: '176, 212, 235',
      },
      dark: {
        fill: '7, 20, 35',           // Deep ocean
        textBase: '219, 237, 255',   // Light blue
        accent: '0, 188, 227',       // Bright cyan
        card: '15, 30, 50',
        cardMuted: '25, 45, 70',
        border: '50, 90, 130',
      },
    },
    fonts: {
      heading: '"Bebas Neue", "Impact", sans-serif',
      body: '"Open Sans", "Helvetica", sans-serif',
      mono: '"JetBrains Mono", "Fira Code", monospace',
    },
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'High contrast black and white',
    colors: {
      light: {
        fill: '255, 255, 255',
        textBase: '0, 0, 0',
        accent: '0, 0, 0',
        card: '255, 255, 255',
        cardMuted: '245, 245, 245',
        border: '200, 200, 200',
      },
      dark: {
        fill: '0, 0, 0',
        textBase: '255, 255, 255',
        accent: '255, 255, 255',
        card: '20, 20, 20',
        cardMuted: '40, 40, 40',
        border: '80, 80, 80',
      },
    },
    fonts: {
      heading: '"Space Grotesk", "Helvetica Neue", sans-serif',
      body: '"Inter", "Helvetica", sans-serif',
      mono: '"IBM Plex Mono", "Courier New", monospace',
    },
  },
  {
    id: 'candy',
    name: 'Candy',
    description: 'Playful pastels and sweet colors',
    colors: {
      light: {
        fill: '255, 251, 254',       // Pink tint
        textBase: '74, 36, 82',      // Purple
        accent: '236, 72, 153',      // Hot pink
        card: '254, 245, 251',
        cardMuted: '252, 238, 247',
        border: '244, 194, 227',
      },
      dark: {
        fill: '49, 27, 49',          // Dark purple
        textBase: '251, 207, 232',   // Light pink
        accent: '251, 146, 203',     // Bright pink
        card: '67, 41, 67',
        cardMuted: '86, 54, 86',
        border: '147, 97, 147',
      },
    },
    fonts: {
      heading: '"Bubblegum Sans", "Comic Sans MS", cursive',
      body: '"Quicksand", "Rounded", sans-serif',
      mono: '"Comic Mono", "Courier New", monospace',
    },
  },
  {
    id: 'terminal',
    name: 'Terminal',
    description: 'Classic green phosphor CRT',
    colors: {
      light: {
        fill: '253, 255, 253',       // Slight green tint
        textBase: '0, 51, 0',        // Dark green
        accent: '0, 153, 0',         // Bright green
        card: '248, 255, 248',
        cardMuted: '240, 255, 240',
        border: '153, 204, 153',
      },
      dark: {
        fill: '0, 12, 0',            // Almost black
        textBase: '51, 255, 51',     // Bright green
        accent: '0, 255, 0',         // Pure green
        card: '0, 20, 0',
        cardMuted: '0, 30, 0',
        border: '0, 102, 0',
      },
    },
    fonts: {
      heading: '"VT323", "Courier New", monospace',
      body: '"Share Tech Mono", "Courier New", monospace',
      mono: '"Fira Code", "Consolas", monospace',
    },
  },
];

export function getTheme(themeId: string): Theme {
  return themes.find(t => t.id === themeId) || themes[0];
}

export function applyTheme(theme: Theme, mode: 'light' | 'dark') {
  const root = document.documentElement;
  const colors = theme.colors[mode];
  
  // Apply color variables
  root.style.setProperty('--color-fill', colors.fill);
  root.style.setProperty('--color-text-base', colors.textBase);
  root.style.setProperty('--color-accent', colors.accent);
  root.style.setProperty('--color-card', colors.card);
  root.style.setProperty('--color-card-muted', colors.cardMuted);
  root.style.setProperty('--color-border', colors.border);
  
  // Apply font variables
  root.style.setProperty('--font-heading', theme.fonts.heading);
  root.style.setProperty('--font-body', theme.fonts.body);
  root.style.setProperty('--font-mono', theme.fonts.mono);
  
  // Store theme preference
  localStorage.setItem('theme-palette', theme.id);
  
  // Load Google Fonts if needed
  loadThemeFonts(theme);
}

// Font loading helper
function loadThemeFonts(theme: Theme) {
  const fontsToLoad = new Set<string>();
  
  // Extract font names from the font stack
  const extractFontName = (fontStack: string) => {
    const match = fontStack.match(/^"([^"]+)"/);
    return match ? match[1] : null;
  };
  
  const headingFont = extractFontName(theme.fonts.heading);
  const bodyFont = extractFontName(theme.fonts.body);
  
  if (headingFont) fontsToLoad.add(headingFont);
  if (bodyFont && bodyFont !== headingFont) fontsToLoad.add(bodyFont);
  
  // Google Fonts mapping
  const googleFonts: Record<string, string> = {
    'Playfair Display': 'Playfair+Display:wght@400;700;900',
    'Crimson Text': 'Crimson+Text:wght@400;600;700',
    'Orbitron': 'Orbitron:wght@400;700;900',
    'Exo 2': 'Exo+2:wght@400;700;900',
    'Rajdhani': 'Rajdhani:wght@400;500;700',
    'Merriweather': 'Merriweather:wght@400;700;900',
    'Source Sans Pro': 'Source+Sans+3:wght@400;600;700',
    'Bebas Neue': 'Bebas+Neue',
    'Open Sans': 'Open+Sans:wght@400;600;700',
    'JetBrains Mono': 'JetBrains+Mono:wght@400;700',
    'Space Grotesk': 'Space+Grotesk:wght@400;700',
    'IBM Plex Mono': 'IBM+Plex+Mono:wght@400;700',
    'Bubblegum Sans': 'Bubblegum+Sans',
    'Quicksand': 'Quicksand:wght@400;600;700',
    'VT323': 'VT323',
    'Share Tech Mono': 'Share+Tech+Mono',
  };
  
  // Check if fonts need to be loaded
  fontsToLoad.forEach(fontName => {
    const googleFontParam = googleFonts[fontName];
    if (googleFontParam) {
      const linkId = `font-${fontName.replace(/\s+/g, '-').toLowerCase()}`;
      
      // Check if font is already loaded
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${googleFontParam}&display=swap`;
        document.head.appendChild(link);
      }
    }
  });
}