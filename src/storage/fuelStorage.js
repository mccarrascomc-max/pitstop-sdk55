import AsyncStorage from '@react-native-async-storage/async-storage';

function getFuelRecordsKey(nombreUsuario, autoId) {
  return autoId ? `registros_${nombreUsuario}_${autoId}` : `registros_${nombreUsuario}`;
}

export async function getFuelRecords(nombreUsuario, autoId) {
  const registrosGuardados = await AsyncStorage.getItem(
    getFuelRecordsKey(nombreUsuario, autoId)
  );
  return registrosGuardados ? JSON.parse(registrosGuardados) : [];
}

export async function saveFuelRecords(nombreUsuario, autoId, nuevosRegistros) {
  await AsyncStorage.setItem(
    getFuelRecordsKey(nombreUsuario, autoId),
    JSON.stringify(nuevosRegistros)
  );
}
