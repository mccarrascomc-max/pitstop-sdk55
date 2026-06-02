import { createContext, useContext, useMemo } from 'react';

import { appThemes, getAppStyles } from '../styles/appStyles';

const AppThemeContext = createContext(null);

export function AppThemeProvider({ children, mode, onToggleTheme }) {
  const value = useMemo(
    () => ({
      colors: appThemes[mode] ?? appThemes.light,
      isDark: mode === 'dark',
      mode,
      onToggleTheme,
      styles: getAppStyles(mode),
    }),
    [mode, onToggleTheme]
  );

  return (
    <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(AppThemeContext);

  if (!context) {
    throw new Error('useAppTheme must be used inside AppThemeProvider');
  }

  return context;
}
