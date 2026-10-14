"use client";

import { useState } from "react";

export default function ReportButton() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return <p className="muted small" style={{ alignSelf: "center", margin: 0 }}>Gracias. Revisaremos tu reporte.</p>;
  }

  return (
    <button type="button" onClick={() => setSent(true)} style={{ alignSelf: "center", background: "none", border: "none", color: "var(--accent)", font: "inherit", fontSize: 14, fontWeight: 600, cursor: "pointer", minHeight: 44 }}>
      Reportar o bloquear
    </button>
  );
}
