// src/components/ThemeToggle.tsx
// Tiny button to toggle theme. Accessible + keyboard friendly.
import { useTheme } from '@/context/ThemeContext';

function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M6.76 4.84L5 3.08 3.58 4.5l1.76 1.76 1.42-1.42zM1 13h3v-2H1v2zm10 10h2v-3h-2v3zM4.5 19.5L3.08 18l1.76-1.76 1.42 1.42-1.76 1.84zM13 1h-2v3h2V1zm7.42 3.5L19.66 5.3l1.76 1.76 1.42-1.42-1.76-1.14zM20 11v2h3v-2h-3zm-8 2a5 5 0 110-10 5 5 0 010 10z"/>
    </svg>
  );
}
function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12.74 2a9 9 0 108.52 12.03A8 8 0 0112.74 2z"/>
    </svg>
  );
}

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-2 px-3 h-10 rounded-xl 
                 bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-white
                 border border-black/5 dark:border-white/10
                 hover:bg-white dark:hover:bg-white/20 transition"
      aria-label="Toggle theme"
      title="Toggle theme"
      type="button"
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      <span className="hidden sm:inline text-sm">
        {theme === 'dark' ? 'Light' : 'Dark'}
      </span>
    </button>
  );
}
