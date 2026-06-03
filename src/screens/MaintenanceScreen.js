import { useState } from 'react';
import {
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import { AppButton } from '../components/AppButton';
import { useAppTheme } from '../theme/AppThemeContext';
import { formatIntegerInput, formatNumber } from '../utils/formatters';
import {
  formatDate,
  OIL_CHANGE_KM_INTERVAL,
} from '../utils/maintenanceNotifications';

function getFilterSummary(item) {
  return [item.tipoFiltro, item.marcaFiltro, item.codigoFiltro]
    .filter(Boolean)
    .join(' · ');
}

export function MaintenanceScreen({
  autoActual,
  oilChanges,
  registros,
  onSaveOilChange,
  onBack,
}) {
  const { colors, styles } = useAppTheme();
  const [kmActual, setKmActual] = useState('');
  const [tipoAceite, setTipoAceite] = useState('');
  const [marcaAceite, setMarcaAceite] = useState('');
  const [fechaCambio, setFechaCambio] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [cambioFiltro, setCambioFiltro] = useState(false);
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [marcaFiltro, setMarcaFiltro] = useState('');
  const [codigoFiltro, setCodigoFiltro] = useState('');
  const ultimoCambio = oilChanges[0];
  const ultimoKmCombustible = registros[0]?.kilometraje;
  const proximoKm = ultimoCambio
    ? ultimoCambio.kmActual + OIL_CHANGE_KM_INTERVAL
    : null;
  const kmRestantes =
    proximoKm && ultimoKmCombustible ? proximoKm - ultimoKmCombustible : null;

  async function handleSave() {
    const saved = await onSaveOilChange({
      kmActual,
      tipoAceite: tipoAceite.trim(),
      marcaAceite: marcaAceite.trim(),
      cambioFiltro,
      tipoFiltro,
      marcaFiltro: marcaFiltro.trim(),
      codigoFiltro: codigoFiltro.trim(),
      parsedDate: fechaCambio,
    });

    if (!saved) {
      return;
    }

    setKmActual('');
    setTipoAceite('');
    setMarcaAceite('');
    setFechaCambio(new Date());
    setShowDatePicker(false);
    setCambioFiltro(false);
    setTipoFiltro('');
    setMarcaFiltro('');
    setCodigoFiltro('');
  }

  return (
    <ScrollView contentContainerStyle={styles.formScreen}>
      <View style={styles.formHeader}>
        <Text style={styles.brandSmall}>Mantenimiento</Text>
        <Text style={styles.dashboardTitle}>Cambio de aceite</Text>
        <Text style={styles.panelSubtitle}>
          {autoActual
            ? `${autoActual.marca} ${autoActual.modelo}`
            : 'Selecciona un auto para guardar mantenimientos.'}
        </Text>
      </View>

      <View style={styles.formPanel}>
        <Text style={styles.panelTitle}>Registrar cambio</Text>

        <TextInput
          style={styles.input}
          placeholder="Km actual"
          keyboardType="numeric"
          value={kmActual}
          onChangeText={(value) => setKmActual(formatIntegerInput(value))}
          placeholderTextColor={colors.muted}
        />
        <TextInput
          style={styles.input}
          placeholder="Tipo aceite, ejemplo 5W40"
          value={tipoAceite}
          onChangeText={setTipoAceite}
          autoCapitalize="characters"
          placeholderTextColor={colors.muted}
        />
        <TextInput
          style={styles.input}
          placeholder="Marca aceite"
          value={marcaAceite}
          onChangeText={setMarcaAceite}
          placeholderTextColor={colors.muted}
        />
        <TouchableOpacity
          activeOpacity={0.82}
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <View>
            <Text style={styles.statLabel}>Fecha cambio</Text>
            <Text style={styles.datePickerText}>{formatDate(fechaCambio)}</Text>
          </View>
          <MaterialCommunityIcons name="calendar" size={24} color={colors.blue} />
        </TouchableOpacity>

        {showDatePicker ? (
          <View style={styles.datePickerPanel}>
            <DateTimePicker
              value={fechaCambio}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setFechaCambio(selectedDate);
                  setShowDatePicker(false);
                }

                if (Platform.OS !== 'ios' && !selectedDate) {
                  setShowDatePicker(false);
                }
              }}
            />
            <TouchableOpacity
              activeOpacity={0.82}
              style={styles.datePickerDoneButton}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.datePickerDoneText}>Listo</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <TouchableOpacity
          activeOpacity={0.82}
          style={styles.checkboxRow}
          onPress={() => setCambioFiltro((current) => !current)}
        >
          <View style={styles.checkboxBox}>
            {cambioFiltro ? (
              <MaterialCommunityIcons name="check" size={18} color={colors.blue} />
            ) : null}
          </View>
          <Text style={styles.checkboxText}>Cambio de filtro</Text>
        </TouchableOpacity>

        {cambioFiltro ? (
          <View style={styles.conditionalPanel}>
            <Text style={styles.sectionTitle}>Filtro de aceite</Text>

            <View style={styles.filterTypeRow}>
              <TouchableOpacity
                activeOpacity={0.82}
                style={[
                  styles.filterTypeButton,
                  tipoFiltro === 'Tarro' ? styles.filterTypeButtonSelected : null,
                ]}
                onPress={() => setTipoFiltro('Tarro')}
              >
                <Text
                  style={[
                    styles.filterTypeText,
                    tipoFiltro === 'Tarro' ? styles.filterTypeTextSelected : null,
                  ]}
                >
                  Tarro
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.82}
                style={[
                  styles.filterTypeButton,
                  tipoFiltro === 'Elemento' ? styles.filterTypeButtonSelected : null,
                ]}
                onPress={() => setTipoFiltro('Elemento')}
              >
                <Text
                  style={[
                    styles.filterTypeText,
                    tipoFiltro === 'Elemento' ? styles.filterTypeTextSelected : null,
                  ]}
                >
                  Elemento
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Marca filtro"
              value={marcaFiltro}
              onChangeText={setMarcaFiltro}
              placeholderTextColor={colors.muted}
            />
            <TextInput
              style={styles.input}
              placeholder="Código filtro"
              value={codigoFiltro}
              onChangeText={setCodigoFiltro}
              autoCapitalize="characters"
              placeholderTextColor={colors.muted}
            />
          </View>
        ) : null}

        <AppButton title="Guardar cambio de aceite" onPress={handleSave} />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionEyebrow}>Seguimiento</Text>
        <Text style={styles.sectionHeading}>Próximo cambio</Text>
      </View>

      <View style={styles.taskItem}>
        {ultimoCambio ? (
          <>
            <Text style={styles.taskTitle}>{formatDate(new Date(ultimoCambio.dueDate))}</Text>
            <Text style={styles.taskMeta}>
              Regla anual desde el {formatDate(new Date(ultimoCambio.fechaCambio))}.
            </Text>
            <Text style={styles.taskMeta}>
              Regla secundaria: {formatNumber(proximoKm)} km
              {typeof kmRestantes === 'number'
                ? kmRestantes > 0
                  ? `, faltan ${formatNumber(kmRestantes)} km según combustible.`
                  : ', kilometraje objetivo alcanzado.'
                : '.'}
            </Text>
          </>
        ) : (
          <Text style={styles.taskMeta}>
            Guarda un cambio de aceite para activar el recordatorio anual y el control por km.
          </Text>
        )}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionEyebrow}>Historial</Text>
        <Text style={styles.sectionHeading}>Cambios guardados</Text>
      </View>

      <View style={styles.taskRow}>
        {oilChanges.length === 0 ? (
          <Text style={styles.emptyText}>Todavía no hay cambios de aceite guardados.</Text>
        ) : (
          oilChanges.map((item) => {
            const filterSummary = getFilterSummary(item);

            return (
              <View key={item.id} style={styles.taskItem}>
                <Text style={styles.taskTitle}>
                  {formatNumber(item.kmActual)} km · {item.tipoAceite}
                </Text>
                <Text style={styles.taskMeta}>
                  {item.marcaAceite} · {formatDate(new Date(item.fechaCambio))}
                </Text>
                <Text style={styles.taskMeta}>
                  Filtro: {item.cambioFiltro ? 'Sí' : 'No'}
                </Text>
                {item.cambioFiltro && filterSummary ? (
                  <Text style={styles.taskMeta}>{filterSummary}</Text>
                ) : null}
              </View>
            );
          })
        )}
      </View>

      <AppButton title="Volver" onPress={onBack} variant="back" />
    </ScrollView>
  );
}
