"use client";

import { useState } from "react";

export default function ConfirmOffer() {
  const [confirmed, setConfirmed] = useState(false);

  if (confirmed) {
    return <p className="small" style={{ margin: 0, color: "var(--teal)", fontWeight: 700 }}>Oferta publicada. Jalo ya la recomienda en tu zona.</p>;
  }

  return (
    <div className="row">
      <button type="button" className="btn btn-teal grow" onClick={() => setConfirmed(true)}>Confirmar y publicar</button>
      <button type="button" className="btn btn-outline">Editar</button>
    </div>
  );
}
