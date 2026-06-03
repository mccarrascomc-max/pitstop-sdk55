import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { FuelHistoryList } from '../components/FuelHistoryList';
import { useAppTheme } from '../theme/AppThemeContext';
import { formatNumber } from '../utils/formatters';
import { formatDate } from '../utils/maintenanceNotifications';

function AnalyticsActionButton({ icon, title, onPress }) {
  const { colors, styles } = useAppTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.84}
      style={styles.analyticsActionButton}
      onPress={onPress}
    >
      <MaterialCommunityIcons name={icon} size={20} color={colors.blue} />
      <Text style={styles.analyticsActionText}>{title}</Text>
    </TouchableOpacity>
  );
}

export function FuelRecordsScreen({
  registros,
  oilChanges,
  onAddRecord,
  onAddMaintenance,
  onBack,
}) {
  const { styles } = useAppTheme();

  return (
    <ScrollView contentContainerStyle={styles.dashboard}>
      <View style={styles.formHeader}>
        <Text style={styles.brandSmall}>Registros</Text>
        <Text style={styles.dashboardTitle}>Analítica</Text>
        <Text style={styles.panelSubtitle}>
          Combustible, mantención y datos del auto en un solo lugar.
        </Text>
      </View>

      <View style={styles.analyticsActionGrid}>
        <AnalyticsActionButton
          icon="plus-circle"
          title="Combustible"
          onPress={onAddRecord}
        />
        <AnalyticsActionButton
          icon="plus-circle-outline"
          title="Mantención"
          onPress={onAddMaintenance}
        />
      </View>

      <FuelHistoryList registros={registros} />

      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Historial de mantención</Text>

        {oilChanges.length === 0 ? (
          <Text style={styles.emptyText}>Aún no hay cambios de aceite.</Text>
        ) : (
          oilChanges.map((item) => {
            const filterSummary = [
              item.tipoFiltro,
              item.marcaFiltro,
              item.codigoFiltro,
            ]
              .filter(Boolean)
              .join(' · ');

            return (
              <View key={item.id} style={styles.historyCard}>
                <View style={styles.historyCardHeader}>
                  <Text style={styles.historyMain}>Cambio de aceite</Text>
                  <Text style={[styles.historyBadge, styles.historyBadgeFull]}>
                    {item.cambioFiltro ? 'Filtro' : 'Aceite'}
                  </Text>
                </View>

                <Text style={styles.historyText}>
                  Fecha: {formatDate(new Date(item.fechaCambio))}
                </Text>
                <Text style={styles.historyText}>
                  Kilometraje: {formatNumber(item.kmActual)} km
                </Text>
                <Text style={styles.historyText}>
                  Aceite: {item.tipoAceite} · {item.marcaAceite}
                </Text>
                <Text style={styles.historyText}>
                  Filtro: {item.cambioFiltro ? 'Sí' : 'No'}
                </Text>
                {filterSummary ? (
                  <Text style={styles.historyText}>{filterSummary}</Text>
                ) : null}
              </View>
            );
          })
        )}
      </View>

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
