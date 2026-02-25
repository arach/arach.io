// Initialize theme immediately to prevent flash
(function() {
  var template = document.documentElement.getAttribute('data-template') || 'docs';
  var savedThemeId = localStorage.getItem('theme-palette') || 'default';

  // For terminal/industrial, always use dark
  var savedMode;
  if (template === 'terminal' || template === 'industrial') {
    savedMode = 'dark';
  } else {
    savedMode = localStorage.getItem('theme') || 'light';
  }

  // Minimal theme data for initial load
  var themes = {
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
    }
  };

  // Only apply color overrides for docs template with non-default palette
  // Terminal and Industrial set their own colors via CSS
  if (template === 'docs') {
    var theme = themes[savedThemeId] || themes['default'];
    var colors = theme[savedMode] || theme['light'];

    var root = document.documentElement;
    root.style.setProperty('--color-fill', colors.fill);
    root.style.setProperty('--color-text-base', colors.textBase);
    root.style.setProperty('--color-accent', colors.accent);
  }
})();
