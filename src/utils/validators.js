import { parseIntegerInput, parseLitersInput } from './formatters';

export function validateCredentials(usuario, contrasena) {
  if (!usuario || !contrasena) {
    return 'Ingresa usuario y contraseña.';
  }

  return null;
}

export function validateFuelForm(kilometraje, litros, precio, tipoCarga) {
  if (!kilometraje || !litros || !precio || !tipoCarga) {
    return {
      title: 'Faltan datos',
      message: 'Completa todos los campos.',
    };
  }

  const kmNumero = parseIntegerInput(kilometraje);
  const litrosNumero = parseLitersInput(litros);
  const precioNumero = parseIntegerInput(precio);

  if (isNaN(kmNumero) || isNaN(litrosNumero) || isNaN(precioNumero)) {
    return {
      title: 'Datos inválidos',
      message: 'Kilometraje, litros y precio deben ser números.',
    };
  }

  if (kmNumero <= 0 || litrosNumero <= 0 || precioNumero <= 0) {
    return {
      title: 'Datos inválidos',
      message: 'Los valores deben ser mayores a cero.',
    };
  }

  return null;
}
