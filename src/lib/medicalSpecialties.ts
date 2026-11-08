/**
 * Especialidades Médicas oficiais reconhecidas pelo CFM (Conselho Federal de Medicina)
 * e AMB (Associação Médica Brasileira) - Resolução CFM nº 2.330/2023.
 */

export interface MedicalSpecialty {
  value: string;
  label: string;
  services: string[];
}

export const CFM_MEDICAL_SPECIALTIES: MedicalSpecialty[] = [
  {
    value: 'acupuntura',
    label: 'Acupuntura',
    services: ['Consulta de Acupuntura', 'Sessão de Acupuntura'],
  },
  {
    value: 'alergia_e_imunologia',
    label: 'Alergia e Imunologia',
    services: ['Consulta de Alergia e Imunologia', 'Retorno de Alergia e Imunologia'],
  },
  {
    value: 'anestesiologia',
    label: 'Anestesiologia',
    services: ['Consulta Pré-Anestésica', 'Avaliação Anestésica'],
  },
  {
    value: 'angiologia',
    label: 'Angiologia',
    services: ['Consulta Angiológica', 'Retorno Angiológico'],
  },
  {
    value: 'cardiologia',
    label: 'Cardiologia',
    services: ['Consulta Cardiológica', 'Retorno Cardiológico'],
  },
  {
    value: 'cirurgia_cardiovascular',
    label: 'Cirurgia Cardiovascular',
    services: ['Consulta em Cirurgia Cardiovascular', 'Retorno Cirurgia Cardiovascular'],
  },
  {
    value: 'cirurgia_da_mao',
    label: 'Cirurgia da Mão',
    services: ['Consulta em Cirurgia da Mão', 'Retorno Cirurgia da Mão'],
  },
  {
    value: 'cirurgia_de_cabeca_e_pescoco',
    label: 'Cirurgia de Cabeça e Pescoço',
    services: ['Consulta em Cirurgia de Cabeça e Pescoço', 'Retorno Cirurgia Cabeça e Pescoço'],
  },
  {
    value: 'cirurgia_do_aparelho_digestivo',
    label: 'Cirurgia do Aparelho Digestivo',
    services: ['Consulta em Cirurgia Digestiva', 'Retorno Cirurgia Digestiva'],
  },
  {
    value: 'cirurgia_geral',
    label: 'Cirurgia Geral',
    services: ['Consulta em Cirurgia Geral', 'Retorno Cirurgia Geral'],
  },
  {
    value: 'cirurgia_oncologica',
    label: 'Cirurgia Oncológica',
    services: ['Consulta em Cirurgia Oncológica', 'Retorno Cirurgia Oncológica'],
  },
  {
    value: 'cirurgia_pediatrica',
    label: 'Cirurgia Pediátrica',
    services: ['Consulta em Cirurgia Pediátrica', 'Retorno Cirurgia Pediátrica'],
  },
  {
    value: 'cirurgia_plastica',
    label: 'Cirurgia Plástica',
    services: ['Consulta em Cirurgia Plástica', 'Retorno Cirurgia Plástica'],
  },
  {
    value: 'cirurgia_toracica',
    label: 'Cirurgia Torácica',
    services: ['Consulta em Cirurgia Torácica', 'Retorno Cirurgia Torácica'],
  },
  {
    value: 'cirurgia_vascular',
    label: 'Cirurgia Vascular',
    services: ['Consulta em Cirurgia Vascular', 'Retorno Cirurgia Vascular'],
  },
  {
    value: 'clinica_medica',
    label: 'Clínica Médica',
    services: ['Consulta Clínica', 'Retorno Clínico'],
  },
  {
    value: 'coloproctologia',
    label: 'Coloproctologia',
    services: ['Consulta Coloproctológica', 'Retorno Coloproctológico'],
  },
  {
    value: 'dermatologia',
    label: 'Dermatologia',
    services: ['Consulta Dermatológica', 'Retorno Dermatológico'],
  },
  {
    value: 'endocrinologia_e_metabologia',
    label: 'Endocrinologia e Metabologia',
    services: ['Consulta Endocrinológica', 'Retorno Endocrinológico'],
  },
  {
    value: 'endoscopia',
    label: 'Endoscopia',
    services: ['Consulta para Endoscopia', 'Avaliação Endoscópica'],
  },
  {
    value: 'gastroenterologia',
    label: 'Gastroenterologia',
    services: ['Consulta Gastroenterológica', 'Retorno Gastroenterológico'],
  },
  {
    value: 'genetica_medica',
    label: 'Genética Médica',
    services: ['Consulta de Genética Médica', 'Aconselhamento Genético'],
  },
  {
    value: 'geriatria',
    label: 'Geriatria',
    services: ['Consulta Geriátrica', 'Retorno Geriátrico'],
  },
  {
    value: 'ginecologia_e_obstetricia',
    label: 'Ginecologia e Obstetrícia',
    services: ['Consulta Ginecológica', 'Consulta Pré-Natal', 'Retorno'],
  },
  {
    value: 'hematologia_e_hemoterapia',
    label: 'Hematologia e Hemoterapia',
    services: ['Consulta Hematológica', 'Retorno Hematológico'],
  },
  {
    value: 'homeopatia',
    label: 'Homeopatia',
    services: ['Consulta Homeopática', 'Retorno Homeopático'],
  },
  {
    value: 'infectologia',
    label: 'Infectologia',
    services: ['Consulta Infectológica', 'Retorno Infectológico'],
  },
  {
    value: 'mastologia',
    label: 'Mastologia',
    services: ['Consulta em Mastologia', 'Retorno Mastologia'],
  },
  {
    value: 'medicina_de_emergencia',
    label: 'Medicina de Emergência',
    services: ['Atendimento de Urgência', 'Avaliação Clínica de Emergência'],
  },
  {
    value: 'medicina_de_familia_e_comunidade',
    label: 'Medicina de Família e Comunidade',
    services: ['Consulta de Medicina de Família', 'Acompanhamento Familiar'],
  },
  {
    value: 'medicina_do_trabalho',
    label: 'Medicina do Trabalho',
    services: ['Exame Clínico Ocupacional', 'Consulta de Medicina do Trabalho'],
  },
  {
    value: 'medicina_do_trafego',
    label: 'Medicina do Tráfego',
    services: ['Exame de Aptidão Física e Mental', 'Perícia de Tráfego'],
  },
  {
    value: 'medicina_esportiva',
    label: 'Medicina Esportiva',
    services: ['Consulta em Medicina Esportiva', 'Avaliação Pré-Participação'],
  },
  {
    value: 'medicina_fisica_e_reabilitacao',
    label: 'Medicina Física e Reabilitação',
    services: ['Consulta Fisiátrica', 'Avaliação de Reabilitação'],
  },
  {
    value: 'medicina_intensiva',
    label: 'Medicina Intensiva',
    services: ['Avaliação em Terapia Intensiva', 'Acompanhamento Intensivo'],
  },
  {
    value: 'medicina_legal_e_pericia_medica',
    label: 'Medicina Legal e Perícia Médica',
    services: ['Perícia Médica', 'Parecer Médico Legal'],
  },
  {
    value: 'medicina_nuclear',
    label: 'Medicina Nuclear',
    services: ['Consulta em Medicina Nuclear', 'Avaliação Cintilográfica'],
  },
  {
    value: 'medicina_preventiva_e_social',
    label: 'Medicina Preventiva e Social',
    services: ['Consulta Preventiva', 'Check-up Geral'],
  },
  {
    value: 'nefrologia',
    label: 'Nefrologia',
    services: ['Consulta Nefrológica', 'Retorno Nefrológico'],
  },
  {
    value: 'neurocirurgia',
    label: 'Neurocirurgia',
    services: ['Consulta Neurocirúrgica', 'Retorno Neurocirúrgico'],
  },
  {
    value: 'neurologia',
    label: 'Neurologia',
    services: ['Consulta Neurológica', 'Retorno Neurológico'],
  },
  {
    value: 'nutrologia',
    label: 'Nutrologia',
    services: ['Consulta Nutrológica', 'Retorno Nutrológico'],
  },
  {
    value: 'oftalmologia',
    label: 'Oftalmologia',
    services: ['Consulta Oftalmológica', 'Exame de Refração', 'Retorno'],
  },
  {
    value: 'oncologia_clinica',
    label: 'Oncologia Clínica',
    services: ['Consulta Oncológica', 'Retorno Oncológico'],
  },
  {
    value: 'ortopedia',
    label: 'Ortopedia e Traumatologia',
    services: ['Consulta Ortopédica', 'Retorno Ortopédico'],
  },
  {
    value: 'otorrinolaringologia',
    label: 'Otorrinolaringologia',
    services: ['Consulta Otorrinolaringológica', 'Retorno Otorrinolaringológico'],
  },
  {
    value: 'patologia',
    label: 'Patologia',
    services: ['Exame Anatomopatológico', 'Consulta em Patologia'],
  },
  {
    value: 'patologia_clinica_medicina_laboratorial',
    label: 'Patologia Clínica / Medicina Laboratorial',
    services: ['Consulta Laboratorial', 'Avaliação de Exames'],
  },
  {
    value: 'pediatria',
    label: 'Pediatria',
    services: ['Consulta Pediátrica', 'Retorno Pediátrico', 'Puericultura'],
  },
  {
    value: 'pneumologia',
    label: 'Pneumologia',
    services: ['Consulta Pneumológica', 'Retorno Pneumológico'],
  },
  {
    value: 'psiquiatria',
    label: 'Psiquiatria',
    services: ['Consulta Psiquiátrica', 'Retorno Psiquiátrico'],
  },
  {
    value: 'radiologia_e_diagnostico_por_imagem',
    label: 'Radiologia e Diagnóstico por Imagem',
    services: ['Consulta Radiológica', 'Laudo e Interpretação de Imagem'],
  },
  {
    value: 'radioterapia',
    label: 'Radioterapia',
    services: ['Consulta em Radioterapia', 'Planejamento Radioterápico'],
  },
  {
    value: 'reumatologia',
    label: 'Reumatologia',
    services: ['Consulta Reumatológica', 'Retorno Reumatológico'],
  },
  {
    value: 'urologia',
    label: 'Urologia',
    services: ['Consulta Urológica', 'Retorno Urológico'],
  },
];

/**
 * Mapeamento indexado por chave para acesso rápido O(1).
 */
export const CFM_SPECIALTIES_MAP: Record<string, MedicalSpecialty> = CFM_MEDICAL_SPECIALTIES.reduce(
  (acc, item) => {
    acc[item.value] = item;
    return acc;
  },
  {} as Record<string, MedicalSpecialty>
);

// Aliases para retrocompatibilidade
if (CFM_SPECIALTIES_MAP['ortopedia']) {
  CFM_SPECIALTIES_MAP['ortopedia_e_traumatologia'] = CFM_SPECIALTIES_MAP['ortopedia'];
}
