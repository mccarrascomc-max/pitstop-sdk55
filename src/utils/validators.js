export function validateCredentials(usuario, contrasena) {
  if (!usuario || !contrasena) {
    return 'Ingresa usuario y contrasena.';
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

  const kmNumero = Number(kilometraje);
  const litrosNumero = Number(litros);
  const precioNumero = Number(precio);

  if (isNaN(kmNumero) || isNaN(litrosNumero) || isNaN(precioNumero)) {
    return {
      title: 'Datos invalidos',
      message: 'Kilometraje, litros y precio deben ser numeros.',
    };
  }

  if (kmNumero <= 0 || litrosNumero <= 0 || precioNumero <= 0) {
    return {
      title: 'Datos invalidos',
      message: 'Los valores deben ser mayores a cero.',
    };
  }

  return null;
}
