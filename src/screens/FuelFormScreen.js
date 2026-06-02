import { ScrollView, Text, TextInput, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { ChargeTypeSelector } from '../components/ChargeTypeSelector';
import { InfoBox } from '../components/InfoBox';
import { ThemeToggle } from '../components/ThemeToggle';
import { useAppTheme } from '../theme/AppThemeContext';

export function FuelFormScreen({
  usuarioActual,
  kilometraje,
  litros,
  precio,
  tipoCarga,
  onKilometrajeChange,
  onLitrosChange,
  onPrecioChange,
  onTipoCargaChange,
  onSave,
  onBack,
}) {
  const { colors, styles } = useAppTheme();

  return (
    <ScrollView contentContainerStyle={styles.formScreen}>
      <View style={styles.formHeader}>
        <Text style={styles.brandSmall}>Nueva carga</Text>
        <Text style={styles.dashboardTitle}>Registrar combustible</Text>
        <Text style={styles.panelSubtitle}>Usuario: {usuarioActual}</Text>
        <ThemeToggle />
      </View>

      <View style={styles.formPanel}>
        <Text style={styles.panelTitle}>Datos de la carga</Text>

        <TextInput
          style={styles.input}
          placeholder="Kilometraje actual"
          keyboardType="numeric"
          value={kilometraje}
          onChangeText={onKilometrajeChange}
          placeholderTextColor={colors.muted}
        />

        <TextInput
          style={styles.input}
          placeholder="Litros cargados"
          keyboardType="numeric"
          value={litros}
          onChangeText={onLitrosChange}
          placeholderTextColor={colors.muted}
        />

        <TextInput
          style={styles.input}
          placeholder="Precio total"
          keyboardType="numeric"
          value={precio}
          onChangeText={onPrecioChange}
          placeholderTextColor={colors.muted}
        />

        <ChargeTypeSelector tipoCarga={tipoCarga} onChange={onTipoCargaChange} />

        <InfoBox>
          El consumo solo se calcula si la carga anterior y la actual son completas consecutivas.
        </InfoBox>

        <AppButton title="Guardar registro" onPress={onSave} />
        <AppButton title="Volver" onPress={onBack} variant="back" />
      </View>
    </ScrollView>
  );
}
