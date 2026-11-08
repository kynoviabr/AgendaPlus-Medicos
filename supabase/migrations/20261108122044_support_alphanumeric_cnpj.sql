ALTER TABLE public.clinics
  DROP CONSTRAINT IF EXISTS clinics_cnpj_format;

ALTER TABLE public.clinics
  ADD CONSTRAINT clinics_cnpj_format
  CHECK (cnpj IS NULL OR cnpj ~ '^[A-Z0-9]{12}[0-9]{2}$');

COMMENT ON COLUMN public.clinics.cnpj IS
  'Normalized 14-position Brazilian CNPJ. The first 12 positions accept A-Z or 0-9; the final two positions are numeric check digits.';
