// Nombres que pone la integración de Supabase en Vercel. Sin ellas, la app funciona en modo demo.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const key =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.SUPABASE_ANON_KEY;

export const accountsEnabled = Boolean(url && key);

export const supabaseConfig = { url: url ?? "", key: key ?? "" };
