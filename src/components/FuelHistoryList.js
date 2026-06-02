import { Text, View } from 'react-native';

import { FuelHistoryCard } from './FuelHistoryCard';
import { useAppTheme } from '../theme/AppThemeContext';

export function FuelHistoryList({ registros }) {
  const { styles } = useAppTheme();

  return (
    <View style={styles.historyContainer}>
      <Text style={styles.historyTitle}>Historial de combustible</Text>

      {registros.length === 0 ? (
        <Text style={styles.emptyText}>Aun no hay registros.</Text>
      ) : (
        registros.map((registro) => (
          <FuelHistoryCard key={registro.id} registro={registro} />
        ))
      )}
    </View>
  );
}
