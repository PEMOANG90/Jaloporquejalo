import JaloChat from "@/components/JaloChat";
import { SparkIcon } from "@/components/Icons";

export default function JaloPage() {
  return (
    <main className="app" style={{ paddingBottom: 168 }}>
      <header className="row" style={{ gap: 12 }}>
        <div className="avatar" style={{ background: "var(--ink)" }} aria-hidden="true">
          <SparkIcon color="#FFFFFF" />
        </div>
        <div className="stack" style={{ gap: 2 }}>
          <h1 style={{ fontSize: 20 }}>Jalo</h1>
          <span className="muted small">Arma planes y junta a tu grupo</span>
        </div>
      </header>
      <JaloChat />
    </main>
  );
}
