// Initialize template immediately to prevent flash (runs before paint)
(function () {
  function applyTemplate() {
    var template = localStorage.getItem("site-template") || "classic";
    // Migrate removed templates to default
    if (template === "docs") {
      template = "classic";
      localStorage.setItem("site-template", "classic");
    }
    var html = document.documentElement;
    html.setAttribute("data-template", template);

    // Set theme: terminal/industrial default to dark, classic defaults to light
    var savedTheme = localStorage.getItem("theme");
    if (!savedTheme) {
      var defaultTheme = (template === "terminal" || template === "industrial") ? "dark" : "light";
      html.setAttribute("data-theme", defaultTheme);
      localStorage.setItem("theme", defaultTheme);
    } else {
      html.setAttribute("data-theme", savedTheme);
    }
  }

  applyTemplate();

  // Re-apply after Astro view transitions (new page swaps in with server-default attrs)
  document.addEventListener("astro:after-swap", applyTemplate);
})();
