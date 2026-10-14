import Link from "next/link";
import ConfirmOffer from "@/components/ConfirmOffer";
import { SparkIcon } from "@/components/Icons";
import { businessPlans } from "@/lib/data";

export default function BusinessPage() {
  return (
    <main className="app" style={{ paddingBottom: 40 }}>
      <header className="stack" style={{ gap: 4 }}>
        <div className="eyebrow">PANEL DE EMPRESA</div>
        <h1 style={{ fontSize: 26 }}>[Nombre del negocio]</h1>
        <div className="muted">Mes gratis · te quedan 21 días</div>
      </header>

      <section className="card highlight" aria-labelledby="oferta">
        <div className="row small" style={{ color: "var(--teal)", fontWeight: 700, gap: 6 }}>
          <SparkIcon size={16} />
          Jalo preparó esta oferta
        </div>
        <div id="oferta" className="display" style={{ fontSize: 19 }}>2x1 en café para grupos de 4 o más</div>
        <div className="muted">Para el coffee party del sábado, de 10:00 a 13:00</div>
        <div className="muted small">No se publica hasta que la confirmes. Tú respondes por lo que ofreces.</div>
        <ConfirmOffer />
      </section>

      <div className="panel-teal">
        <div className="stack grow" style={{ gap: 2 }}>
          <span className="eyebrow" style={{ fontSize: 12 }}>SUGERENCIA DE JALO</span>
          <strong>Comparte tu oferta en redes</strong>
          <span className="small" style={{ color: "#33363D" }}>Te preparamos un post con QR. Tú decides si lo publicas.</span>
        </div>
        <button type="button" className="btn btn-teal" style={{ minHeight: 44, padding: "0 14px", fontSize: 14 }}>Ver post</button>
      </div>

      <section className="stack" aria-labelledby="planes-empresa">
        <h2 id="planes-empresa" style={{ fontSize: 18 }}>Al terminar tu mes gratis</h2>
        {businessPlans.map((plan) => (
          <div key={plan.name} className="card row between" style={{ flexDirection: "row", padding: "12px 14px" }}>
            <span className="stack" style={{ gap: 2 }}>
              <strong>{plan.name}</strong>
              <span className="muted small">{plan.detail}</span>
            </span>
            <strong style={{ whiteSpace: "nowrap" }}>${plan.price}/mes</strong>
          </div>
        ))}
        <span className="muted small">Precios en MXN con IVA. Factura CFDI disponible.</span>
      </section>

      <Link href="/" style={{ alignSelf: "center", fontSize: 14, fontWeight: 600, color: "var(--teal)" }}>
        Ver la app como persona
      </Link>
    </main>
  );
}
