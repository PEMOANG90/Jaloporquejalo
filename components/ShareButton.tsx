"use client";

import { useState } from "react";

export default function ShareButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const text = `Únete a mis planes en Jalo con mi código ${code}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Jalo", text, url: window.location.origin });
        return;
      }
      await navigator.clipboard.writeText(`${text}: ${window.location.origin}`);
      setCopied(true);
    } catch {
      // El usuario canceló o el navegador no lo permite; no hay nada que hacer.
    }
  }

  return (
    <button type="button" className="btn btn-primary" onClick={share}>
      {copied ? "Copiado" : "Compartir"}
    </button>
  );
}
