import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = 'usuarios';
const CURRENT_USER_KEY = 'usuarioActual';

export async function getCurrentUser() {
  return AsyncStorage.getItem(CURRENT_USER_KEY);
}

export async function setCurrentUser(usuario) {
  await AsyncStorage.setItem(CURRENT_USER_KEY, usuario);
}

export async function removeCurrentUser() {
  await AsyncStorage.removeItem(CURRENT_USER_KEY);
}

export async function getUsers() {
  const usuariosGuardados = await AsyncStorage.getItem(USERS_KEY);
  return usuariosGuardados ? JSON.parse(usuariosGuardados) : [];
}

export async function saveUsers(listaUsuarios) {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(listaUsuarios));
}

export async function clearAllLocalData() {
  await AsyncStorage.clear();
}
