// Initialize theme immediately to prevent flash
(function() {
  // Terminal and Industrial set their own colors via CSS variables.
  // This script is kept minimal — it just ensures data-theme is set
  // so CSS selectors like [data-theme="dark"] apply correctly.
  var savedMode = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedMode);
})();
