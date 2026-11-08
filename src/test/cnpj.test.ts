import { describe, expect, it } from 'vitest';
import { formatCnpjInput, isValidCnpjFormat, normalizeCnpj } from '@/lib/cnpj';

describe('CNPJ alphanumeric support', () => {
  it('keeps existing numeric CNPJs compatible', () => {
    expect(normalizeCnpj('12.345.678/0001-90')).toBe('12345678000190');
    expect(isValidCnpjFormat('12345678000190')).toBe(true);
  });

  it('normalizes and accepts the 14-position alphanumeric format', () => {
    expect(normalizeCnpj('00.000.000/e08g-12')).toBe('00000000E08G12');
    expect(isValidCnpjFormat('00000000E08G12')).toBe(true);
  });

  it('requires numeric check digits in the final two positions', () => {
    expect(isValidCnpjFormat('00000000E08GAB')).toBe(false);
    expect(isValidCnpjFormat('00000000E08G1')).toBe(false);
  });

  it('formats numeric and alphanumeric input without discarding letters', () => {
    expect(formatCnpjInput('12345678000190')).toBe('12.345.678/0001-90');
    expect(formatCnpjInput('00000000e08g12')).toBe('00.000.000/E08G-12');
  });

  it('removes unsupported characters and caps input at 14 positions', () => {
    expect(normalizeCnpj('ab.cd!12_345678901234')).toBe('ABCD1234567890');
  });
});
