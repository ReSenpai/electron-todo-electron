import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type Appearance = 'dark' | 'light';

interface ThemeContextValue {
  appearance: Appearance;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  appearance: 'dark',
  toggleTheme: () => {},
});

const STORAGE_KEY = 'todo-desktop-theme';

function getInitialAppearance(): Appearance {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* no localStorage in main process */
  }
  return 'dark';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [appearance, setAppearance] = useState<Appearance>(getInitialAppearance);

  const toggleTheme = useCallback(() => {
    setAppearance((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ appearance, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
