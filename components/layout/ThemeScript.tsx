import Script from "next/script";

export function ThemeScript() {
  const script = `
    (function() {
      try {
        var mode = localStorage.getItem('theme_mode') || 'system';
        var dark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        document.documentElement.classList.toggle('dark', dark);
      } catch (e) {}
    })();
  `;

  return (
    <Script id="theme-init">
      {script}
    </Script>
  );
}
