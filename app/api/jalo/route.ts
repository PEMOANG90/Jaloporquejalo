import Anthropic from "@anthropic-ai/sdk";
import { JALO_SYSTEM_PROMPT } from "@/lib/jalo";

type ChatTurn = { role: "user" | "assistant"; content: string };

const MAX_TURNS = 30;
const MAX_CHARS = 2000;

function parseTurns(body: unknown): ChatTurn[] | null {
  if (!body || typeof body !== "object" || !Array.isArray((body as { messages?: unknown }).messages)) return null;
  const turns = (body as { messages: unknown[] }).messages.slice(-MAX_TURNS);
  const parsed: ChatTurn[] = [];
  for (const turn of turns) {
    if (!turn || typeof turn !== "object") return null;
    const { role, content } = turn as { role?: unknown; content?: unknown };
    if ((role !== "user" && role !== "assistant") || typeof content !== "string" || !content.trim()) return null;
    parsed.push({ role, content: content.slice(0, MAX_CHARS) });
  }
  // La conversación que va a la API debe empezar con un mensaje de la persona.
  while (parsed.length && parsed[0].role !== "user") parsed.shift();
  return parsed.length && parsed[parsed.length - 1].role === "user" ? parsed : null;
}

function reply(text: string, status = 200) {
  return Response.json({ reply: text }, { status });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return reply("No entendí tu mensaje. ¿Lo intentas de nuevo?", 400);
  }
  const messages = parseTurns(body);
  if (!messages) return reply("No entendí tu mensaje. ¿Lo intentas de nuevo?", 400);

  try {
    const client = new Anthropic();
    const response = await client.beta.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 4000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low" },
      system: JALO_SYSTEM_PROMPT,
      messages,
    });

    if (response.stop_reason === "refusal") {
      return reply("Con eso no te puedo ayudar, pero si quieres armamos otro plan. ¿Qué se te antoja?");
    }

    const text = response.content
      .flatMap((block) => (block.type === "text" ? [block.text] : []))
      .join("")
      .trim();
    return reply(text || "Se me fue la idea. ¿Me repites qué buscas?");
  } catch (error) {
    // Sin credenciales, el SDK falla antes de llamar a la API (no es un APIError).
    if (error instanceof Anthropic.AuthenticationError || !(error instanceof Anthropic.APIError)) {
      console.error("Jalo no está conectado a Anthropic:", error instanceof Error ? error.message : error);
      return reply("Todavía no estoy conectado. Mientras tanto, revisa los planes de Inicio.", 503);
    }
    if (error instanceof Anthropic.RateLimitError) {
      return reply("Estoy atendiendo a mucha gente. Intenta en un momento.", 429);
    }
    console.error("Error al hablar con Jalo:", error);
    return reply("Algo falló de mi lado. Intenta de nuevo en un momento.", 502);
  }
}
