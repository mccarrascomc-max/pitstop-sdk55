import AsyncStorage from '@react-native-async-storage/async-storage';

function getFuelRecordsKey(nombreUsuario) {
  return `registros_${nombreUsuario}`;
}

export async function getFuelRecords(nombreUsuario) {
  const registrosGuardados = await AsyncStorage.getItem(getFuelRecordsKey(nombreUsuario));
  return registrosGuardados ? JSON.parse(registrosGuardados) : [];
}

export async function saveFuelRecords(nombreUsuario, nuevosRegistros) {
  await AsyncStorage.setItem(getFuelRecordsKey(nombreUsuario), JSON.stringify(nuevosRegistros));
}
