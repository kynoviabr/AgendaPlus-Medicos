/**
 * Especialidades Médicas oficiais reconhecidas pelo CFM (Conselho Federal de Medicina)
 * e AMB (Associação Médica Brasileira) - Resolução CFM nº 2.330/2023.
 */

export interface SpecialtyConfig {
  label: string;
  services: string[];
}

export const CFM_SPECIALTIES_CATALOG: Record<string, SpecialtyConfig> = {
  acupuntura: {
    label: "Acupuntura",
    services: ["Consulta de Acupuntura", "Sessão de Acupuntura"],
  },
  alergia_e_imunologia: {
    label: "Alergia e Imunologia",
    services: ["Consulta de Alergia e Imunologia", "Retorno de Alergia e Imunologia"],
  },
  anestesiologia: {
    label: "Anestesiologia",
    services: ["Consulta Pré-Anestésica", "Avaliação Anestésica"],
  },
  angiologia: {
    label: "Angiologia",
    services: ["Consulta Angiológica", "Retorno Angiológico"],
  },
  cardiologia: {
    label: "Cardiologia",
    services: ["Consulta Cardiológica", "Retorno Cardiológico"],
  },
  cirurgia_cardiovascular: {
    label: "Cirurgia Cardiovascular",
    services: ["Consulta em Cirurgia Cardiovascular", "Retorno Cirurgia Cardiovascular"],
  },
  cirurgia_da_mao: {
    label: "Cirurgia da Mão",
    services: ["Consulta em Cirurgia da Mão", "Retorno Cirurgia da Mão"],
  },
  cirurgia_de_cabeca_e_pescoco: {
    label: "Cirurgia de Cabeça e Pescoço",
    services: ["Consulta em Cirurgia de Cabeça e Pescoço", "Retorno Cirurgia Cabeça e Pescoço"],
  },
  cirurgia_do_aparelho_digestivo: {
    label: "Cirurgia do Aparelho Digestivo",
    services: ["Consulta em Cirurgia Digestiva", "Retorno Cirurgia Digestiva"],
  },
  cirurgia_geral: {
    label: "Cirurgia Geral",
    services: ["Consulta em Cirurgia Geral", "Retorno Cirurgia Geral"],
  },
  cirurgia_oncologica: {
    label: "Cirurgia Oncológica",
    services: ["Consulta em Cirurgia Oncológica", "Retorno Cirurgia Oncológica"],
  },
  cirurgia_pediatrica: {
    label: "Cirurgia Pediátrica",
    services: ["Consulta em Cirurgia Pediátrica", "Retorno Cirurgia Pediátrica"],
  },
  cirurgia_plastica: {
    label: "Cirurgia Plástica",
    services: ["Consulta em Cirurgia Plástica", "Retorno Cirurgia Plástica"],
  },
  cirurgia_toracica: {
    label: "Cirurgia Torácica",
    services: ["Consulta em Cirurgia Torácica", "Retorno Cirurgia Torácica"],
  },
  cirurgia_vascular: {
    label: "Cirurgia Vascular",
    services: ["Consulta em Cirurgia Vascular", "Retorno Cirurgia Vascular"],
  },
  clinica_medica: {
    label: "Clínica Médica",
    services: ["Consulta Clínica", "Retorno Clínico"],
  },
  coloproctologia: {
    label: "Coloproctologia",
    services: ["Consulta Coloproctológica", "Retorno Coloproctológico"],
  },
  dermatologia: {
    label: "Dermatologia",
    services: ["Consulta Dermatológica", "Retorno Dermatológico"],
  },
  endocrinologia_e_metabologia: {
    label: "Endocrinologia e Metabologia",
    services: ["Consulta Endocrinológica", "Retorno Endocrinológico"],
  },
  endoscopia: {
    label: "Endoscopia",
    services: ["Consulta para Endoscopia", "Avaliação Endoscópica"],
  },
  gastroenterologia: {
    label: "Gastroenterologia",
    services: ["Consulta Gastroenterológica", "Retorno Gastroenterológico"],
  },
  genetica_medica: {
    label: "Genética Médica",
    services: ["Consulta de Genética Médica", "Aconselhamento Genético"],
  },
  geriatria: {
    label: "Geriatria",
    services: ["Consulta Geriátrica", "Retorno Geriátrico"],
  },
  ginecologia_e_obstetricia: {
    label: "Ginecologia e Obstetrícia",
    services: ["Consulta Ginecológica", "Consulta Pré-Natal", "Retorno"],
  },
  hematologia_e_hemoterapia: {
    label: "Hematologia e Hemoterapia",
    services: ["Consulta Hematológica", "Retorno Hematológico"],
  },
  homeopatia: {
    label: "Homeopatia",
    services: ["Consulta Homeopática", "Retorno Homeopático"],
  },
  infectologia: {
    label: "Infectologia",
    services: ["Consulta Infectológica", "Retorno Infectológico"],
  },
  mastologia: {
    label: "Mastologia",
    services: ["Consulta em Mastologia", "Retorno Mastologia"],
  },
  medicina_de_emergencia: {
    label: "Medicina de Emergência",
    services: ["Atendimento de Urgência", "Avaliação Clínica de Emergência"],
  },
  medicina_de_familia_e_comunidade: {
    label: "Medicina de Família e Comunidade",
    services: ["Consulta de Medicina de Família", "Acompanhamento Familiar"],
  },
  medicina_do_trabalho: {
    label: "Medicina do Trabalho",
    services: ["Exame Clínico Ocupacional", "Consulta de Medicina do Trabalho"],
  },
  medicina_do_trafego: {
    label: "Medicina do Tráfego",
    services: ["Exame de Aptidão Física e Mental", "Perícia de Tráfego"],
  },
  medicina_esportiva: {
    label: "Medicina Esportiva",
    services: ["Consulta em Medicina Esportiva", "Avaliação Pré-Participação"],
  },
  medicina_fisica_e_reabilitacao: {
    label: "Medicina Física e Reabilitação",
    services: ["Consulta Fisiátrica", "Avaliação de Reabilitação"],
  },
  medicina_intensiva: {
    label: "Medicina Intensiva",
    services: ["Avaliação em Terapia Intensiva", "Acompanhamento Intensivo"],
  },
  medicina_legal_e_pericia_medica: {
    label: "Medicina Legal e Perícia Médica",
    services: ["Perícia Médica", "Parecer Médico Legal"],
  },
  medicina_nuclear: {
    label: "Medicina Nuclear",
    services: ["Consulta em Medicina Nuclear", "Avaliação Cintilográfica"],
  },
  medicina_preventiva_e_social: {
    label: "Medicina Preventiva e Social",
    services: ["Consulta Preventiva", "Check-up Geral"],
  },
  nefrologia: {
    label: "Nefrologia",
    services: ["Consulta Nefrológica", "Retorno Nefrológico"],
  },
  neurocirurgia: {
    label: "Neurocirurgia",
    services: ["Consulta Neurocirúrgica", "Retorno Neurocirúrgico"],
  },
  neurologia: {
    label: "Neurologia",
    services: ["Consulta Neurológica", "Retorno Neurológico"],
  },
  nutrologia: {
    label: "Nutrologia",
    services: ["Consulta Nutrológica", "Retorno Nutrológico"],
  },
  oftalmologia: {
    label: "Oftalmologia",
    services: ["Consulta Oftalmológica", "Exame de Refração", "Retorno"],
  },
  oncologia_clinica: {
    label: "Oncologia Clínica",
    services: ["Consulta Oncológica", "Retorno Oncológico"],
  },
  ortopedia: {
    label: "Ortopedia e Traumatologia",
    services: ["Consulta Ortopédica", "Retorno Ortopédico"],
  },
  ortopedia_e_traumatologia: {
    label: "Ortopedia e Traumatologia",
    services: ["Consulta Ortopédica", "Retorno Ortopédico"],
  },
  otorrinolaringologia: {
    label: "Otorrinolaringologia",
    services: ["Consulta Otorrinolaringológica", "Retorno Otorrinolaringológico"],
  },
  patologia: {
    label: "Patologia",
    services: ["Exame Anatomopatológico", "Consulta em Patologia"],
  },
  patologia_clinica_medicina_laboratorial: {
    label: "Patologia Clínica / Medicina Laboratorial",
    services: ["Consulta Laboratorial", "Avaliação de Exames"],
  },
  pediatria: {
    label: "Pediatria",
    services: ["Consulta Pediátrica", "Retorno Pediátrico", "Puericultura"],
  },
  pneumologia: {
    label: "Pneumologia",
    services: ["Consulta Pneumológica", "Retorno Pneumológico"],
  },
  psiquiatria: {
    label: "Psiquiatria",
    services: ["Consulta Psiquiátrica", "Retorno Psiquiátrico"],
  },
  radiologia_e_diagnostico_por_imagem: {
    label: "Radiologia e Diagnóstico por Imagem",
    services: ["Consulta Radiológica", "Laudo e Interpretação de Imagem"],
  },
  radioterapia: {
    label: "Radioterapia",
    services: ["Consulta em Radioterapia", "Planejamento Radioterápico"],
  },
  reumatologia: {
    label: "Reumatologia",
    services: ["Consulta Reumatológica", "Retorno Reumatológico"],
  },
  urologia: {
    label: "Urologia",
    services: ["Consulta Urológica", "Retorno Urológico"],
  },
};
