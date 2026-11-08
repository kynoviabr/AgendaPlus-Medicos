export const CNPJ_MAX_LENGTH = 14;

export function normalizeCnpj(value: unknown) {
  return String(value ?? '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, CNPJ_MAX_LENGTH);
}

export function isValidCnpjFormat(value: string) {
  return /^[A-Z0-9]{12}[0-9]{2}$/.test(value);
}

export function formatCnpjInput(value: unknown) {
  const cnpj = normalizeCnpj(value);
  if (cnpj.length <= 2) return cnpj;

  let formatted = `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}`;
  if (cnpj.length > 5) formatted += `.${cnpj.slice(5, 8)}`;
  if (cnpj.length > 8) formatted += `/${cnpj.slice(8, 12)}`;
  if (cnpj.length > 12) formatted += `-${cnpj.slice(12, 14)}`;
  return formatted;
}
