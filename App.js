import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { ActionMenuScreen } from './src/screens/ActionMenuScreen';
import { CarManagerScreen } from './src/screens/CarManagerScreen';
import { FuelFormScreen } from './src/screens/FuelFormScreen';
import { FuelRecordsScreen } from './src/screens/FuelRecordsScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { MaintenanceScreen } from './src/screens/MaintenanceScreen';
import {
  clearAllLocalData,
  getCurrentUser,
  getUsers,
  removeCurrentUser,
  saveUsers,
  setCurrentUser,
} from './src/storage/authStorage';
import {
  getCars,
  getSelectedCarId,
  saveCars,
  setSelectedCarId,
} from './src/storage/carStorage';
import { getFuelRecords, saveFuelRecords } from './src/storage/fuelStorage';
import { getOilChanges, saveOilChanges } from './src/storage/maintenanceStorage';
import { getTodayLabel } from './src/utils/dates';
import { calculateFuelConsumption } from './src/utils/fuelCalculations';
import {
  formatIntegerInput,
  formatLitersInput,
  parseIntegerInput,
  parseLitersInput,
} from './src/utils/formatters';
import {
  addOneYear,
  cancelOilChangeReminder,
  notifyOilChangeByKm,
  OIL_CHANGE_KM_INTERVAL,
  scheduleOilChangeReminder,
} from './src/utils/maintenanceNotifications';
import { validateCredentials, validateFuelForm } from './src/utils/validators';
import { AppThemeProvider } from './src/theme/AppThemeContext';

const SCREENS = {
  login: 'login',
  home: 'home',
  actions: 'actions',
  maintenance: 'maintenance',
  fuelForm: 'fuelForm',
  fuelRecords: 'fuelRecords',
  cars: 'cars',
};

export default function App() {
  const [pantalla, setPantalla] = useState(SCREENS.login);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [kilometraje, setKilometraje] = useState('');
  const [litros, setLitros] = useState('');
  const [precio, setPrecio] = useState('');
  const [tipoCarga, setTipoCarga] = useState('');
  const [registros, setRegistros] = useState([]);
  const [autos, setAutos] = useState([]);
  const [selectedCarId, setSelectedCarIdState] = useState(null);
  const [oilChanges, setOilChanges] = useState([]);

  useEffect(() => {
    cargarSesion();
  }, []);

  useEffect(() => {
    if (usuarioActual) {
      cargarAutos(usuarioActual);
    }
  }, [usuarioActual]);

  useEffect(() => {
    if (usuarioActual && selectedCarId) {
      cargarRegistros(usuarioActual, selectedCarId);
      cargarCambiosAceite(usuarioActual, selectedCarId);
    } else {
      setRegistros([]);
      setOilChanges([]);
    }
  }, [usuarioActual, selectedCarId]);

  async function cargarSesion() {
    try {
      const sesionGuardada = await getCurrentUser();

      if (sesionGuardada) {
        setUsuarioActual(sesionGuardada);
        setPantalla(SCREENS.home);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la sesión.');
    }
  }

  async function cargarAutos(nombreUsuario) {
    try {
      const [autosGuardados, autoGuardadoId] = await Promise.all([
        getCars(nombreUsuario),
        getSelectedCarId(nombreUsuario),
      ]);
      const autoSeleccionadoExiste = autosGuardados.some(
        (auto) => auto.id === autoGuardadoId
      );

      setAutos(autosGuardados);
      setSelectedCarIdState(
        autoSeleccionadoExiste ? autoGuardadoId : autosGuardados[0]?.id ?? null
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los autos.');
    }
  }

  async function cargarRegistros(nombreUsuario, autoId) {
    try {
      const registrosGuardados = await getFuelRecords(nombreUsuario, autoId);
      setRegistros(registrosGuardados);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los registros.');
    }
  }

  async function cargarCambiosAceite(nombreUsuario, autoId) {
    try {
      const cambiosGuardados = await getOilChanges(nombreUsuario, autoId);
      setOilChanges(cambiosGuardados);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los cambios de aceite.');
    }
  }

  async function crearCuenta() {
    const validationError = validateCredentials(usuario, contrasena);

    if (validationError) {
      Alert.alert('Faltan datos', validationError);
      return;
    }

    try {
      const usuarios = await getUsers();
      const existeUsuario = usuarios.find(
        (item) => item.usuario.toLowerCase() === usuario.toLowerCase()
      );

      if (existeUsuario) {
        Alert.alert('Usuario existente', 'Ese usuario ya existe.');
        return;
      }

      await saveUsers([...usuarios, { usuario, contrasena }]);
      await setCurrentUser(usuario);

      setUsuarioActual(usuario);
      setUsuario('');
      setContrasena('');
      setPantalla(SCREENS.cars);

      Alert.alert('Cuenta creada', 'Cuenta creada correctamente.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear la cuenta.');
    }
  }

  async function iniciarSesion() {
    const validationError = validateCredentials(usuario, contrasena);

    if (validationError) {
      Alert.alert('Faltan datos', validationError);
      return;
    }

    try {
      const usuarios = await getUsers();
      const usuarioEncontrado = usuarios.find(
        (item) =>
          item.usuario.toLowerCase() === usuario.toLowerCase() &&
          item.contrasena === contrasena
      );

      if (!usuarioEncontrado) {
        Alert.alert('Error', 'Usuario o contraseña incorrectos.');
        return;
      }

      await setCurrentUser(usuarioEncontrado.usuario);

      setUsuarioActual(usuarioEncontrado.usuario);
      setUsuario('');
      setContrasena('');
      setPantalla(SCREENS.home);
    } catch (error) {
      Alert.alert('Error', 'No se pudo iniciar sesión.');
    }
  }

  async function cerrarSesion() {
    try {
      await removeCurrentUser();

      setUsuarioActual(null);
      setRegistros([]);
      setOilChanges([]);
      setAutos([]);
      setSelectedCarIdState(null);
      setUsuario('');
      setContrasena('');
      setPantalla(SCREENS.login);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cerrar sesión.');
    }
  }

  async function guardarRegistro() {
    if (!selectedCarId) {
      Alert.alert('Falta auto', 'Crea o selecciona un auto antes de registrar combustible.');
      setPantalla(SCREENS.cars);
      return;
    }

    const validationError = validateFuelForm(kilometraje, litros, precio, tipoCarga);

    if (validationError) {
      Alert.alert(validationError.title, validationError.message);
      return;
    }

    const kmNumero = parseIntegerInput(kilometraje);
    const litrosNumero = parseLitersInput(litros);
    const precioNumero = parseIntegerInput(precio);
    const calculo = calculateFuelConsumption(
      registros,
      tipoCarga,
      kmNumero,
      litrosNumero
    );

    const nuevoRegistro = {
      id: Date.now().toString(),
      usuario: usuarioActual,
      autoId: selectedCarId,
      fecha: getTodayLabel(),
      kilometraje: kmNumero,
      litros: litrosNumero,
      precio: precioNumero,
      tipoCarga,
      consumo: calculo.consumo,
      mensaje: calculo.mensaje,
    };

    const nuevosRegistros = [nuevoRegistro, ...registros];

    try {
      setRegistros(nuevosRegistros);
      await saveFuelRecords(usuarioActual, selectedCarId, nuevosRegistros);
      await revisarAceitePorKilometraje(kmNumero);

      setKilometraje('');
      setLitros('');
      setPrecio('');
      setTipoCarga('');
      setPantalla(SCREENS.home);

      Alert.alert('Registro guardado', calculo.mensaje);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron guardar los registros.');
    }
  }

  function cambiarKilometraje(value) {
    setKilometraje(formatIntegerInput(value));
  }

  function cambiarLitros(value) {
    setLitros(formatLitersInput(value));
  }

  function cambiarPrecio(value) {
    setPrecio(formatIntegerInput(value));
  }

  async function revisarAceitePorKilometraje(kmActualCombustible) {
    const ultimoCambio = oilChanges[0];

    if (!ultimoCambio) {
      return;
    }

    const kmObjetivo = ultimoCambio.kmActual + OIL_CHANGE_KM_INTERVAL;

    if (kmActualCombustible < kmObjetivo || ultimoCambio.kmAlertSent) {
      return;
    }

    const autoActual = autos.find((auto) => auto.id === selectedCarId);
    const cambiosActualizados = oilChanges.map((item, index) =>
      index === 0 ? { ...item, kmAlertSent: true } : item
    );

    setOilChanges(cambiosActualizados);
    await saveOilChanges(usuarioActual, selectedCarId, cambiosActualizados);
    await notifyOilChangeByKm({
      autoName: autoActual
        ? `${autoActual.marca} ${autoActual.modelo}`
        : 'tu auto',
      currentKm: kmActualCombustible,
      dueKm: kmObjetivo,
    });
  }

  async function guardarCambioAceite(datosCambio) {
    if (!selectedCarId) {
      Alert.alert('Falta auto', 'Crea o selecciona un auto antes de guardar mantenimiento.');
      setPantalla(SCREENS.cars);
      return false;
    }

    const kmNumero = parseIntegerInput(datosCambio.kmActual);

    if (
      !datosCambio.kmActual ||
      !datosCambio.tipoAceite ||
      !datosCambio.marcaAceite ||
      !datosCambio.parsedDate
    ) {
      Alert.alert('Faltan datos', 'Completa km, aceite, marca y fecha.');
      return false;
    }

    if (isNaN(kmNumero) || kmNumero <= 0) {
      Alert.alert('Datos inválidos', 'El km actual debe ser un número mayor a cero.');
      return false;
    }

    const dueDate = addOneYear(datosCambio.parsedDate);
    const autoActual = autos.find((auto) => auto.id === selectedCarId);

    try {
      await cancelOilChangeReminder(oilChanges[0]?.notificationId);
      const notificationId = await scheduleOilChangeReminder({
        autoName: autoActual
          ? `${autoActual.marca} ${autoActual.modelo}`
          : 'tu auto',
        dueDate,
      });
      const nuevoCambio = {
        id: Date.now().toString(),
        autoId: selectedCarId,
        kmActual: kmNumero,
        tipoAceite: datosCambio.tipoAceite,
        marcaAceite: datosCambio.marcaAceite,
        cambioFiltro: datosCambio.cambioFiltro,
        tipoFiltro: datosCambio.cambioFiltro ? datosCambio.tipoFiltro : '',
        marcaFiltro: datosCambio.cambioFiltro ? datosCambio.marcaFiltro : '',
        codigoFiltro: datosCambio.cambioFiltro ? datosCambio.codigoFiltro : '',
        fechaCambio: datosCambio.parsedDate.toISOString(),
        dueDate: dueDate.toISOString(),
        notificationId,
        kmAlertSent: false,
      };
      const nuevosCambios = [nuevoCambio, ...oilChanges];

      setOilChanges(nuevosCambios);
      await saveOilChanges(usuarioActual, selectedCarId, nuevosCambios);
      Alert.alert('Mantenimiento guardado', 'Recordatorio de aceite programado.');
      return true;
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el cambio de aceite.');
      return false;
    }
  }

  async function crearAuto(datosAuto) {
    if (!datosAuto.marca || !datosAuto.modelo || !datosAuto.cilindrada || !datosAuto.anio) {
      Alert.alert('Faltan datos', 'Completa marca, modelo, cilindrada y año.');
      return;
    }

    const nuevoAuto = {
      id: Date.now().toString(),
      ...datosAuto,
    };
    const nuevosAutos = [nuevoAuto, ...autos];

    try {
      setAutos(nuevosAutos);
      setSelectedCarIdState(nuevoAuto.id);
      await saveCars(usuarioActual, nuevosAutos);
      await setSelectedCarId(usuarioActual, nuevoAuto.id);
      setRegistros([]);
      setOilChanges([]);
      Alert.alert('Auto guardado', 'El auto quedó seleccionado.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el auto.');
    }
  }

  async function seleccionarAuto(autoId) {
    try {
      setSelectedCarIdState(autoId);
      await setSelectedCarId(usuarioActual, autoId);
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar el auto.');
    }
  }

  function abrirRegistroCombustible() {
    if (!selectedCarId) {
      Alert.alert('Falta auto', 'Crea o selecciona un auto antes de registrar combustible.');
      setPantalla(SCREENS.cars);
      return;
    }

    setPantalla(SCREENS.fuelForm);
  }

  function abrirMantenimiento() {
    if (!selectedCarId) {
      Alert.alert('Falta auto', 'Crea o selecciona un auto antes de guardar mantenimiento.');
      setPantalla(SCREENS.cars);
      return;
    }

    setPantalla(SCREENS.maintenance);
  }

  function borrarDatosLocales() {
    Alert.alert(
      'Borrar datos',
      'Esto eliminará usuarios, sesión y registros guardados en este dispositivo.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllLocalData();
              setUsuarioActual(null);
              setRegistros([]);
              setOilChanges([]);
              setAutos([]);
              setSelectedCarIdState(null);
              setUsuario('');
              setContrasena('');
              setPantalla(SCREENS.login);
              Alert.alert('Listo', 'Datos locales eliminados.');
            } catch (error) {
              Alert.alert('Error', 'No se pudieron borrar los datos.');
            }
          },
        },
      ]
    );
  }

  function renderPantalla() {
    if (pantalla === SCREENS.login) {
      return (
        <LoginScreen
          usuario={usuario}
          contrasena={contrasena}
          onUsuarioChange={setUsuario}
          onContrasenaChange={setContrasena}
          onLogin={iniciarSesion}
          onCreateAccount={crearCuenta}
          onClearData={borrarDatosLocales}
        />
      );
    }

    if (pantalla === SCREENS.fuelForm) {
      return (
        <FuelFormScreen
          usuarioActual={usuarioActual}
          kilometraje={kilometraje}
          litros={litros}
          precio={precio}
          tipoCarga={tipoCarga}
          onKilometrajeChange={cambiarKilometraje}
          onLitrosChange={cambiarLitros}
          onPrecioChange={cambiarPrecio}
          onTipoCargaChange={setTipoCarga}
          onSave={guardarRegistro}
          onBack={() => setPantalla(SCREENS.home)}
        />
      );
    }

    if (pantalla === SCREENS.actions) {
      return (
        <ActionMenuScreen
          usuarioActual={usuarioActual}
          onBack={() => setPantalla(SCREENS.home)}
          onFuelRecord={abrirRegistroCombustible}
          onMaintenance={abrirMantenimiento}
          onRecords={() => setPantalla(SCREENS.fuelRecords)}
        />
      );
    }

    if (pantalla === SCREENS.maintenance) {
      return (
        <MaintenanceScreen
          autoActual={autos.find((auto) => auto.id === selectedCarId)}
          oilChanges={oilChanges}
          registros={registros}
          onSaveOilChange={guardarCambioAceite}
          onBack={() => setPantalla(SCREENS.home)}
        />
      );
    }

    if (pantalla === SCREENS.cars) {
      return (
        <CarManagerScreen
          autos={autos}
          selectedCarId={selectedCarId}
          onCreateCar={crearAuto}
          onSelectCar={seleccionarAuto}
          onBack={() => setPantalla(SCREENS.home)}
        />
      );
    }

    if (pantalla === SCREENS.fuelRecords) {
      return (
        <FuelRecordsScreen
          registros={registros}
          oilChanges={oilChanges}
          onAddRecord={abrirRegistroCombustible}
          onAddMaintenance={abrirMantenimiento}
          onBack={() => setPantalla(SCREENS.home)}
        />
      );
    }

    return (
      <HomeScreen
        usuarioActual={usuarioActual}
        autoActual={autos.find((auto) => auto.id === selectedCarId)}
        registros={registros}
        oilChanges={oilChanges}
        onLogout={cerrarSesion}
        onCars={() => setPantalla(SCREENS.cars)}
        onMaintenance={abrirMantenimiento}
        onFuelRecord={abrirRegistroCombustible}
        onRecords={() => setPantalla(SCREENS.fuelRecords)}
      />
    );
  }

  return (
    <AppThemeProvider mode="dark">
      {renderPantalla()}
    </AppThemeProvider>
  );
}
