import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { UserHeader } from '../components/UserHeader';
import { useAppTheme } from '../theme/AppThemeContext';
import {
  formatCurrency,
  formatDayMonth,
  formatNumber,
  formatYear,
} from '../utils/formatters';
import { OIL_CHANGE_KM_INTERVAL } from '../utils/maintenanceNotifications';

function HomeActionButton({ icon, iconFamily, title, onPress }) {
  const { colors, styles } = useAppTheme();
  const Icon = iconFamily === 'fontAwesome5' ? FontAwesome5 : MaterialCommunityIcons;

  return (
    <TouchableOpacity
      activeOpacity={0.84}
      style={styles.homeActionButton}
      onPress={onPress}
    >
      <Icon name={icon} size={20} color={colors.blue} />
      <Text style={styles.homeActionText}>{title}</Text>
    </TouchableOpacity>
  );
}

export function HomeScreen({
  usuarioActual,
  autoActual,
  registros,
  oilChanges,
  onLogout,
  onCars,
  onMaintenance,
  onFuelRecord,
  onRecords,
}) {
  const { styles } = useAppTheme();
  const ultimoConsumo = registros.find((registro) => registro.consumo);
  const ultimoCambioAceite = oilChanges[0];
  const gastoTotal = registros.reduce((total, registro) => total + registro.precio, 0);
  const proximoKmAceite = ultimoCambioAceite
    ? ultimoCambioAceite.kmActual + OIL_CHANGE_KM_INTERVAL
    : null;

  return (
    <ScrollView contentContainerStyle={styles.dashboard}>
      <View style={styles.topBar}>
        <View style={styles.homeTitleRow}>
          <View style={styles.homeTitleText}>
            <Text style={styles.brandSmall}>PitStop</Text>
            <Text style={styles.dashboardTitle}>Panel del auto</Text>
            <Text style={styles.panelSubtitle}>
              {autoActual
                ? `${autoActual.marca} ${autoActual.modelo} · ${autoActual.anio}`
                : 'Sin auto seleccionado'}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.74}
            style={styles.carIconButton}
            onPress={onCars}
          >
            <MaterialCommunityIcons name="car" size={34} color="#2198F4" />
          </TouchableOpacity>
        </View>

        <UserHeader usuarioActual={usuarioActual} />
      </View>

      <View style={styles.homeActionGrid}>
        <HomeActionButton
          icon="tools"
          iconFamily="fontAwesome5"
          title="Mantención"
          onPress={onMaintenance}
        />
        <HomeActionButton
          icon="gas-station"
          title="Combustible"
          onPress={onFuelRecord}
        />
        <HomeActionButton
          icon="chart-line"
          title="Registros"
          onPress={onRecords}
        />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeading}>Mantenimiento</Text>
      </View>

      <View style={styles.maintenanceSummaryPanel}>
        <View style={styles.maintenanceSummaryHeader}>
          <Text style={styles.taskTitle}>Aceite</Text>
          <Text style={styles.taskMeta}>
            Revisa el próximo cambio de aceite, kilometraje objetivo y filtro.
          </Text>
        </View>

        <View style={styles.maintenanceStatsGrid}>
          <View style={styles.maintenanceStatTile}>
            <Text style={styles.statLabel}>Próximo</Text>
            <Text style={styles.compactStatValue}>
              {ultimoCambioAceite ? formatDayMonth(ultimoCambioAceite.dueDate) : '--'}
            </Text>
            <Text style={styles.statMeta}>
              {ultimoCambioAceite ? formatYear(ultimoCambioAceite.dueDate) : 'aceite'}
            </Text>
          </View>
          <View style={styles.maintenanceStatTile}>
            <Text style={styles.statLabel}>Km objetivo</Text>
            <Text style={styles.compactStatValue}>
              {proximoKmAceite ? formatNumber(proximoKmAceite) : '--'}
            </Text>
            <Text style={styles.statMeta}>km</Text>
          </View>
          <View style={[styles.maintenanceStatTile, styles.maintenanceStatTileLast]}>
            <Text style={styles.statLabel}>Filtro</Text>
            <Text style={styles.compactStatValue}>
              {ultimoCambioAceite ? (ultimoCambioAceite.cambioFiltro ? 'Sí' : 'No') : '--'}
            </Text>
            <Text style={styles.statMeta}>último</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionEyebrow}>Resumen</Text>
        <Text style={styles.sectionHeading}>Combustible</Text>
      </View>

      <View style={styles.compactStatsGrid}>
        <View style={styles.compactStatTile}>
          <Text style={styles.statLabel}>Consumo</Text>
          <Text style={styles.compactStatValue}>
            {ultimoConsumo ? ultimoConsumo.consumo.toFixed(1) : '--'}
          </Text>
          <Text style={styles.statMeta}>km/L</Text>
        </View>
        <View style={styles.compactStatTile}>
          <Text style={styles.statLabel}>Gasto</Text>
          <Text style={styles.compactStatValue}>{formatCurrency(gastoTotal)}</Text>
          <Text style={styles.statMeta}>total</Text>
        </View>
        <View style={styles.compactStatTile}>
          <Text style={styles.statLabel}>Registros</Text>
          <Text style={styles.compactStatValue}>{registros.length}</Text>
          <Text style={styles.statMeta}>cargas</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.homeLogout} onPress={onLogout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
