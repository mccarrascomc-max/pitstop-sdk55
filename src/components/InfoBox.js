import { Text, View } from 'react-native';

import { useAppTheme } from '../theme/AppThemeContext';

export function InfoBox({ children }) {
  const { styles } = useAppTheme();

  return (
    <View style={styles.infoBox}>
      <Text style={styles.infoText}>{children}</Text>
    </View>
  );
}
