import { serve } from "../_shared/serve.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { isValidCnpjFormat, normalizeCnpj } from "../../../src/lib/cnpj.ts";
import { CFM_SPECIALTIES_CATALOG } from "../_shared/medical-specialties.ts";

const corsHeaders = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };

const specialties = CFM_SPECIALTIES_CATALOG;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const authorization = req.headers.get("Authorization");
    if (!authorization) throw new Error("Autenticação necessária");
    const url = Deno.env.get("SUPABASE_URL")!;
    const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
    const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const userClient = createClient(url, anon, { global: { headers: { Authorization: authorization } } });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) throw new Error("Sessão inválida");
    const { clinicId, legalName, cnpj, selectedSpecialties } = await req.json();
    if (!clinicId || !Array.isArray(selectedSpecialties)) throw new Error("Dados de setup inválidos");
    const selected = [...new Set(selectedSpecialties)].filter((key) => key in specialties);
    const cleanCnpj = normalizeCnpj(cnpj);
    if (cleanCnpj && !isValidCnpjFormat(cleanCnpj)) {
      throw new Error("CNPJ deve ter 14 caracteres: letras ou números nas 12 primeiras posições e números nas 2 finais");
    }
    const admin = createClient(url, service);
    const { data: membership } = await admin.from("user_roles").select("id").eq("user_id", user.id).eq("clinic_id", clinicId).eq("role", "admin").eq("is_active", true).maybeSingle();
    if (!membership) return new Response(JSON.stringify({ error: "Sem permissão para configurar esta clínica" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const { error: clinicError } = await admin.from("clinics").update({ legal_name: String(legalName || "").trim() || null, cnpj: cleanCnpj || null }).eq("id", clinicId);
    if (clinicError) throw clinicError;
    const labels = selected.map((key) => specialties[key].label);
    const { error: profileError } = await admin.from("clinic_setup_profiles").upsert({ clinic_id: clinicId, selected_specialties: labels, status: "complete", catalog_applied_at: new Date().toISOString() }, { onConflict: "clinic_id" });
    if (profileError) throw profileError;
    const [rolesResult, entitiesResult] = await Promise.all([
      admin.from("roles").upsert([
        { clinic_id: clinicId, name: "Médico(a)", description: "Profissional médico" },
        { clinic_id: clinicId, name: "Enfermeiro(a)", description: "Profissional de enfermagem" },
        { clinic_id: clinicId, name: "Técnico(a) de enfermagem", description: "Técnico de enfermagem" },
        { clinic_id: clinicId, name: "Recepcionista", description: "Atendimento e recepção" },
      ], { onConflict: "clinic_id,name", ignoreDuplicates: true }),
      admin.from("class_entities").upsert([
        { clinic_id: clinicId, name: "Conselho Regional de Medicina", abbreviation: "CRM", description: "Conselho profissional regional da medicina." },
        { clinic_id: clinicId, name: "Conselho Regional de Enfermagem", abbreviation: "COREN", description: "Conselho profissional regional da enfermagem." },
      ], { onConflict: "clinic_id,abbreviation", ignoreDuplicates: true }),
    ]);
    if (rolesResult.error || entitiesResult.error) throw rolesResult.error || entitiesResult.error;
    const serviceNames = selected.flatMap((key) => specialties[key].services);
    const { data: existing } = await admin.from("treatments").select("name").eq("clinic_id", clinicId);
    const known = new Set((existing || []).map((row) => row.name));
    const missing = serviceNames.filter((name) => !known.has(name)).map((name) => ({ clinic_id: clinicId, name, duration_minutes: 60, price: 0, is_active: true }));
    if (missing.length) { const { error } = await admin.from("treatments").insert(missing); if (error) throw error; }
    return new Response(JSON.stringify({ selectedSpecialties: labels, createdTreatments: missing.length }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) { return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Erro ao configurar clínica" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }); }
});
