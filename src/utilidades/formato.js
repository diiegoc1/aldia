export function pesos(valor) {
  const n = Number(valor);
  if (!Number.isFinite(n)) return '$ 0';
  const esEntero = Number.isInteger(n);
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: esEntero ? 0 : 2,
    maximumFractionDigits: esEntero ? 0 : 2,
  }).format(n).replace(/\u00A0/g, ' ');
}
