import Link from "next/link";
import ShareButton from "@/components/ShareButton";
import { getAccount } from "@/lib/account";
import { accountsEnabled } from "@/lib/supabase";

export default async function InvitePage() {
  const account = await getAccount();
  const profile = account?.profile;

  let code = "ANA-7K2P";
  let friends = ["Luis", "Sofi", "Marco", "Rosa"];
  if (accountsEnabled) {
    code = profile?.invite_code ?? "";
    const { data } = profile
      ? await account.supabase.from("profiles").select("name").eq("invited_by", profile.id).order("created_at")
      : { data: [] };
    friends = (data ?? []).map((row: { name: string }) => row.name);
  }

  return (
    <main className="app">
      <h1>Invita a tus amigos</h1>
      <p className="muted" style={{ margin: 0, fontSize: 15, lineHeight: 1.4 }}>
        Jalo es gratis para ti y para tus amigos. Entre más se sumen, mejores planes arma.
      </p>
      {accountsEnabled && !profile ? (
        <Link href={account ? "/perfil" : "/entrar"} className="btn btn-primary">Entra para ver tu código</Link>
      ) : (
        <>
          <section className="banner" style={{ padding: 18, gap: 10 }} aria-labelledby="codigo">
            <h2 id="codigo">Tu código</h2>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.4 }}>
              Tus amigos lo usan al registrarse y Jalo los suma a tus próximos planes.
            </p>
            <div className="row">
              <div className="code">{code}</div>
              <ShareButton code={code} />
            </div>
          </section>
          <div className="card">
            <strong>Amigos que ya se unieron</strong>
            <span className="muted">{friends.length ? friends.join(", ") : "Todavía nadie. ¡Comparte tu código!"}</span>
          </div>
        </>
      )}
    </main>
  );
}
