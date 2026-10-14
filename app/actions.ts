"use server";

import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { cities, getAccount, inviteCookie, requireProfile } from "@/lib/account";
import { findPlan } from "@/lib/data";
import { accountsEnabled, createClient } from "@/lib/supabase";

function normalizeCode(value: FormDataEntryValue | null) {
  return String(value ?? "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12);
}

export async function signIn(formData: FormData) {
  if (!accountsEnabled) redirect("/entrar");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) redirect("/entrar?error=correo");

  const code = normalizeCode(formData.get("codigo"));
  if (code) (await cookies()).set(inviteCookie, code, { httpOnly: true, sameSite: "lax", secure: true, maxAge: 60 * 60 * 24 * 7 });

  const h = await headers();
  const origin = h.get("origin") ?? `https://${h.get("host")}`;
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${origin}/auth/callback` } });
  if (error) {
    console.error("Error al enviar el enlace:", error.message);
    redirect(error.status === 429 ? "/entrar?error=limite" : "/entrar?error=envio");
  }
  redirect("/entrar?enviado=1");
}

export async function saveProfile(formData: FormData) {
  const account = await getAccount();
  if (!account) redirect("/entrar");
  const { supabase, user, profile } = account;

  const name = String(formData.get("nombre") ?? "").trim().slice(0, 40);
  const city = String(formData.get("ciudad") ?? "");
  if (!name || !cities.includes(city)) redirect("/perfil?error=datos");

  if (profile) {
    await supabase.from("profiles").update({ name, city }).eq("id", user.id);
    revalidatePath("/", "layout");
    redirect("/perfil?guardado=1");
  }

  if (formData.get("mayor") !== "on") redirect("/perfil?error=edad");

  let invitedBy: string | null = null;
  const code = normalizeCode(formData.get("codigo"));
  if (code) {
    const { data } = await supabase.from("profiles").select("id").eq("invite_code", code).maybeSingle();
    if (!data) redirect("/perfil?error=codigo");
    invitedBy = data.id;
  }

  const { error } = await supabase.from("profiles").insert({ id: user.id, name, city, is_adult: true, invited_by: invitedBy });
  if (error) {
    console.error("Error al crear el perfil:", error.message);
    redirect("/perfil?error=guardar");
  }
  (await cookies()).delete(inviteCookie);
  revalidatePath("/", "layout");
  redirect("/");
}

export async function joinPlan(planId: string) {
  const plan = findPlan(planId);
  if (!plan) redirect("/");
  const { supabase, user } = await requireProfile();
  const { count } = await supabase.from("plan_members").select("*", { count: "exact", head: true }).eq("plan_id", planId);
  if ((count ?? 0) >= plan.spots) redirect(`/planes/${planId}?error=lleno`);
  const { error } = await supabase.from("plan_members").insert({ plan_id: planId, user_id: user.id });
  // 23505: ya estaba en el plan; no es un error para la persona.
  if (error && error.code !== "23505") {
    console.error("Error al unirse:", error.message);
    redirect(`/planes/${planId}?error=unirse`);
  }
  revalidatePath(`/planes/${planId}`);
  revalidatePath("/mis-planes");
}

export async function leavePlan(planId: string) {
  const { supabase, user } = await requireProfile();
  await supabase.from("plan_members").delete().eq("plan_id", planId).eq("user_id", user.id);
  revalidatePath(`/planes/${planId}`);
  revalidatePath("/mis-planes");
}

export async function signOut() {
  if (accountsEnabled) await (await createClient()).auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
