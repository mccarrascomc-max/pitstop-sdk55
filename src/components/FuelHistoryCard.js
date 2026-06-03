import { Text, View } from 'react-native';

import { FULL_CHARGE } from '../utils/fuelCalculations';
import { formatCurrency, formatLiters, formatNumber } from '../utils/formatters';
import { useAppTheme } from '../theme/AppThemeContext';

export function FuelHistoryCard({ registro }) {
  const { styles } = useAppTheme();

  return (
    <View style={styles.historyCard}>
      <View style={styles.historyCardHeader}>
        <Text style={styles.historyMain}>{registro.tipoCarga}</Text>
        <Text
          style={[
            styles.historyBadge,
            registro.tipoCarga === FULL_CHARGE
              ? styles.historyBadgeFull
              : styles.historyBadgePartial,
          ]}
        >
          {registro.tipoCarga === FULL_CHARGE ? 'Completa' : 'Parcial'}
        </Text>
      </View>

      <Text style={styles.historyText}>Fecha: {registro.fecha}</Text>
      <Text style={styles.historyText}>
        Kilometraje: {formatNumber(registro.kilometraje)} km
      </Text>
      <Text style={styles.historyText}>Litros: {formatLiters(registro.litros)} L</Text>
      <Text style={styles.historyText}>Precio: {formatCurrency(registro.precio)}</Text>

      {registro.consumo ? (
        <Text style={styles.consumoText}>
          Consumo: {registro.consumo.toFixed(2)} km/L
        </Text>
      ) : (
        <Text style={styles.noConsumoText}>{registro.mensaje}</Text>
      )}
    </View>
  );
}
