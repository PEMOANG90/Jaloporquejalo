"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SendIcon } from "./Icons";
import { plans } from "@/lib/data";

type Turn = { role: "user" | "assistant"; content: string };

const greeting: Turn = { role: "assistant", content: "¡Hola! Soy Jalo. ¿Qué se te antoja hacer y con quién?" };

function mentionedPlans(text: string) {
  const lower = text.toLowerCase();
  return plans.filter((plan) => lower.includes(plan.title.toLowerCase()));
}

export default function JaloChat() {
  const [turns, setTurns] = useState<Turn[]>([greeting]);
  const [draft, setDraft] = useState("");
  const [waiting, setWaiting] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns, waiting]);

  async function send(event: React.FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || waiting) return;
    const next = [...turns, { role: "user" as const, content: text }];
    setTurns(next);
    setDraft("");
    setWaiting(true);
    try {
      const res = await fetch("/api/jalo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = (await res.json()) as { reply?: string };
      setTurns([...next, { role: "assistant", content: data.reply ?? "Algo falló. Intenta de nuevo." }]);
    } catch {
      setTurns([...next, { role: "assistant", content: "No me pude conectar. Revisa tu internet e intenta de nuevo." }]);
    } finally {
      setWaiting(false);
    }
  }

  return (
    <>
      <div className="chat" aria-live="polite">
        {turns.map((turn, i) => (
          <div key={i} className="stack" style={{ gap: 8 }}>
            <div className={`bubble ${turn.role === "user" ? "me" : "jalo"}`}>{turn.content}</div>
            {turn.role === "assistant" &&
              mentionedPlans(turn.content).map((plan) => (
                <Link key={plan.id} href={`/planes/${plan.id}`} className="card" style={{ maxWidth: "85%", padding: "10px 12px", gap: 2 }}>
                  <strong>{plan.title} · {plan.when.split(" · ")[1]}</strong>
                  <span className="muted small">{plan.business} · {plan.offer}</span>
                </Link>
              ))}
          </div>
        ))}
        {waiting && <div className="bubble jalo muted">Jalo está pensando…</div>}
        <div ref={endRef} />
      </div>
      <div className="composer">
        <form onSubmit={send}>
          <label htmlFor="mensaje" className="sr-only">Escríbele a Jalo</label>
          <input id="mensaje" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Escríbele a Jalo…" autoComplete="off" maxLength={2000} />
          <button type="submit" className="icon-btn" aria-label="Enviar" disabled={waiting || !draft.trim()}>
            <SendIcon color="#FFFFFF" size={20} />
          </button>
        </form>
      </div>
    </>
  );
}
