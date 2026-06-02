import { Text, TouchableOpacity, View } from 'react-native';

import { useAppTheme } from '../theme/AppThemeContext';

export function UserHeader({ usuarioActual, onLogout }) {
  const { styles } = useAppTheme();

  return (
    <View style={styles.userBox}>
      <Text style={styles.userLabel}>Usuario</Text>
      <Text style={styles.userText}>{usuarioActual}</Text>

      <TouchableOpacity onPress={onLogout}>
        <Text style={styles.logoutText}>Cerrar sesion</Text>
      </TouchableOpacity>
    </View>
  );
}
