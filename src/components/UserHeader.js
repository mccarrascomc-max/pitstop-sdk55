import { Text, View } from 'react-native';

import { useAppTheme } from '../theme/AppThemeContext';

export function UserHeader({ usuarioActual }) {
  const { styles } = useAppTheme();

  return (
    <View style={styles.userHeader}>
      <Text style={styles.userLabel}>Usuario</Text>
      <Text style={styles.userText}>{usuarioActual}</Text>
    </View>
  );
}
