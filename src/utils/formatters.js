export function formatNumber(value) {
  return Number(value).toLocaleString('es-CL');
}

export function formatCurrency(value) {
  return `$${formatNumber(Math.round(Number(value)))}`;
}

export function formatLiters(value) {
  return Number(value).toLocaleString('es-CL', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}

export function parseIntegerInput(value) {
  const normalizedValue = String(value)
    .trim()
    .replace(/\$/g, '')
    .replace(/\s/g, '')
    .replace(/[.,]/g, '');

  return Number(normalizedValue);
}

export function formatIntegerInput(value) {
  const digits = String(value).replace(/\D/g, '');

  if (!digits) {
    return '';
  }

  return Number(digits).toLocaleString('es-CL');
}

export function parseLitersInput(value) {
  const cleanValue = String(value)
    .trim()
    .replace(/\s/g, '');

  if (cleanValue.includes(',')) {
    return Number(cleanValue.replace(/\./g, '').replace(',', '.'));
  }

  if (cleanValue.includes('.')) {
    return Number(cleanValue);
  }

  if (/^\d{4,5}$/.test(cleanValue)) {
    const wholePart = cleanValue.slice(0, -3);
    const decimalPart = cleanValue.slice(-3);
    return Number(`${wholePart}.${decimalPart}`);
  }

  return Number(cleanValue);
}

export function formatLitersInput(value) {
  const digits = String(value).replace(/\D/g, '');

  if (!digits) {
    return '';
  }

  if (digits.length <= 3) {
    return digits;
  }

  return `${Number(digits.slice(0, -3)).toLocaleString('es-CL')},${digits.slice(-3)}`;
}

export function formatShortDate(value) {
  return new Date(value).toLocaleDateString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
}

export function formatDayMonth(value) {
  return new Date(value).toLocaleDateString('es-CL', {
    day: '2-digit',
    month: '2-digit',
  });
}

export function formatYear(value) {
  return new Date(value).getFullYear().toString();
}
