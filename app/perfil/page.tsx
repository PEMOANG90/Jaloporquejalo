import Link from "next/link";
import { redirect } from "next/navigation";
import { saveProfile, signOut } from "@/app/actions";
import { cities, getAccount, pendingInviteCode } from "@/lib/account";

const errors: Record<string, string> = {
  datos: "Escribe tu nombre y elige tu ciudad.",
  edad: "Jalo es solo para mayores de 18 años.",
  codigo: "Ese código de invitación no existe. Revísalo o déjalo vacío.",
  guardar: "No pudimos guardar tu perfil. Intenta de nuevo.",
};

export default async function ProfilePage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const account = await getAccount();
  if (!account) redirect("/entrar");
  const { profile, user } = account;
  const { error, guardado } = await searchParams;
  const code = profile ? "" : await pendingInviteCode();

  return (
    <main className="app">
      <h1>{profile ? "Tu perfil" : "Crea tu perfil"}</h1>
      <p className="muted" style={{ margin: 0 }}>{user.email}</p>
      {error && errors[error] && <p className="notice error" role="alert">{errors[error]}</p>}
      {guardado && <p className="notice" role="status">Listo, guardamos tus cambios.</p>}

      <form action={saveProfile} className="stack">
        <label className="field">
          Tu nombre (así te verán en los planes)
          <input name="nombre" required maxLength={40} autoComplete="given-name" defaultValue={profile?.name ?? ""} />
        </label>
        <label className="field">
          Ciudad
          <select name="ciudad" required defaultValue={profile?.city ?? "CDMX"}>
            {cities.map((city) => (
              <option key={city}>{city}</option>
            ))}
          </select>
        </label>
        {!profile && (
          <>
            <label className="field">
              Código de invitación (opcional)
              <input name="codigo" defaultValue={code} autoComplete="off" maxLength={12} style={{ textTransform: "uppercase" }} />
            </label>
            <label className="check">
              <input type="checkbox" name="mayor" required />
              <span>
                Soy mayor de 18 años y entiendo que Jalo solo conecta personas: los planes son en lugares públicos, cada negocio
                responde por sus ofertas y puedo reportar o bloquear a quien sea.
              </span>
            </label>
          </>
        )}
        <button type="submit" className="btn btn-primary">{profile ? "Guardar cambios" : "Empezar"}</button>
      </form>

      {profile && (
        <>
          <Link href="/invitar" className="btn btn-outline">Mi código: {profile.invite_code}</Link>
          <form action={signOut}>
            <button type="submit" className="btn btn-outline" style={{ width: "100%" }}>Cerrar sesión</button>
          </form>
        </>
      )}
    </main>
  );
}
