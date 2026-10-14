import Link from "next/link";
import { redirect } from "next/navigation";
import { signIn } from "@/app/actions";
import { getAccount } from "@/lib/account";
import { accountsEnabled } from "@/lib/supabase";

const errors: Record<string, string> = {
  correo: "Revisa tu correo, parece que tiene un error.",
  envio: "No pudimos mandarte el enlace. Intenta de nuevo en un momento.",
  limite: "Pediste muchos enlaces seguidos. Espera unos minutos e intenta de nuevo.",
  enlace: "Ese enlace ya no sirve o se abrió en otro navegador. Pide uno nuevo y ábrelo en este mismo navegador.",
};

export default async function SignInPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const { enviado, error, codigo } = await searchParams;

  if (!accountsEnabled) {
    return (
      <main className="app">
        <h1>Entrar a Jalo</h1>
        <p className="notice">Las cuentas aún no están conectadas. Mientras tanto puedes explorar los planes y hablar con Jalo.</p>
        <Link href="/" className="btn btn-primary">Ver planes</Link>
      </main>
    );
  }

  const account = await getAccount();
  if (account) redirect(account.profile ? "/" : "/perfil");

  return (
    <main className="app">
      <h1>Entrar a Jalo</h1>
      {enviado ? (
        <>
          <p className="notice">
            Te mandamos un enlace a tu correo. Ábrelo en este mismo navegador para entrar. Si no lo ves, revisa tu carpeta de spam.
          </p>
          <Link href="/entrar" className="btn btn-outline">Usar otro correo</Link>
        </>
      ) : (
        <>
          <p className="muted" style={{ margin: 0, fontSize: 15, lineHeight: 1.4 }}>
            Escribe tu correo y te mandamos un enlace para entrar, sin contraseña. Jalo es gratis.
          </p>
          {error && errors[error] && <p className="notice error" role="alert">{errors[error]}</p>}
          <form action={signIn} className="stack">
            <label className="field">
              Correo
              <input type="email" name="email" required autoComplete="email" inputMode="email" maxLength={200} />
            </label>
            <label className="field">
              Código de invitación (opcional)
              <input name="codigo" defaultValue={codigo ?? ""} autoComplete="off" maxLength={12} style={{ textTransform: "uppercase" }} />
            </label>
            <button type="submit" className="btn btn-primary">Enviarme el enlace</button>
          </form>
        </>
      )}
    </main>
  );
}
