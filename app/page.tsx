import Link from "next/link";
import { ChevronIcon, PinIcon, SparkIcon } from "@/components/Icons";
import { plans } from "@/lib/data";

export default function Home() {
  const [featured, ...others] = plans;

  return (
    <main className="app">
      <header className="row between">
        <div className="stack" style={{ gap: 4 }}>
          <div className="row muted" style={{ gap: 4 }}>
            <PinIcon size={14} />
            CDMX · Roma Norte
          </div>
          <h1>Hola, Ana</h1>
        </div>
        <div className="avatar" style={{ background: "var(--teal)" }} aria-hidden="true">A</div>
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
            {featured.going.length} de {featured.spots} lugares · {featured.going.slice(0, 2).join(", ")} y {featured.going.length - 2} más
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
