import { create } from 'zustand';

export type AeroForgeTheme = 'dark' | 'light' | 'system';

interface ThemeState {
  theme: AeroForgeTheme;
  resolvedTheme: 'dark' | 'light';
  setTheme: (theme: AeroForgeTheme) => void;
  initTheme: () => void;
}

function resolveTheme(theme: AeroForgeTheme): 'dark' | 'light' {
  if (theme === 'system') {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  }
  return theme;
}

function applyToDOM(resolved: 'dark' | 'light') {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('light', resolved === 'light');
  document.documentElement.setAttribute('data-theme', resolved);
  document.documentElement.style.colorScheme = resolved;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'dark',
  resolvedTheme: 'dark',

  setTheme: (theme: AeroForgeTheme) => {
    const resolved = resolveTheme(theme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('aeroforge-theme', theme);
      // Notify parent Polaris container if embedded
      if (window.parent && window.parent !== window) {
        try {
          window.parent.postMessage(
            { type: 'AEROFORGE_THEME_CHANGE', theme: resolved },
            window.location.origin
          );
        } catch {}
      }
    }
    applyToDOM(resolved);
    set({ theme, resolvedTheme: resolved });
  },

  initTheme: () => {
    if (typeof window === 'undefined') return;
    const stored = (localStorage.getItem('aeroforge-theme') as AeroForgeTheme) || 'system';
    const resolved = resolveTheme(stored);
    applyToDOM(resolved);
    set({ theme: stored, resolvedTheme: resolved });

    // Listen for OS system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const handleSystemChange = () => {
      if (get().theme === 'system') {
        const newResolved = resolveTheme('system');
        applyToDOM(newResolved);
        set({ resolvedTheme: newResolved });
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);

    // Listen for parent Polaris theme messages with strict origin checking
    window.addEventListener('message', (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'POLARIS_THEME_UPDATE' && event.data?.theme) {
        const incoming = event.data.theme as 'dark' | 'light';
        applyToDOM(incoming);
        set({ resolvedTheme: incoming });
      }
    });

    // Notify parent that AeroForge is ready
    if (window.parent && window.parent !== window) {
      try {
        window.parent.postMessage({ type: 'AEROFORGE_READY' }, window.location.origin);
      } catch {}
    }
  },
}));
