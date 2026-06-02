import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { ThemeToggle } from '../components/ThemeToggle';
import { useAppTheme } from '../theme/AppThemeContext';

function ActionCard({ eyebrow, title, description, onPress }) {
  const { styles } = useAppTheme();

  return (
    <TouchableOpacity activeOpacity={0.84} style={styles.actionCard} onPress={onPress}>
      <Text style={styles.actionEyebrow}>{eyebrow}</Text>
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionDescription}>{description}</Text>
    </TouchableOpacity>
  );
}

export function ActionMenuScreen({
  usuarioActual,
  onBack,
  onFuelRecord,
  onMaintenance,
  onRecords,
}) {
  const { styles } = useAppTheme();

  return (
    <ScrollView contentContainerStyle={styles.dashboard}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.brandSmall}>Centro de control</Text>
          <Text style={styles.dashboardTitle}>Que quieres hacer?</Text>
          <Text style={styles.panelSubtitle}>Usuario: {usuarioActual}</Text>
          <ThemeToggle />
        </View>
      </View>

      <View style={styles.actionGrid}>
        <ActionCard
          eyebrow="01"
          title="Mantenimiento"
          description="Revisa tareas pendientes y proximas revisiones del auto."
          onPress={onMaintenance}
        />
        <ActionCard
          eyebrow="02"
          title="Registrar combustible"
          description="Guarda kilometraje, litros, precio y tipo de carga."
          onPress={onFuelRecord}
        />
        <ActionCard
          eyebrow="03"
          title="Registros"
          description="Consulta el historial de combustible y consumos calculados."
          onPress={onRecords}
        />
      </View>

      <AppButton title="Volver al resumen" onPress={onBack} variant="back" />
    </ScrollView>
  );
}
