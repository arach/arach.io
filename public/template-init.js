// Initialize template immediately to prevent flash (runs before paint)
(function () {
  function applyTemplate() {
    var template = localStorage.getItem("site-template") || "terminal";
    // Migrate removed templates to default
    if (template === "docs") {
      template = "terminal";
      localStorage.setItem("site-template", "terminal");
    }
    var html = document.documentElement;
    html.setAttribute("data-template", template);

    // Default to dark for terminal/industrial, but respect user's saved preference
    var savedTheme = localStorage.getItem("theme");
    if (!savedTheme) {
      html.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.setAttribute("data-theme", savedTheme);
    }
  }

  applyTemplate();

  // Re-apply after Astro view transitions (new page swaps in with server-default attrs)
  document.addEventListener("astro:after-swap", applyTemplate);
})();
