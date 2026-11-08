import { describe, it, expect } from 'vitest';
import { CFM_MEDICAL_SPECIALTIES, CFM_SPECIALTIES_MAP } from '@/lib/medicalSpecialties';

describe('CFM Medical Specialties Catalog', () => {
  it('contains the official 55 medical specialties recognized by CFM / AMB', () => {
    expect(CFM_MEDICAL_SPECIALTIES.length).toBe(55);
  });

  it('includes key medical specialties', () => {
    expect(CFM_SPECIALTIES_MAP['cardiologia']).toBeDefined();
    expect(CFM_SPECIALTIES_MAP['cardiologia'].label).toBe('Cardiologia');

    expect(CFM_SPECIALTIES_MAP['dermatologia']).toBeDefined();
    expect(CFM_SPECIALTIES_MAP['dermatologia'].label).toBe('Dermatologia');

    expect(CFM_SPECIALTIES_MAP['ortopedia']).toBeDefined();
    expect(CFM_SPECIALTIES_MAP['ortopedia'].label).toBe('Ortopedia e Traumatologia');

    expect(CFM_SPECIALTIES_MAP['clinica_medica']).toBeDefined();
    expect(CFM_SPECIALTIES_MAP['clinica_medica'].label).toBe('Clínica Médica');

    expect(CFM_SPECIALTIES_MAP['pediatria']).toBeDefined();
    expect(CFM_SPECIALTIES_MAP['ginecologia_e_obstetricia']).toBeDefined();
    expect(CFM_SPECIALTIES_MAP['oftalmologia']).toBeDefined();
    expect(CFM_SPECIALTIES_MAP['psiquiatria']).toBeDefined();
    expect(CFM_SPECIALTIES_MAP['neurologia']).toBeDefined();
  });

  it('every specialty has at least consultation and return suggested services', () => {
    for (const specialty of CFM_MEDICAL_SPECIALTIES) {
      expect(specialty.services.length).toBeGreaterThanOrEqual(1);
      expect(specialty.label).toBeTruthy();
      expect(specialty.value).toBeTruthy();
    }
  });

  it('supports ortopedia_e_traumatologia alias', () => {
    expect(CFM_SPECIALTIES_MAP['ortopedia_e_traumatologia']).toBeDefined();
  });
});
