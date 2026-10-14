# Jalo

Jalo ("porque jalo") es una app web donde un agente de IA propone planes sociales y junta grupos de amigos y personas con intereses en común. Los negocios locales publican sus actividades: 1 mes gratis y después una suscripción mensual. Para las personas es gratis.

## Cómo correrla

Necesitas Node.js 20 o más reciente.

```bash
npm install
cp .env.example .env.local   # opcional: agrega ANTHROPIC_API_KEY para que Jalo use IA
npm run dev
```

Abre http://localhost:3000. Sin la clave, todo funciona gratis: Jalo recomienda planes por palabras clave. Con la clave, Jalo conversa con IA.

## Cuentas (Supabase)

Las cuentas, quién va a cada plan y las invitaciones se guardan en Supabase (plan gratis). Sin las variables de Supabase la app funciona en modo demo, con "Ana" y personas de ejemplo.

1. Conecta Supabase al proyecto en Vercel (pestaña Storage) para que agregue `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2. En Supabase, abre SQL Editor, pega `supabase/schema.sql` y pulsa Run.
3. En Supabase, Authentication → URL Configuration: pon la dirección de la app en Site URL y agrega `https://tu-app.vercel.app/**` en Redirect URLs.
4. Vuelve a desplegar en Vercel.

La gente entra con un enlace que le llega al correo, sin contraseña.

## Pantallas

| Ruta | Qué es |
| --- | --- |
| `/` | Inicio con los planes que Jalo sugiere |
| `/entrar` | Entrar con un enlace al correo |
| `/perfil` | Nombre, ciudad y confirmación de mayoría de edad |
| `/mis-planes` | Planes a los que te uniste |
| `/jalo` | Chat con Jalo, el agente de IA |
| `/planes/[id]` | Detalle de un plan: quién va, oferta y seguridad |
| `/invitar` | Código para invitar amigos |
| `/empresa` | Panel del negocio: confirmar ofertas y planes de pago |

Los planes y negocios son datos de ejemplo en `lib/data.ts`; todavía no hay pagos.
