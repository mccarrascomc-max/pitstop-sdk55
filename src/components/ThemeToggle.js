import { Text, TouchableOpacity } from 'react-native';

import { useAppTheme } from '../theme/AppThemeContext';

export function ThemeToggle() {
  const { isDark, onToggleTheme, styles } = useAppTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      style={styles.themeToggle}
      onPress={onToggleTheme}
    >
      <Text style={styles.themeToggleText}>{isDark ? 'Claro' : 'Oscuro'}</Text>
      <Text style={styles.themeToggleMeta}>{isDark ? 'dark' : 'clear'}</Text>
    </TouchableOpacity>
  );
}
