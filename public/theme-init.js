// Initialize theme immediately to prevent flash
(function() {
  const savedThemeId = localStorage.getItem('theme-palette') || 'default';
  const savedMode = localStorage.getItem('theme') || 'light';
  
  // Minimal theme data for initial load
  const themes = {
    'default': {
      light: {
        fill: '255, 255, 255',
        textBase: '0, 0, 0',
        accent: '0, 0, 0',
      },
      dark: {
        fill: '24, 24, 27',
        textBase: '245, 245, 244',
        accent: '251, 191, 36',
      }
    },
    'sepia': {
      light: {
        fill: '251, 245, 235',
        textBase: '61, 37, 20',
        accent: '153, 27, 27',
      },
      dark: {
        fill: '28, 25, 23',
        textBase: '231, 220, 200',
        accent: '239, 138, 98',
      }
    },
    'cyberpunk': {
      light: {
        fill: '250, 250, 255',
        textBase: '15, 0, 30',
        accent: '255, 0, 128',
      },
      dark: {
        fill: '10, 0, 20',
        textBase: '200, 255, 255',
        accent: '255, 0, 255',
      }
    },
    'forest': {
      light: {
        fill: '247, 250, 247',
        textBase: '22, 46, 33',
        accent: '34, 139, 34',
      },
      dark: {
        fill: '19, 27, 24',
        textBase: '229, 231, 218',
        accent: '134, 239, 172',
      }
    },
    'ocean': {
      light: {
        fill: '240, 248, 255',
        textBase: '3, 37, 65',
        accent: '0, 119, 190',
      },
      dark: {
        fill: '7, 20, 35',
        textBase: '219, 237, 255',
        accent: '0, 188, 227',
      }
    },
    'monochrome': {
      light: {
        fill: '255, 255, 255',
        textBase: '0, 0, 0',
        accent: '0, 0, 0',
      },
      dark: {
        fill: '0, 0, 0',
        textBase: '255, 255, 255',
        accent: '255, 255, 255',
      }
    },
    'candy': {
      light: {
        fill: '255, 251, 254',
        textBase: '74, 36, 82',
        accent: '236, 72, 153',
      },
      dark: {
        fill: '49, 27, 49',
        textBase: '251, 207, 232',
        accent: '251, 146, 203',
      }
    },
    'terminal': {
      light: {
        fill: '253, 255, 253',
        textBase: '0, 51, 0',
        accent: '0, 153, 0',
      },
      dark: {
        fill: '0, 12, 0',
        textBase: '51, 255, 51',
        accent: '0, 255, 0',
      }
    }
  };
  
  const theme = themes[savedThemeId] || themes['default'];
  const colors = theme[savedMode] || theme['light'];
  
  // Apply colors immediately
  const root = document.documentElement;
  root.style.setProperty('--color-fill', colors.fill);
  root.style.setProperty('--color-text-base', colors.textBase);
  root.style.setProperty('--color-accent', colors.accent);
})();