import { ScrollView, Text, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { FuelHistoryList } from '../components/FuelHistoryList';
import { useAppTheme } from '../theme/AppThemeContext';

export function FuelRecordsScreen({ registros, onAddRecord, onBack }) {
  const { styles } = useAppTheme();

  return (
    <ScrollView contentContainerStyle={styles.dashboard}>
      <View style={styles.formHeader}>
        <Text style={styles.brandSmall}>Registros</Text>
        <Text style={styles.dashboardTitle}>Historial de combustible</Text>
        <Text style={styles.panelSubtitle}>
          Cargas completas, parciales y consumo calculado cuando corresponde.
        </Text>
      </View>

      <AppButton title="Registrar combustible" onPress={onAddRecord} />
      <FuelHistoryList registros={registros} />
      <AppButton title="Volver" onPress={onBack} variant="back" />
    </ScrollView>
  );
}
