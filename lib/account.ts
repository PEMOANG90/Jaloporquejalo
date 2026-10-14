import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { findPlan } from "./data";
import { accountsEnabled, createClient } from "./supabase";

export type Profile = { id: string; name: string; city: string; invite_code: string };

export const cities = ["CDMX", "Guadalajara"];

export const inviteCookie = "jalo_codigo";

// Código de invitación con el que llegó la persona, guardado al pedir su enlace.
export async function pendingInviteCode() {
  return (await cookies()).get(inviteCookie)?.value ?? "";
}

// Sesión y perfil de quien visita. null si las cuentas no están conectadas o no ha entrado.
export async function getAccount() {
  if (!accountsEnabled) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("profiles").select("id, name, city, invite_code").eq("id", user.id).maybeSingle();
  return { supabase, user, profile: data as Profile | null };
}

// Para acciones que requieren cuenta con perfil completo.
export async function requireProfile() {
  const account = await getAccount();
  if (!account) redirect("/entrar");
  if (!account.profile) redirect("/perfil");
  return { ...account, profile: account.profile };
}

// Nombres de quién va a un plan: reales con cuentas conectadas, de ejemplo sin ellas.
// Un nombre vacío es alguien que va, pero cuyo nombre no puede ver quien no ha entrado.
export async function getGoing(planId: string) {
  const plan = findPlan(planId);
  if (!accountsEnabled) return { names: plan?.going ?? [], userIds: [] as string[] };
  const supabase = await createClient();
  const { data: members } = await supabase.from("plan_members").select("user_id").eq("plan_id", planId).order("created_at");
  const userIds = (members ?? []).map((row: { user_id: string }) => row.user_id);
  // Quien no ha entrado no puede leer perfiles: ve cuántos van, pero no sus nombres.
  const { data: profiles } = userIds.length
    ? await supabase.from("profiles").select("id, name").in("id", userIds)
    : { data: [] };
  const names = new Map((profiles ?? []).map((row: { id: string; name: string }) => [row.id, row.name]));
  return { names: userIds.map((id) => names.get(id) ?? ""), userIds };
}
