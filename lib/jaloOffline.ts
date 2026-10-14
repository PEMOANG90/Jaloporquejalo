import { plans, type Plan } from "./data";

// Respuestas de Jalo cuando no hay clave de IA: recomienda planes del catálogo por palabras clave.

function normalize(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function describe(plan: Plan) {
  return `${plan.title} (${plan.when}, ${plan.zone}): ${plan.offer}.`;
}

export function offlineReply(message: string): string {
  const text = normalize(message);

  if (/\b(todo|todos|opciones|catalogo|que hay)\b/.test(text)) {
    return `Esto es lo que hay esta semana:\n${plans.map(describe).join("\n")}\n¿Cuál te late?`;
  }

  const scored = plans
    .map((plan) => ({ plan, score: plan.keywords.filter((word) => text.includes(word)).length }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    return "Cuéntame un poco más: ¿qué día te queda, y buscas algo tranqui, de fiesta o al aire libre?";
  }

  const best = scored.filter(({ score }) => score === scored[0].score).map(({ plan }) => plan);
  if (best.length === 1) {
    return `Te va a gustar el ${describe(best[0])} Ábrelo para ver quién va y unirte.`;
  }
  return `Tengo ${best.length} opciones para ti:\n${best.map(describe).join("\n")}\n¿Cuál te late?`;
}
