import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { ActionMenuScreen } from './src/screens/ActionMenuScreen';
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
import { getFuelRecords, saveFuelRecords } from './src/storage/fuelStorage';
import { getTodayLabel } from './src/utils/dates';
import { calculateFuelConsumption } from './src/utils/fuelCalculations';
import { validateCredentials, validateFuelForm } from './src/utils/validators';
import { AppThemeProvider } from './src/theme/AppThemeContext';

const SCREENS = {
  login: 'login',
  home: 'home',
  actions: 'actions',
  maintenance: 'maintenance',
  fuelForm: 'fuelForm',
  fuelRecords: 'fuelRecords',
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
  const [themeMode, setThemeMode] = useState('dark');

  useEffect(() => {
    cargarSesion();
  }, []);

  useEffect(() => {
    if (usuarioActual) {
      cargarRegistros(usuarioActual);
    }
  }, [usuarioActual]);

  async function cargarSesion() {
    try {
      const sesionGuardada = await getCurrentUser();

      if (sesionGuardada) {
        setUsuarioActual(sesionGuardada);
        setPantalla(SCREENS.home);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la sesion.');
    }
  }

  async function cargarRegistros(nombreUsuario) {
    try {
      const registrosGuardados = await getFuelRecords(nombreUsuario);
      setRegistros(registrosGuardados);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los registros.');
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
      setPantalla(SCREENS.fuelRecords);

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
        Alert.alert('Error', 'Usuario o contrasena incorrectos.');
        return;
      }

      await setCurrentUser(usuarioEncontrado.usuario);

      setUsuarioActual(usuarioEncontrado.usuario);
      setUsuario('');
      setContrasena('');
      setPantalla(SCREENS.home);
    } catch (error) {
      Alert.alert('Error', 'No se pudo iniciar sesion.');
    }
  }

  async function cerrarSesion() {
    try {
      await removeCurrentUser();

      setUsuarioActual(null);
      setRegistros([]);
      setUsuario('');
      setContrasena('');
      setPantalla(SCREENS.login);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cerrar sesion.');
    }
  }

  async function guardarRegistro() {
    const validationError = validateFuelForm(kilometraje, litros, precio, tipoCarga);

    if (validationError) {
      Alert.alert(validationError.title, validationError.message);
      return;
    }

    const kmNumero = Number(kilometraje);
    const litrosNumero = Number(litros);
    const precioNumero = Number(precio);
    const calculo = calculateFuelConsumption(
      registros,
      tipoCarga,
      kmNumero,
      litrosNumero
    );

    const nuevoRegistro = {
      id: Date.now().toString(),
      usuario: usuarioActual,
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
      await saveFuelRecords(usuarioActual, nuevosRegistros);

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

  function borrarDatosLocales() {
    Alert.alert(
      'Borrar datos',
      'Esto eliminara usuarios, sesion y registros guardados en este dispositivo.',
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

  function alternarTema() {
    setThemeMode((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
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
          onKilometrajeChange={setKilometraje}
          onLitrosChange={setLitros}
          onPrecioChange={setPrecio}
          onTipoCargaChange={setTipoCarga}
          onSave={guardarRegistro}
          onBack={() => setPantalla(SCREENS.actions)}
        />
      );
    }

    if (pantalla === SCREENS.actions) {
      return (
        <ActionMenuScreen
          usuarioActual={usuarioActual}
          onBack={() => setPantalla(SCREENS.home)}
          onFuelRecord={() => setPantalla(SCREENS.fuelForm)}
          onMaintenance={() => setPantalla(SCREENS.maintenance)}
          onRecords={() => setPantalla(SCREENS.fuelRecords)}
        />
      );
    }

    if (pantalla === SCREENS.maintenance) {
      return <MaintenanceScreen onBack={() => setPantalla(SCREENS.actions)} />;
    }

    if (pantalla === SCREENS.fuelRecords) {
      return (
        <FuelRecordsScreen
          registros={registros}
          onAddRecord={() => setPantalla(SCREENS.fuelForm)}
          onBack={() => setPantalla(SCREENS.actions)}
        />
      );
    }

    return (
      <HomeScreen
        usuarioActual={usuarioActual}
        registros={registros}
        onLogout={cerrarSesion}
        onContinue={() => setPantalla(SCREENS.actions)}
      />
    );
  }

  return (
    <AppThemeProvider mode={themeMode} onToggleTheme={alternarTema}>
      {renderPantalla()}
    </AppThemeProvider>
  );
}
