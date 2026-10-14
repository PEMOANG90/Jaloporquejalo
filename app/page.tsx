import Link from "next/link";
import { ChevronIcon, PinIcon, SparkIcon } from "@/components/Icons";
import { getAccount, getGoing } from "@/lib/account";
import { plans } from "@/lib/data";
import { accountsEnabled } from "@/lib/supabase";

function goingSummary(names: string[]) {
  if (names.length === 0) return "Sé de los primeros en unirte";
  if (names.some((name) => !name)) return names.length === 1 ? "Ya va 1 persona" : `Ya van ${names.length} personas`;
  if (names.length <= 2) return names.join(" y ");
  return `${names.slice(0, 2).join(", ")} y ${names.length - 2} más`;
}

export default async function Home() {
  const [featured, ...others] = plans;
  const account = await getAccount();
  // Sin cuentas conectadas la app muestra a "Ana", la persona de ejemplo.
  const profile = accountsEnabled ? account?.profile : { name: "Ana", city: "CDMX · Roma Norte" };
  const going = await getGoing(featured.id);

  return (
    <main className="app">
      <header className="row between">
        <div className="stack" style={{ gap: 4 }}>
          <div className="row muted" style={{ gap: 4 }}>
            <PinIcon size={14} />
            {profile?.city ?? "CDMX y Guadalajara"}
          </div>
          <h1>{profile ? `Hola, ${profile.name}` : "Hola"}</h1>
        </div>
        {profile ? (
          <Link href="/perfil" className="avatar" style={{ background: "var(--teal)", textDecoration: "none" }} aria-label="Tu perfil">
            {profile.name[0].toUpperCase()}
          </Link>
        ) : (
          <Link href={account ? "/perfil" : "/entrar"} className="btn btn-outline">Entrar</Link>
        )}
      </header>

      <Link href="/invitar" className="banner row between" style={{ flexDirection: "row" }}>
        <span className="stack" style={{ gap: 2 }}>
          <strong>Jalo es gratis, siempre</strong>
          <span className="muted small">Invita a tus amigos a tus planes</span>
        </span>
        <ChevronIcon color="var(--accent)" size={20} />
      </Link>

      <section className="stack" aria-labelledby="sugerencias">
        <h2 id="sugerencias">Jalo te sugiere</h2>
        <article className="card">
          <div className="row">
            {featured.tags.map((tag, i) => (
              <span key={tag} className={i === 0 ? "chip" : "chip pink"}>{tag}</span>
            ))}
          </div>
          <div className="display" style={{ fontSize: 20 }}>{featured.title}</div>
          <div className="muted">{featured.when} · {featured.business}</div>
          <div className="muted">
            {going.names.length} de {featured.spots} lugares · {goingSummary(going.names)}
          </div>
          <Link href={`/planes/${featured.id}`} className="btn btn-primary">Ver plan</Link>
        </article>
        <div className="grid-2">
          {others.map((plan) => (
            <Link key={plan.id} href={`/planes/${plan.id}`} className="card" style={{ padding: 14 }}>
              <strong>{plan.title}</strong>
              <span className="muted small">{plan.when}</span>
              <span className="small" style={{ color: "var(--teal)", fontWeight: 600 }}>{plan.offer}</span>
            </Link>
          ))}
        </div>
      </section>

      <p className="muted small">
        ¿Tienes un negocio? <Link href="/empresa">Entra a tu panel</Link>
      </p>

      <Link href="/jalo" className="fab">
        <SparkIcon size={20} />
        Pídele un plan a Jalo
      </Link>
    </main>
  );
}
