import Link from "next/link";
import { notFound } from "next/navigation";
import JoinButton from "@/components/JoinButton";
import ReportButton from "@/components/ReportButton";
import { BackIcon, CalendarIcon, PinIcon, ShieldIcon } from "@/components/Icons";
import { findPlan, plans } from "@/lib/data";

const avatarColors = ["#0B6E6E", "#C2336A", "#8A5A00", "#3D4BA8", "#5B3D8A"];

export function generateStaticParams() {
  return plans.map((plan) => ({ id: plan.id }));
}

export default async function PlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plan = findPlan(id);
  if (!plan) notFound();

  const shown = plan.going.slice(0, 5);
  const free = Math.max(0, Math.min(2, plan.spots - plan.going.length));

  return (
    <main className="app" style={{ paddingTop: 0 }}>
      <header style={{ background: "var(--ink)", margin: "0 -20px", padding: "24px 20px", display: "flex", flexDirection: "column", gap: 40 }}>
        <Link href="/" aria-label="Volver" className="avatar" style={{ background: "#2E3038" }}>
          <BackIcon color="#FFFFFF" size={20} />
        </Link>
        <h1 style={{ color: "#FFFFFF" }}>{plan.title}</h1>
      </header>

      <div className="stack" style={{ gap: 8 }}>
        <div className="row"><CalendarIcon size={18} color="var(--muted)" />{plan.when}</div>
        <div className="row"><PinIcon size={18} color="var(--muted)" />{plan.business} · {plan.zone}</div>
      </div>

      <div className="card">
        <div className="row small" style={{ color: "var(--teal)", fontWeight: 700, gap: 6 }}>
          <ShieldIcon size={16} />
          Negocio verificado · lugar público
        </div>
        <strong>Oferta: {plan.offer}</strong>
        <span className="muted small">La oferta y el servicio son responsabilidad del negocio.</span>
      </div>

      <section className="stack" aria-labelledby="quien-va">
        <div className="row between">
          <h2 id="quien-va" style={{ fontSize: 18 }}>Quién va</h2>
          <span className="muted">{plan.going.length} de {plan.spots} lugares</span>
        </div>
        <div className="row" style={{ flexWrap: "wrap" }}>
          {shown.map((name, i) => (
            <div key={name} className="avatar" title={name} style={{ background: avatarColors[i % avatarColors.length] }}>
              {name[0]}
            </div>
          ))}
          {Array.from({ length: free }, (_, i) => (
            <div key={`libre-${i}`} className="avatar empty" aria-label="Lugar libre" />
          ))}
        </div>
      </section>

      <p className="muted">Unirte es gratis. Solo pagas lo que consumas en el negocio.</p>

      <div className="row">
        <JoinButton />
        <Link href="/invitar" className="btn btn-outline grow">Invitar amigos</Link>
      </div>
      <ReportButton />
    </main>
  );
}
