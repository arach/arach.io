// Initialize theme immediately to prevent flash
(function() {
  // Terminal and Industrial set their own colors via CSS variables.
  // This script is kept minimal — it just ensures data-theme is set
  // so CSS selectors like [data-theme="dark"] apply correctly.
  // Default depends on template, but template-init.js handles first-time defaults.
  // Here we just read the saved preference.
  var savedMode = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedMode);
})();
