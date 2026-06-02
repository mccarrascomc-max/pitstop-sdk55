import { ScrollView, Text, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { useAppTheme } from '../theme/AppThemeContext';

const maintenanceItems = [
  {
    title: 'Cambio de aceite',
    meta: 'Prioridad media',
    detail: 'Revisar nivel y programar cambio segun kilometraje.',
  },
  {
    title: 'Filtro de aire',
    meta: 'Inspeccion',
    detail: 'Verificar suciedad del filtro y reemplazar si corresponde.',
  },
  {
    title: 'Presion de neumaticos',
    meta: 'Rutina semanal',
    detail: 'Controlar presion antes de trayectos largos.',
  },
];

export function MaintenanceScreen({ onBack }) {
  const { styles } = useAppTheme();

  return (
    <ScrollView contentContainerStyle={styles.dashboard}>
      <View style={styles.formHeader}>
        <Text style={styles.brandSmall}>Mantenimiento</Text>
        <Text style={styles.dashboardTitle}>Tareas del auto</Text>
        <Text style={styles.panelSubtitle}>
          Una base inicial para ordenar revisiones y habitos de cuidado.
        </Text>
      </View>

      <View style={styles.taskRow}>
        {maintenanceItems.map((item) => (
          <View key={item.title} style={styles.taskItem}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text style={styles.actionEyebrow}>{item.meta}</Text>
            <Text style={styles.taskMeta}>{item.detail}</Text>
          </View>
        ))}
      </View>

      <AppButton title="Volver" onPress={onBack} variant="back" />
    </ScrollView>
  );
}
