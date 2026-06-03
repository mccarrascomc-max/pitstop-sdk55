import AsyncStorage from '@react-native-async-storage/async-storage';

function getCarsKey(nombreUsuario) {
  return `autos_${nombreUsuario}`;
}

function getSelectedCarKey(nombreUsuario) {
  return `auto_actual_${nombreUsuario}`;
}

export async function getCars(nombreUsuario) {
  const autosGuardados = await AsyncStorage.getItem(getCarsKey(nombreUsuario));
  return autosGuardados ? JSON.parse(autosGuardados) : [];
}

export async function saveCars(nombreUsuario, autos) {
  await AsyncStorage.setItem(getCarsKey(nombreUsuario), JSON.stringify(autos));
}

export async function getSelectedCarId(nombreUsuario) {
  return AsyncStorage.getItem(getSelectedCarKey(nombreUsuario));
}

export async function setSelectedCarId(nombreUsuario, autoId) {
  await AsyncStorage.setItem(getSelectedCarKey(nombreUsuario), autoId);
}
