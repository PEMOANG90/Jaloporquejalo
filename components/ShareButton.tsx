"use client";

import { useState } from "react";

export default function ShareButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const text = `Únete a mis planes en Jalo con mi código ${code}`;
    const url = `${window.location.origin}/entrar?codigo=${encodeURIComponent(code)}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Jalo", text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text}: ${url}`);
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
