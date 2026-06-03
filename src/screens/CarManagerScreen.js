import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AppButton } from '../components/AppButton';
import { useAppTheme } from '../theme/AppThemeContext';

export function CarManagerScreen({
  autos,
  selectedCarId,
  onCreateCar,
  onSelectCar,
  onBack,
}) {
  const { colors, styles } = useAppTheme();
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [cilindrada, setCilindrada] = useState('');
  const [anio, setAnio] = useState('');

  function handleCreateCar() {
    onCreateCar({
      marca: marca.trim(),
      modelo: modelo.trim(),
      cilindrada: cilindrada.trim(),
      anio: anio.trim(),
    });

    setMarca('');
    setModelo('');
    setCilindrada('');
    setAnio('');
  }

  return (
    <ScrollView contentContainerStyle={styles.formScreen}>
      <View style={styles.formHeader}>
        <Text style={styles.brandSmall}>Garage</Text>
        <Text style={styles.dashboardTitle}>Mis autos</Text>
        <Text style={styles.panelSubtitle}>Crea y selecciona el auto activo.</Text>
      </View>

      <View style={styles.formPanel}>
        <Text style={styles.panelTitle}>Agregar auto</Text>

        <TextInput
          style={styles.input}
          placeholder="Marca"
          value={marca}
          onChangeText={setMarca}
          placeholderTextColor={colors.muted}
        />
        <TextInput
          style={styles.input}
          placeholder="Modelo"
          value={modelo}
          onChangeText={setModelo}
          placeholderTextColor={colors.muted}
        />
        <TextInput
          style={styles.input}
          placeholder="Cilindrada"
          value={cilindrada}
          onChangeText={setCilindrada}
          placeholderTextColor={colors.muted}
        />
        <TextInput
          style={styles.input}
          placeholder="Año"
          keyboardType="numeric"
          value={anio}
          onChangeText={setAnio}
          placeholderTextColor={colors.muted}
        />

        <AppButton title="Guardar auto" onPress={handleCreateCar} />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionEyebrow}>Seleccion</Text>
        <Text style={styles.sectionHeading}>Autos guardados</Text>
      </View>

      <View style={styles.taskRow}>
        {autos.length === 0 ? (
          <Text style={styles.emptyText}>Todavia no tienes autos guardados.</Text>
        ) : (
          autos.map((auto) => {
            const isSelected = auto.id === selectedCarId;

            return (
              <TouchableOpacity
                key={auto.id}
                activeOpacity={0.84}
                style={[
                  styles.carOption,
                  isSelected ? styles.carOptionSelected : null,
                ]}
                onPress={() => onSelectCar(auto.id)}
              >
                <MaterialCommunityIcons
                  name="car"
                  size={24}
                  color={isSelected ? colors.heroText : colors.blue}
                />
                <View style={styles.carOptionText}>
                  <Text style={styles.taskTitle}>
                    {auto.marca} {auto.modelo}
                  </Text>
                  <Text style={styles.taskMeta}>
                    {auto.cilindrada} · {auto.anio}
                  </Text>
                </View>
                {isSelected ? (
                  <Text style={styles.carSelectedText}>Activo</Text>
                ) : null}
              </TouchableOpacity>
            );
          })
        )}
      </View>

      <AppButton title="Volver" onPress={onBack} variant="back" />
    </ScrollView>
  );
}
