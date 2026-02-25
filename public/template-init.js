// Initialize template immediately to prevent flash (runs before paint)
(function () {
  var template = localStorage.getItem("site-template") || "docs";
  var html = document.documentElement;
  html.setAttribute("data-template", template);

  // Terminal and Industrial force dark mode
  if (template === "terminal" || template === "industrial") {
    html.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  }
})();
