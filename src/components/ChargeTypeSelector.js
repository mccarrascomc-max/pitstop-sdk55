import { Text, TouchableOpacity } from 'react-native';

import { FULL_CHARGE, PARTIAL_CHARGE } from '../utils/fuelCalculations';
import { useAppTheme } from '../theme/AppThemeContext';

export function ChargeTypeSelector({ tipoCarga, onChange }) {
  const { styles } = useAppTheme();

  return (
    <>
      <Text style={styles.sectionTitle}>Tipo de carga</Text>

      <TouchableOpacity
        activeOpacity={0.82}
        style={[
          styles.optionButton,
          tipoCarga === FULL_CHARGE && styles.optionSelectedFull,
        ]}
        onPress={() => onChange(FULL_CHARGE)}
      >
        <Text
          style={[
            styles.optionText,
            tipoCarga === FULL_CHARGE && styles.optionTextSelected,
          ]}
        >
          Carga completa
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.82}
        style={[
          styles.optionButton,
          tipoCarga === PARTIAL_CHARGE && styles.optionSelectedPartial,
        ]}
        onPress={() => onChange(PARTIAL_CHARGE)}
      >
        <Text
          style={[
            styles.optionText,
            tipoCarga === PARTIAL_CHARGE && styles.optionTextSelected,
          ]}
        >
          Carga parcial
        </Text>
      </TouchableOpacity>
    </>
  );
}
