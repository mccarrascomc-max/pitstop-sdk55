import { ScrollView, Text, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { ThemeToggle } from '../components/ThemeToggle';
import { UserHeader } from '../components/UserHeader';
import { useAppTheme } from '../theme/AppThemeContext';

export function HomeScreen({ usuarioActual, registros, onLogout, onContinue }) {
  const { styles } = useAppTheme();
  const ultimoRegistro = registros[0];
  const ultimoConsumo = registros.find((registro) => registro.consumo);
  const totalLitros = registros.reduce((total, registro) => total + registro.litros, 0);
  const gastoTotal = registros.reduce((total, registro) => total + registro.precio, 0);

  return (
    <ScrollView contentContainerStyle={styles.dashboard}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.brandSmall}>PitStop</Text>
          <Text style={styles.dashboardTitle}>Panel del auto</Text>
          <ThemeToggle />
        </View>

        <UserHeader usuarioActual={usuarioActual} onLogout={onLogout} />
      </View>

      <View style={styles.heroPanel}>
        <Text style={styles.heroKicker}>Resumen actual</Text>
        <Text style={styles.heroMetric}>
          {ultimoRegistro ? `${ultimoRegistro.kilometraje} km` : 'Sin registros'}
        </Text>
        <Text style={styles.heroCopyDark}>
          {ultimoRegistro
            ? `Ultima carga: ${ultimoRegistro.tipoCarga} el ${ultimoRegistro.fecha}`
            : 'Agrega tu primera carga para comenzar el seguimiento.'}
        </Text>
        <AppButton title="Ir a controles" onPress={onContinue} />
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statTile}>
          <Text style={styles.statLabel}>Registros</Text>
          <Text style={styles.statValue}>{registros.length}</Text>
        </View>
        <View style={styles.statTile}>
          <Text style={styles.statLabel}>Litros</Text>
          <Text style={styles.statValue}>{totalLitros.toFixed(1)}</Text>
        </View>
        <View style={styles.statTile}>
          <Text style={styles.statLabel}>Gasto</Text>
          <Text style={styles.statValue}>${gastoTotal.toFixed(0)}</Text>
        </View>
        <View style={styles.statTile}>
          <Text style={styles.statLabel}>Consumo</Text>
          <Text style={styles.statValue}>
            {ultimoConsumo ? ultimoConsumo.consumo.toFixed(1) : '--'}
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionEyebrow}>Vista rapida</Text>
        <Text style={styles.sectionHeading}>Estado general</Text>
      </View>

      <View style={styles.taskRow}>
        <View style={styles.taskItem}>
          <Text style={styles.taskTitle}>Mantenimiento</Text>
          <Text style={styles.taskMeta}>Tareas preparadas para la siguiente pantalla.</Text>
        </View>
        <View style={styles.taskItem}>
          <Text style={styles.taskTitle}>Combustible</Text>
          <Text style={styles.taskMeta}>
            {ultimoConsumo
              ? `Ultimo consumo: ${ultimoConsumo.consumo.toFixed(1)} km/L`
              : 'Sin consumo calculado todavia.'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
