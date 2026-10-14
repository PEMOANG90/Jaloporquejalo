import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { accountsEnabled, supabaseConfig } from "@/lib/supabaseConfig";

// Renueva la sesión de Supabase en cada visita para que no caduque mientras se usa la app.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  if (!accountsEnabled) return response;

  const supabase = createServerClient(supabaseConfig.url, supabaseConfig.key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(list) {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|icon.svg|manifest.webmanifest|api/).*)"],
};
