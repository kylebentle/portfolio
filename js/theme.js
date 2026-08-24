(function () {
  var STORAGE_KEY = 'theme';
  var media = window.matchMedia('(prefers-color-scheme: dark)');

  function storedTheme() {
    return localStorage.getItem(STORAGE_KEY);
  }

  function effectiveTheme() {
    return storedTheme() || (media.matches ? 'dark' : 'light');
  }

  function updateToggles(theme) {
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.setAttribute('aria-pressed', theme === 'dark');
    });
  }

  function setTheme(theme) {
    localStorage.setItem(STORAGE_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
    updateToggles(theme);
  }

  // Reflect the current state right away (the inline snippet in <head>
  // already applied a saved theme, if any, before the page painted)
  updateToggles(effectiveTheme());

  // If the visitor hasn't picked a theme here, keep following their
  // system setting live, including mid-visit changes
  media.addEventListener('change', function () {
    if (!storedTheme()) updateToggles(effectiveTheme());
  });

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setTheme(effectiveTheme() === 'dark' ? 'light' : 'dark');
      });
    });
  });
})();
