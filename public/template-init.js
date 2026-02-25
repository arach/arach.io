// Initialize template immediately to prevent flash (runs before paint)
(function () {
  function applyTemplate() {
    var template = localStorage.getItem("site-template") || "docs";
    var html = document.documentElement;
    html.setAttribute("data-template", template);

    // Terminal and Industrial force dark mode
    if (template === "terminal") {
      html.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
  }

  applyTemplate();

  // Re-apply after Astro view transitions (new page swaps in with server-default attrs)
  document.addEventListener("astro:after-swap", applyTemplate);
})();
