import ShareButton from "@/components/ShareButton";

export default function InvitePage() {
  return (
    <main className="app">
      <h1>Invita a tus amigos</h1>
      <p className="muted" style={{ margin: 0, fontSize: 15, lineHeight: 1.4 }}>
        Jalo es gratis para ti y para tus amigos. Entre más se sumen, mejores planes arma.
      </p>
      <section className="banner" style={{ padding: 18, gap: 10 }} aria-labelledby="codigo">
        <h2 id="codigo">Tu código</h2>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.4 }}>
          Tus amigos lo usan al registrarse y Jalo los suma a tus próximos planes.
        </p>
        <div className="row">
          <div className="code">ANA-7K2P</div>
          <ShareButton code="ANA-7K2P" />
        </div>
      </section>
      <div className="card">
        <strong>Amigos que ya se unieron</strong>
        <span className="muted">Luis, Sofi, Marco y Rosa</span>
      </div>
    </main>
  );
}
