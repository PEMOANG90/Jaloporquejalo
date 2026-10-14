# Jalo

Jalo ("porque jalo") es una app web donde un agente de IA propone planes sociales y junta grupos de amigos y personas con intereses en común. Los negocios locales publican sus actividades: 1 mes gratis y después una suscripción mensual. Para las personas es gratis.

## Cómo correrla

Necesitas Node.js 20 o más reciente.

```bash
npm install
cp .env.example .env.local   # agrega tu ANTHROPIC_API_KEY para que el chat de Jalo responda
npm run dev
```

Abre http://localhost:3000. Sin la clave, todo funciona y el chat de Jalo avisa que aún no está conectado.

## Pantallas

| Ruta | Qué es |
| --- | --- |
| `/` | Inicio con los planes que Jalo sugiere |
| `/jalo` | Chat con Jalo, el agente de IA |
| `/planes/[id]` | Detalle de un plan: quién va, oferta y seguridad |
| `/invitar` | Código para invitar amigos |
| `/empresa` | Panel del negocio: confirmar ofertas y planes de pago |

Los planes y negocios son datos de ejemplo en `lib/data.ts`; todavía no hay cuentas, base de datos ni pagos.
