import Link from "next/link";
import { getAccount } from "@/lib/account";
import { plans } from "@/lib/data";
import { accountsEnabled } from "@/lib/supabase";

export default async function MyPlansPage() {
  const account = await getAccount();
  let ids = ["coffee-party"];
  if (accountsEnabled) {
    const { data } = account?.profile
      ? await account.supabase.from("plan_members").select("plan_id").eq("user_id", account.user.id)
      : { data: [] };
    ids = (data ?? []).map((row: { plan_id: string }) => row.plan_id);
  }
  const mine = plans.filter((plan) => ids.includes(plan.id));

  return (
    <main className="app">
      <h1>Mis planes</h1>
      {accountsEnabled && !account?.profile ? (
        <Link href={account ? "/perfil" : "/entrar"} className="btn btn-primary">Entra para ver tus planes</Link>
      ) : mine.length === 0 ? (
        <>
          <p className="muted" style={{ margin: 0 }}>Aún no te unes a ningún plan.</p>
          <Link href="/jalo" className="btn btn-primary">Pídele un plan a Jalo</Link>
        </>
      ) : (
        mine.map((plan) => (
          <Link key={plan.id} href={`/planes/${plan.id}`} className="card">
            <strong>{plan.title}</strong>
            <span className="muted small">{plan.when} · {plan.zone}</span>
            <span className="small" style={{ color: "var(--teal)", fontWeight: 600 }}>{plan.offer}</span>
          </Link>
        ))
      )}
    </main>
  );
}
