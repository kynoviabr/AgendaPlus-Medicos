import { serve } from "../_shared/serve.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { isValidCnpjFormat, normalizeCnpj } from "../../../src/lib/cnpj.ts";
import { CFM_SPECIALTIES_CATALOG } from "../_shared/medical-specialties.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get the user's JWT from the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create a client with the user's JWT to verify identity
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse request body
    const { clinicName, legalName, cnpj, phone, email, selectedSpecialties } = await req.json();

    if (!clinicName || clinicName.trim().length < 2) {
      return new Response(JSON.stringify({ error: "Nome da clínica é obrigatório (mín. 2 caracteres)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const cleanCnpj = normalizeCnpj(cnpj);
    if (cleanCnpj && !isValidCnpjFormat(cleanCnpj)) {
      return new Response(JSON.stringify({ error: "CNPJ deve ter 14 caracteres: letras ou números nas 12 primeiras posições e números nas 2 finais" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const specialtyCatalog = CFM_SPECIALTIES_CATALOG;
    const specialtyKeys = Array.isArray(selectedSpecialties)
      ? [...new Set(selectedSpecialties)].filter((key): key is string => typeof key === "string" && key in specialtyCatalog)
      : [];
    if (!specialtyKeys.length) {
      return new Response(JSON.stringify({ error: "Selecione ao menos uma especialidade" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use service role client to bypass RLS
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user already has a role (prevent duplicate onboarding)
    const { data: existingRole } = await adminClient
      .from("user_roles")
      .select("id")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    if (existingRole) {
      return new Response(JSON.stringify({ error: "Usuário já possui uma clínica" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate slug from clinic name
    const slug = clinicName
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      + "-" + Date.now().toString(36);

    // Create the clinic
    const { data: clinic, error: clinicError } = await adminClient
      .from("clinics")
      .insert({
        name: clinicName.trim(),
        slug,
        legal_name: String(legalName || "").trim() || null,
        cnpj: cleanCnpj || null,
        phone: phone?.trim() || null,
        email: email?.trim() || null,
      })
      .select("id")
      .single();

    if (clinicError) {
      return new Response(JSON.stringify({ error: clinicError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Assign admin role to the user
    const { error: roleError } = await adminClient
      .from("user_roles")
      .insert({
        user_id: user.id,
        clinic_id: clinic.id,
        role: "admin",
        is_active: true,
      });

    if (roleError) {
      // Rollback: delete the clinic
      await adminClient.from("clinics").delete().eq("id", clinic.id);
      return new Response(JSON.stringify({ error: roleError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Every new clinic starts with the minimum professional catalog required
    // by the setup flow. It is tenant-scoped and can be edited or removed by
    // the clinic later; this prevents a first professional from being blocked
    // by empty Cargo/Conselho selectors.
    const [setupResult, rolesResult, entitiesResult] = await Promise.all([
      adminClient.from("clinic_setup_profiles").upsert({
        clinic_id: clinic.id,
        selected_specialties: specialtyKeys.map((key) => specialtyCatalog[key].label),
        status: "complete",
        catalog_applied_at: new Date().toISOString(),
      }, { onConflict: "clinic_id" }),
      adminClient.from("roles").upsert([
        { clinic_id: clinic.id, name: "Médico(a)", description: "Profissional médico" },
        { clinic_id: clinic.id, name: "Enfermeiro(a)", description: "Profissional de enfermagem" },
        { clinic_id: clinic.id, name: "Técnico(a) de enfermagem", description: "Técnico de enfermagem" },
        { clinic_id: clinic.id, name: "Recepcionista", description: "Atendimento e recepção" },
      ], { onConflict: "clinic_id,name", ignoreDuplicates: true }),
      adminClient.from("class_entities").upsert([
        { clinic_id: clinic.id, name: "Conselho Regional de Medicina", abbreviation: "CRM", description: "Conselho profissional regional da medicina." },
        { clinic_id: clinic.id, name: "Conselho Regional de Enfermagem", abbreviation: "COREN", description: "Conselho profissional regional da enfermagem." },
      ], { onConflict: "clinic_id,abbreviation", ignoreDuplicates: true }),
    ]);

    const catalogError = setupResult.error || rolesResult.error || entitiesResult.error;
    if (catalogError) {
      return new Response(JSON.stringify({ error: `Clínica criada, mas não foi possível preparar o catálogo inicial: ${catalogError.message}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const treatmentRows = specialtyKeys.flatMap((key) => specialtyCatalog[key].services)
      .map((name) => ({ clinic_id: clinic.id, name, duration_minutes: 60, price: 0, is_active: true }));
    const { error: treatmentsError } = await adminClient.from("treatments").insert(treatmentRows);
    if (treatmentsError) {
      await adminClient.from("clinics").delete().eq("id", clinic.id);
      return new Response(JSON.stringify({ error: `Não foi possível preparar os serviços iniciais: ${treatmentsError.message}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ clinicId: clinic.id, slug, message: "Clínica criada com sucesso!" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
