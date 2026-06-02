export const FULL_CHARGE = 'Carga completa';
export const PARTIAL_CHARGE = 'Carga parcial';

export function calculateFuelConsumption(registros, tipoCarga, kilometraje, litros) {
  const ultimoRegistro = registros[0];

  let consumoCalculado = null;
  let mensajeCalculo = 'No se calcula consumo para este registro.';

  if (
    ultimoRegistro &&
    ultimoRegistro.tipoCarga === FULL_CHARGE &&
    tipoCarga === FULL_CHARGE
  ) {
    const kmRecorridos = kilometraje - ultimoRegistro.kilometraje;

    if (kmRecorridos > 0) {
      consumoCalculado = kmRecorridos / litros;
      mensajeCalculo = `Consumo calculado: ${consumoCalculado.toFixed(2)} km/L`;
    } else {
      mensajeCalculo =
        'No se pudo calcular: el kilometraje debe ser mayor al registro anterior.';
    }
  }

  if (
    ultimoRegistro &&
    ultimoRegistro.tipoCarga !== FULL_CHARGE &&
    tipoCarga === FULL_CHARGE
  ) {
    mensajeCalculo = 'No se calculo consumo porque la carga anterior no fue completa.';
  }

  if (tipoCarga === PARTIAL_CHARGE) {
    mensajeCalculo =
      'Carga parcial registrada. No se calcula consumo en cargas parciales.';
  }

  return {
    consumo: consumoCalculado,
    mensaje: mensajeCalculo,
  };
}
