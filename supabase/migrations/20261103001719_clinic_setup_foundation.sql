-- Foundation for the guided clinic setup. The profile is tenant-scoped and
-- intentionally stores only setup metadata; operational catalogs stay in
-- their existing source-of-truth tables.

ALTER TABLE public.clinics
  ADD COLUMN IF NOT EXISTS legal_name text,
  ADD COLUMN IF NOT EXISTS cnpj text;

ALTER TABLE public.clinics
  DROP CONSTRAINT IF EXISTS clinics_cnpj_format;

ALTER TABLE public.clinics
  ADD CONSTRAINT clinics_cnpj_format
  CHECK (cnpj IS NULL OR cnpj ~ '^[0-9]{14}$');

CREATE TABLE IF NOT EXISTS public.clinic_setup_profiles (
  clinic_id uuid PRIMARY KEY REFERENCES public.clinics(id) ON DELETE CASCADE,
  selected_specialties text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'complete')),
  catalog_applied_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.clinic_setup_profiles ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON TABLE public.clinic_setup_profiles TO authenticated;

CREATE POLICY "Admin reads clinic setup profile"
  ON public.clinic_setup_profiles
  FOR SELECT TO authenticated
  USING (public.has_clinic_role((select auth.uid()), clinic_id, 'admin'::public.app_role));

CREATE POLICY "Admin creates clinic setup profile"
  ON public.clinic_setup_profiles
  FOR INSERT TO authenticated
  WITH CHECK (public.has_clinic_role((select auth.uid()), clinic_id, 'admin'::public.app_role));

CREATE POLICY "Admin updates clinic setup profile"
  ON public.clinic_setup_profiles
  FOR UPDATE TO authenticated
  USING (public.has_clinic_role((select auth.uid()), clinic_id, 'admin'::public.app_role))
  WITH CHECK (public.has_clinic_role((select auth.uid()), clinic_id, 'admin'::public.app_role));
