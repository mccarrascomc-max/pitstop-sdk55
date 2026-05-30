import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function App() {
  const [pantalla, setPantalla] = useState('login');

  const [usuarioActual, setUsuarioActual] = useState(null);
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');

  const [kilometraje, setKilometraje] = useState('');
  const [litros, setLitros] = useState('');
  const [precio, setPrecio] = useState('');
  const [tipoCarga, setTipoCarga] = useState('');

  const [registros, setRegistros] = useState([]);

  useEffect(() => {
	cargarSesion();
  }, []);

  useEffect(() => {
	if (usuarioActual) {
  	cargarRegistros(usuarioActual);
	}
  }, [usuarioActual]);

  const cargarSesion = async () => {
	try {
  	const sesionGuardada = await AsyncStorage.getItem('usuarioActual');

  	if (sesionGuardada) {
    	setUsuarioActual(sesionGuardada);
    	setPantalla('inicio');
  	}
	} catch (error) {
  	Alert.alert('Error', 'No se pudo cargar la sesión.');
	}
  };

  const obtenerUsuarios = async () => {
	try {
  	const usuariosGuardados = await AsyncStorage.getItem('usuarios');
  	return usuariosGuardados ? JSON.parse(usuariosGuardados) : [];
	} catch (error) {
  	Alert.alert('Error', 'No se pudieron obtener los usuarios.');
  	return [];
	}
  };

  const guardarUsuarios = async (listaUsuarios) => {
	try {
  	await AsyncStorage.setItem('usuarios', JSON.stringify(listaUsuarios));
	} catch (error) {
  	Alert.alert('Error', 'No se pudieron guardar los usuarios.');
	}
  };

  const crearCuenta = async () => {
	if (!usuario || !contrasena) {
  	Alert.alert('Faltan datos', 'Ingresa usuario y contraseña.');
  	return;
	}

	try {
  	const usuarios = await obtenerUsuarios();

  	const existeUsuario = usuarios.find(
    	(item) => item.usuario.toLowerCase() === usuario.toLowerCase()
  	);

  	if (existeUsuario) {
    	Alert.alert('Usuario existente', 'Ese usuario ya existe.');
    	return;
  	}

  	const nuevoUsuario = {
    	usuario,
    	contrasena,
  	};

  	const nuevosUsuarios = [...usuarios, nuevoUsuario];

  	await guardarUsuarios(nuevosUsuarios);
  	await AsyncStorage.setItem('usuarioActual', usuario);

  	setUsuarioActual(usuario);
  	setUsuario('');
  	setContrasena('');
  	setPantalla('inicio');

  	Alert.alert('Cuenta creada', 'Cuenta creada correctamente.');
	} catch (error) {
  	Alert.alert('Error', 'No se pudo crear la cuenta.');
	}
  };

  const iniciarSesion = async () => {
	if (!usuario || !contrasena) {
  	Alert.alert('Faltan datos', 'Ingresa usuario y contraseña.');
  	return;
	}

	try {
  	const usuarios = await obtenerUsuarios();

  	const usuarioEncontrado = usuarios.find(
    	(item) =>
      	item.usuario.toLowerCase() === usuario.toLowerCase() &&
      	item.contrasena === contrasena
  	);

  	if (!usuarioEncontrado) {
    	Alert.alert('Error', 'Usuario o contraseña incorrectos.');
    	return;
  	}

  	await AsyncStorage.setItem('usuarioActual', usuarioEncontrado.usuario);

  	setUsuarioActual(usuarioEncontrado.usuario);
  	setUsuario('');
  	setContrasena('');
  	setPantalla('inicio');
	} catch (error) {
  	Alert.alert('Error', 'No se pudo iniciar sesión.');
	}
  };

  const cerrarSesion = async () => {
	try {
  	await AsyncStorage.removeItem('usuarioActual');

  	setUsuarioActual(null);
  	setRegistros([]);
  	setUsuario('');
  	setContrasena('');
  	setPantalla('login');
	} catch (error) {
  	Alert.alert('Error', 'No se pudo cerrar sesión.');
	}
  };

  const cargarRegistros = async (nombreUsuario) => {
	try {
  	const registrosGuardados = await AsyncStorage.getItem(
    	`registros_${nombreUsuario}`
  	);

  	if (registrosGuardados) {
    	setRegistros(JSON.parse(registrosGuardados));
  	} else {
    	setRegistros([]);
  	}
	} catch (error) {
  	Alert.alert('Error', 'No se pudieron cargar los registros.');
	}
  };

  const guardarRegistros = async (nombreUsuario, nuevosRegistros) => {
	try {
  	await AsyncStorage.setItem(
    	`registros_${nombreUsuario}`,
    	JSON.stringify(nuevosRegistros)
  	);
	} catch (error) {
  	Alert.alert('Error', 'No se pudieron guardar los registros.');
	}
  };

  const guardarRegistro = async () => {
	if (!kilometraje || !litros || !precio || !tipoCarga) {
  	Alert.alert('Faltan datos', 'Completa todos los campos.');
  	return;
	}

	const kmNumero = Number(kilometraje);
	const litrosNumero = Number(litros);
	const precioNumero = Number(precio);

	if (isNaN(kmNumero) || isNaN(litrosNumero) || isNaN(precioNumero)) {
  	Alert.alert(
    	'Datos inválidos',
    	'Kilometraje, litros y precio deben ser números.'
  	);
  	return;
	}

	if (kmNumero <= 0 || litrosNumero <= 0 || precioNumero <= 0) {
  	Alert.alert('Datos inválidos', 'Los valores deben ser mayores a cero.');
  	return;
	}

	const ultimoRegistro = registros[0];

	let consumoCalculado = null;
	let mensajeCalculo = 'No se calcula consumo para este registro.';

	if (
  	ultimoRegistro &&
  	ultimoRegistro.tipoCarga === 'Carga completa' &&
  	tipoCarga === 'Carga completa'
	) {
  	const kmRecorridos = kmNumero - ultimoRegistro.kilometraje;

  	if (kmRecorridos > 0) {
    	consumoCalculado = kmRecorridos / litrosNumero;
    	mensajeCalculo = `Consumo calculado: ${consumoCalculado.toFixed(
      	2
    	)} km/L`;
  	} else {
    	mensajeCalculo =
      	'No se pudo calcular: el kilometraje debe ser mayor al registro anterior.';
  	}
	}

	if (
  	ultimoRegistro &&
  	ultimoRegistro.tipoCarga !== 'Carga completa' &&
  	tipoCarga === 'Carga completa'
	) {
  	mensajeCalculo =
    	'No se calculó consumo porque la carga anterior no fue completa.';
	}

	if (tipoCarga === 'Carga parcial') {
  	mensajeCalculo =
    	'Carga parcial registrada. No se calcula consumo en cargas parciales.';
	}

	const nuevoRegistro = {
  	id: Date.now().toString(),
  	usuario: usuarioActual,
  	fecha: new Date().toLocaleDateString(),
  	kilometraje: kmNumero,
  	litros: litrosNumero,
  	precio: precioNumero,
  	tipoCarga,
  	consumo: consumoCalculado,
  	mensaje: mensajeCalculo,
	};

	const nuevosRegistros = [nuevoRegistro, ...registros];

	setRegistros(nuevosRegistros);
	await guardarRegistros(usuarioActual, nuevosRegistros);

	setKilometraje('');
	setLitros('');
	setPrecio('');
	setTipoCarga('');
	setPantalla('inicio');

	Alert.alert('Registro guardado', mensajeCalculo);
  };

  const borrarDatosLocales = async () => {
	Alert.alert(
  	'Borrar datos',
  	'Esto eliminará usuarios, sesión y registros guardados en este dispositivo.',
  	[
    	{
      	text: 'Cancelar',
      	style: 'cancel',
    	},
    	{
      	text: 'Borrar',
      	style: 'destructive',
      	onPress: async () => {
        	try {
          	await AsyncStorage.clear();
          	setUsuarioActual(null);
          	setRegistros([]);
          	setUsuario('');
          	setContrasena('');
          	setPantalla('login');
          	Alert.alert('Listo', 'Datos locales eliminados.');
        	} catch (error) {
          	Alert.alert('Error', 'No se pudieron borrar los datos.');
        	}
      	},
    	},
  	]
	);
  };

  if (pantalla === 'login') {
	return (
  	<View style={styles.container}>
    	<Text style={styles.title}>Mi Auto</Text>
    	<Text style={styles.subtitle}>Inicia sesión o crea una cuenta</Text>

    	<TextInput
      	style={styles.input}
      	placeholder="Usuario"
      	value={usuario}
      	onChangeText={setUsuario}
      	autoCapitalize="none"
    	/>

    	<TextInput
      	style={styles.input}
      	placeholder="Contraseña"
      	value={contrasena}
      	onChangeText={setContrasena}
      	secureTextEntry
    	/>

    	<TouchableOpacity style={styles.button} onPress={iniciarSesion}>
      	<Text style={styles.buttonText}>Iniciar sesión</Text>
    	</TouchableOpacity>

    	<TouchableOpacity style={styles.secondaryButton} onPress={crearCuenta}>
      	<Text style={styles.secondaryButtonText}>Crear cuenta</Text>
    	</TouchableOpacity>

    	<TouchableOpacity style={styles.dangerButton} onPress={borrarDatosLocales}>
      	<Text style={styles.dangerButtonText}>Borrar datos locales</Text>
    	</TouchableOpacity>

    	<View style={styles.infoBox}>
      	<Text style={styles.infoText}>
        	Los usuarios y registros se guardan localmente en este dispositivo.
      	</Text>
    	</View>
  	</View>
	);
  }

  if (pantalla === 'formulario') {
	return (
  	<ScrollView contentContainerStyle={styles.container}>
    	<Text style={styles.title}>Registrar combustible</Text>
    	<Text style={styles.subtitle}>Usuario: {usuarioActual}</Text>

    	<TextInput
      	style={styles.input}
      	placeholder="Kilometraje actual"
      	keyboardType="numeric"
      	value={kilometraje}
      	onChangeText={setKilometraje}
    	/>

    	<TextInput
      	style={styles.input}
      	placeholder="Litros cargados"
      	keyboardType="numeric"
      	value={litros}
      	onChangeText={setLitros}
    	/>

    	<TextInput
      	style={styles.input}
      	placeholder="Precio total"
      	keyboardType="numeric"
      	value={precio}
      	onChangeText={setPrecio}
    	/>

    	<Text style={styles.sectionTitle}>Tipo de carga</Text>

    	<TouchableOpacity
      	style={[
        	styles.optionButton,
        	tipoCarga === 'Carga completa' && styles.optionSelectedFull,
      	]}
      	onPress={() => setTipoCarga('Carga completa')}
    	>
      	<Text
        	style={[
          	styles.optionText,
          	tipoCarga === 'Carga completa' && styles.optionTextSelected,
        	]}
      	>
        	Carga completa
      	</Text>
    	</TouchableOpacity>

    	<TouchableOpacity
      	style={[
        	styles.optionButton,
        	tipoCarga === 'Carga parcial' && styles.optionSelectedPartial,
      	]}
      	onPress={() => setTipoCarga('Carga parcial')}
    	>
      	<Text
        	style={[
          	styles.optionText,
          	tipoCarga === 'Carga parcial' && styles.optionTextSelected,
        	]}
      	>
        	Carga parcial
      	</Text>
    	</TouchableOpacity>

    	<View style={styles.infoBox}>
      	<Text style={styles.infoText}>
        	El consumo solo se calcula si la carga anterior y la actual son completas consecutivas.
      	</Text>
    	</View>

    	<TouchableOpacity style={styles.button} onPress={guardarRegistro}>
      	<Text style={styles.buttonText}>Guardar registro</Text>
    	</TouchableOpacity>

    	<TouchableOpacity
      	style={styles.backButton}
      	onPress={() => setPantalla('inicio')}
    	>
      	<Text style={styles.backButtonText}>Volver</Text>
    	</TouchableOpacity>
  	</ScrollView>
	);
  }

  return (
	<ScrollView contentContainerStyle={styles.container}>
  	<Text style={styles.title}>Mi Auto</Text>
  	<Text style={styles.subtitle}>Control de mantenimiento y combustible</Text>

  	<View style={styles.userBox}>
    	<Text style={styles.userText}>Usuario: {usuarioActual}</Text>

    	<TouchableOpacity onPress={cerrarSesion}>
      	<Text style={styles.logoutText}>Cerrar sesión</Text>
    	</TouchableOpacity>
  	</View>

  	<View style={styles.card}>
    	<Text style={styles.cardTitle}>Próximas mantenciones</Text>
    	<Text style={styles.item}>🛢️ Cambio de aceite</Text>
    	<Text style={styles.item}>🌬️ Filtro de aire</Text>
  	</View>

  	<View style={styles.card}>
    	<Text style={styles.cardTitle}>Combustible</Text>
    	<Text style={styles.item}>⛽ Carga completa</Text>
    	<Text style={styles.item}>⛽ Carga parcial</Text>
  	</View>

  	<TouchableOpacity
    	style={styles.button}
    	onPress={() => setPantalla('formulario')}
  	>
    	<Text style={styles.buttonText}>Agregar registro</Text>
  	</TouchableOpacity>

  	<View style={styles.historyContainer}>
    	<Text style={styles.historyTitle}>Historial de combustible</Text>

    	{registros.length === 0 ? (
      	<Text style={styles.emptyText}>Aún no hay registros.</Text>
    	) : (
      	registros.map((registro) => (
        	<View key={registro.id} style={styles.historyCard}>
          	<Text style={styles.historyMain}>
            	{registro.tipoCarga === 'Carga completa' ? '🟢' : '🟡'}{' '}
            	{registro.tipoCarga}
          	</Text>

          	<Text style={styles.historyText}>Fecha: {registro.fecha}</Text>
          	<Text style={styles.historyText}>
            	Kilometraje: {registro.kilometraje} km
          	</Text>
          	<Text style={styles.historyText}>Litros: {registro.litros} L</Text>
          	<Text style={styles.historyText}>Precio: ${registro.precio}</Text>

          	{registro.consumo ? (
            	<Text style={styles.consumoText}>
              	Consumo: {registro.consumo.toFixed(2)} km/L
            	</Text>
          	) : (
            	<Text style={styles.noConsumoText}>{registro.mensaje}</Text>
          	)}
        	</View>
      	))
    	)}
  	</View>
	</ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
	flexGrow: 1,
	padding: 24,
	backgroundColor: '#f3f4f6',
	justifyContent: 'center',
  },
  title: {
	fontSize: 34,
	fontWeight: 'bold',
	textAlign: 'center',
	color: '#111827',
	marginBottom: 8,
  },
  subtitle: {
	fontSize: 16,
	textAlign: 'center',
	color: '#6b7280',
	marginBottom: 30,
  },
  userBox: {
	backgroundColor: '#ffffff',
	padding: 14,
	borderRadius: 12,
	marginBottom: 16,
	elevation: 2,
  },
  userText: {
	fontSize: 15,
	color: '#111827',
	fontWeight: 'bold',
	textAlign: 'center',
	marginBottom: 8,
  },
  logoutText: {
	color: '#dc2626',
	fontWeight: 'bold',
	textAlign: 'center',
  },
  sectionTitle: {
	fontSize: 18,
	fontWeight: 'bold',
	color: '#111827',
	marginBottom: 12,
	marginTop: 8,
  },
  card: {
	backgroundColor: '#ffffff',
	padding: 20,
	borderRadius: 16,
	marginBottom: 16,
	elevation: 3,
  },
  cardTitle: {
	fontSize: 20,
	fontWeight: 'bold',
	color: '#111827',
	marginBottom: 12,
  },
  item: {
	fontSize: 16,
	color: '#374151',
	marginBottom: 8,
  },
  input: {
	backgroundColor: '#ffffff',
	padding: 16,
	borderRadius: 12,
	marginBottom: 12,
	fontSize: 16,
	borderWidth: 1,
	borderColor: '#e5e7eb',
  },
  button: {
	backgroundColor: '#2563eb',
	padding: 16,
	borderRadius: 14,
	marginTop: 10,
  },
  buttonText: {
	color: '#ffffff',
	fontSize: 16,
	fontWeight: 'bold',
	textAlign: 'center',
  },
  secondaryButton: {
	backgroundColor: '#ffffff',
	padding: 16,
	borderRadius: 14,
	marginTop: 12,
	borderWidth: 1,
	borderColor: '#2563eb',
  },
  secondaryButtonText: {
	color: '#2563eb',
	fontSize: 16,
	fontWeight: 'bold',
	textAlign: 'center',
  },
  dangerButton: {
	backgroundColor: '#fee2e2',
	padding: 14,
	borderRadius: 14,
	marginTop: 12,
	borderWidth: 1,
	borderColor: '#dc2626',
  },
  dangerButtonText: {
	color: '#dc2626',
	fontSize: 15,
	fontWeight: 'bold',
	textAlign: 'center',
  },
  backButton: {
	padding: 16,
	marginTop: 12,
  },
  backButtonText: {
	textAlign: 'center',
	color: '#2563eb',
	fontSize: 16,
	fontWeight: 'bold',
  },
  optionButton: {
	backgroundColor: '#ffffff',
	padding: 14,
	borderRadius: 12,
	marginBottom: 10,
	borderWidth: 1,
	borderColor: '#d1d5db',
  },
  optionSelectedFull: {
	backgroundColor: '#16a34a',
	borderColor: '#16a34a',
  },
  optionSelectedPartial: {
	backgroundColor: '#f59e0b',
	borderColor: '#f59e0b',
  },
  optionText: {
	color: '#111827',
	textAlign: 'center',
	fontWeight: 'bold',
  },
  optionTextSelected: {
	color: '#ffffff',
  },
  infoBox: {
	backgroundColor: '#dbeafe',
	padding: 14,
	borderRadius: 12,
	marginTop: 12,
	marginBottom: 8,
  },
  infoText: {
	color: '#1e3a8a',
	fontSize: 14,
	textAlign: 'center',
  },
  historyContainer: {
	marginTop: 24,
  },
  historyTitle: {
	fontSize: 22,
	fontWeight: 'bold',
	color: '#111827',
	marginBottom: 12,
  },
  emptyText: {
	fontSize: 16,
	color: '#6b7280',
	textAlign: 'center',
	marginTop: 10,
  },
  historyCard: {
	backgroundColor: '#ffffff',
	padding: 16,
	borderRadius: 14,
	marginBottom: 12,
	elevation: 2,
  },
  historyMain: {
	fontSize: 17,
	fontWeight: 'bold',
	color: '#111827',
	marginBottom: 8,
  },
  historyText: {
	fontSize: 15,
	color: '#374151',
	marginBottom: 4,
  },
  consumoText: {
	fontSize: 16,
	fontWeight: 'bold',
	color: '#16a34a',
	marginTop: 8,
  },
  noConsumoText: {
	fontSize: 14,
	color: '#92400e',
	marginTop: 8,
  },
});
