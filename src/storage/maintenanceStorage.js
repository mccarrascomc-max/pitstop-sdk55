import AsyncStorage from '@react-native-async-storage/async-storage';

function getOilChangesKey(nombreUsuario, autoId) {
  return `aceite_${nombreUsuario}_${autoId}`;
}

export async function getOilChanges(nombreUsuario, autoId) {
  const cambiosGuardados = await AsyncStorage.getItem(
    getOilChangesKey(nombreUsuario, autoId)
  );
  return cambiosGuardados ? JSON.parse(cambiosGuardados) : [];
}

export async function saveOilChanges(nombreUsuario, autoId, cambios) {
  await AsyncStorage.setItem(
    getOilChangesKey(nombreUsuario, autoId),
    JSON.stringify(cambios)
  );
}
