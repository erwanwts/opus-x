-- =====================================================================
-- Opus X — PALIER 5 (back) : divulgation PAR COMPÉTENCE + vue publique WSP (D-042)
-- =====================================================================
-- Le sujet contrôle sa divulgation AU NIVEAU COMPÉTENCE (OCR-101/106/110). La
-- confidentialité est imposée EN BASE : la vue publique n'expose une compétence
-- QUE si le passeport est visibility='public' ET la compétence est published
-- (DOUBLE FILTRE). Défaut = NON publié (privé par défaut, invariant).
--
-- NE FAIT PAS : le front d'actionnement (palier front) ; le CONTENU réel des
-- preuves (jamais exposé) ; toucher la prod.
--
-- ⚠️ security_invoker : la vue reste DEFINER (security_invoker=false) avec
-- whitelist + double filtre dans la DÉFINITION — le mécanisme de confidentialité
-- que le mandat autorise (point 4 : « filtre dans la définition »). Passer
-- security_invoker=true exigerait d'exposer les tables de base à anon (grants
-- colonne + RLS sur 5 tables) — surface plus large et plus risquée que cette
-- vue à whitelist. La dette UNRESTRICTED est SIGNALÉE, non soldée ici (cf. note).
-- =====================================================================

-- ── 1. LA VISIBILITÉ PAR COMPÉTENCE — acte du sujet, réversible ───────────────
-- Une ligne par (passport, compétence). Défaut published=false. Publier/dépublier
-- est un acte du sujet (comme visibility). Table interne (l'API la gère).
create table if not exists public.wsp_competency_publication (
  passport_id       uuid        not null references public.passports(id) on delete cascade,
  skill_id          text        not null references public.wsp_skills(id),
  framework_version text        not null,
  published         boolean     not null default false,   -- INVARIANT : non publié par défaut
  published_at      timestamptz,
  updated_at        timestamptz not null default now(),
  primary key (passport_id, skill_id, framework_version)
);

comment on table public.wsp_competency_publication is
  'Palier 5 (D-042) — divulgation PAR COMPÉTENCE. Le sujet publie chaque compétence individuellement (published). Défaut NON publié (privé par défaut). Réversible (dépublier). Gouverne la vue publique (double filtre avec passports.visibility).';

revoke all on public.wsp_competency_publication from anon, authenticated;

-- ── 2. LA VUE PUBLIQUE DES COMPÉTENCES — rebranchée WSP, DOUBLE FILTRE ────────
-- N'expose une compétence QUE si (passeport public) ET (compétence publiée).
-- Whitelist : handle, skill, état de Trust PAR COMPÉTENCE, niveau, PROVENANCE de
-- preuve (émetteur + date, JAMAIS le contenu brut). Rebranchée sur
-- wsp_competency_trust (le vrai Trust), plus sur skills/trust_index Sprint-1.
create or replace view public.public_passport_competencies
  with (security_invoker = false) as
  select
    pa.handle,
    ct.skill_id,
    ct.state,
    ct.basis_level,
    -- Existence + provenance des preuves ACTIVES (émetteur, date) — minimisé à ce
    -- que la vérification requiert (OCR-110:126). JAMAIS observation/hash/artefacts.
    (
      select coalesce(
        jsonb_agg(jsonb_build_object('issuer_id', ev.issuer_id, 'occurred_at', ev.occurred_at) order by ev.occurred_at),
        '[]'::jsonb
      )
      from public.wsp_evidence_demonstrates_skill ds
      join public.wsp_evidence ev on ev.id = ds.evidence_id
      where ev.subject_id = pr.opus_id
        and ds.skill_id = ct.skill_id and ds.framework_version = ct.framework_version
        and not exists (select 1 from public.wsp_fact_revocations rv where rv.revokes_evidence_id = ev.id)
    ) as evidence_provenance
  from public.wsp_competency_trust ct
  join public.passports pa on pa.id = ct.passport_id
  join public.profiles   pr on pr.id = pa.profile_id
  join public.wsp_competency_publication cp
    on  cp.passport_id = ct.passport_id
    and cp.skill_id = ct.skill_id
    and cp.framework_version = ct.framework_version
    and cp.published = true                       -- FILTRE 2 : compétence publiée
  where pa.visibility = 'public';                 -- FILTRE 1 : passeport public

comment on view public.public_passport_competencies is
  'Palier 5 (D-042) — compétences PUBLIÉES d''un passeport PUBLIC + leur Trust par compétence + provenance de preuve (émetteur, date). DOUBLE FILTRE : visibility=public ET published. Security-definer ASSUMÉ (whitelist en définition). JAMAIS le contenu brut d''une preuve, ni une compétence non publiée, ni un passeport privé.';

grant select on public.public_passport_competencies to anon;

-- ── 3. L'API DE PUBLICATION — owner-scopée (le sujet seul agit sur SES compétences)
-- Comme wsp_my_active_skills : current_opus_id → le passport du CALLER. Un sujet
-- ne peut jamais publier la compétence d'un autre (il n'agit que sur son passport).
create or replace function public.wsp_publish_competency(p_skill_id text, p_framework_version text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_passport uuid;
begin
  select pa.id into v_passport
  from public.passports pa
  join public.profiles pr on pr.id = pa.profile_id
  where pr.opus_id = public.current_opus_id();
  if v_passport is null then
    raise exception 'no_passport_for_caller' using errcode = '42501';
  end if;
  -- On ne publie que ce qui EXISTE (une compétence calculée pour ce passport).
  if not exists (
    select 1 from public.wsp_competency_trust ct
    where ct.passport_id = v_passport and ct.skill_id = p_skill_id and ct.framework_version = p_framework_version
  ) then
    raise exception 'competency_not_found' using errcode = '22000';
  end if;
  insert into public.wsp_competency_publication (passport_id, skill_id, framework_version, published, published_at, updated_at)
  values (v_passport, p_skill_id, p_framework_version, true, now(), now())
  on conflict (passport_id, skill_id, framework_version)
  do update set published = true, published_at = now(), updated_at = now();
end;
$$;

create or replace function public.wsp_unpublish_competency(p_skill_id text, p_framework_version text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_passport uuid;
begin
  select pa.id into v_passport
  from public.passports pa
  join public.profiles pr on pr.id = pa.profile_id
  where pr.opus_id = public.current_opus_id();
  if v_passport is null then return; end if;
  update public.wsp_competency_publication
     set published = false, updated_at = now()
   where passport_id = v_passport and skill_id = p_skill_id and framework_version = p_framework_version;
end;
$$;

comment on function public.wsp_publish_competency(text, text) is
  'Palier 5 (D-042) — le sujet PUBLIE une de SES compétences (owner-scopé, current_opus_id). Défaut du système : non publié ; cet acte la rend publique (sous réserve du passeport public). Réversible via wsp_unpublish_competency.';

revoke all on function public.wsp_publish_competency(text, text)   from public, anon;
revoke all on function public.wsp_unpublish_competency(text, text) from public, anon;
grant execute on function public.wsp_publish_competency(text, text)   to authenticated, service_role;
grant execute on function public.wsp_unpublish_competency(text, text) to authenticated, service_role;
