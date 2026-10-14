-- Tablas de Jalo para Supabase. Se pega una sola vez en el SQL Editor de Supabase y se pulsa Run.

-- Perfil de cada persona. Se crea al entrar por primera vez.
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  name text not null check (char_length(name) between 1 and 40),
  city text not null check (city in ('CDMX', 'Guadalajara')),
  is_adult boolean not null check (is_adult),
  invite_code text not null unique default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6)),
  invited_by uuid references public.profiles on delete set null check (invited_by <> id),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Solo quien tiene cuenta ve nombres; cada quien crea y edita únicamente su perfil.
create policy "Ver perfiles" on public.profiles for select to authenticated using (true);
create policy "Crear mi perfil" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "Editar mi perfil" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- El código de invitación lo genera la base de datos y no se puede cambiar.
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant insert (id, name, city, is_adult, invited_by) on public.profiles to authenticated;
grant update (name, city) on public.profiles to authenticated;

-- Quién va a cada plan.
create table public.plan_members (
  plan_id text not null,
  user_id uuid not null references public.profiles on delete cascade,
  created_at timestamptz not null default now(),
  primary key (plan_id, user_id)
);

alter table public.plan_members enable row level security;

-- Cualquiera ve cuántos van; cada quien solo se une o se sale a sí mismo.
create policy "Ver quién va" on public.plan_members for select to anon, authenticated using (true);
create policy "Unirme" on public.plan_members for insert to authenticated with check (auth.uid() = user_id);
create policy "Salirme" on public.plan_members for delete to authenticated using (auth.uid() = user_id);

revoke all on public.plan_members from anon, authenticated;
grant select on public.plan_members to anon, authenticated;
grant insert (plan_id, user_id), delete on public.plan_members to authenticated;
