// Datos de ejemplo para la primera versión. Se reemplazan por la base de datos más adelante.

export type Plan = {
  id: string;
  title: string;
  when: string;
  zone: string;
  business: string;
  offer: string;
  spots: number;
  going: string[];
  tags: string[];
};

export const plans: Plan[] = [
  {
    id: "coffee-party",
    title: "Coffee party",
    when: "Sáb 17 oct · 10:00",
    zone: "Roma Norte, CDMX",
    business: "[Nombre del negocio]",
    offer: "2x1 en café para el grupo",
    spots: 6,
    going: ["Luis", "Sofi", "Marco", "Rosa"],
    tags: ["Para tu grupo", "Oferta 2x1"],
  },
  {
    id: "after-party",
    title: "After party",
    when: "Sáb 17 oct · 23:00",
    zone: "Condesa, CDMX",
    business: "[Nombre del negocio]",
    offer: "Cover gratis antes de las 0:00",
    spots: 10,
    going: ["Dani", "Vale", "Toño"],
    tags: ["Noche"],
  },
  {
    id: "vaquero-run",
    title: "Vaquero run",
    when: "Dom 18 oct · 8:00",
    zone: "Bosque de Chapultepec, CDMX",
    business: "[Nombre del negocio]",
    offer: "Ven con sombrero",
    spots: 20,
    going: ["Paco", "Lupita", "Iván", "Mar", "Beto"],
    tags: ["Al aire libre"],
  },
];

export function findPlan(id: string): Plan | undefined {
  return plans.find((plan) => plan.id === id);
}

export const businessPlans = [
  { name: "Básico", price: 299, detail: "Ofertas ilimitadas y reservas de grupo" },
  { name: "Destacado", price: 799, detail: "Primero en tu zona y más recomendaciones de Jalo" },
];
