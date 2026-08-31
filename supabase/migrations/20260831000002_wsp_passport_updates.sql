-- =====================================================================
-- Opus X — PALIER 2 : wsp_passport_updates — le Passport GRANDIT
-- =====================================================================
-- Le mécanisme qui fait grandir le Passport. Modèle ÉVÉNEMENT GÉNÉRAL
-- (D-034) : une update = un changement du Passport ; une preuve produit une
-- update de type evidence. Révocation = MARQUER + RECALCULER (D-036) : on pose
-- revoked_at (append-only), jamais d'update de compensation, jamais de DELETE.
--
-- Périmètre STRICT du palier : la table, ses contraintes, le câblage à
-- l'ingestion, la marque de révocation. NE TOUCHE PAS : trust_index / calcul de
-- Trust (palier 4), skills / lifecycle_stage (palier 3), vue publique (palier 5).
-- =====================================================================

-- ── 1. LA TABLE — modèle événement général (D-034) ──────────────────
create table if not exists public.wsp_passport_updates (
  id            text        primary key default ('pu_' || public.generate_ulid()),
  passport_id   uuid        not null references public.passports(id),
  -- Type d'événement. 'evidence' = produit par une preuve acceptée ; les types
  -- non-evidence (ex. 'disclosure') sont prévus par le modèle général (D-034),
  -- aucun n'est PRODUIT à ce palier — seul 'evidence' l'est (câblage ingestion).
  update_type   text        not null check (update_type in ('evidence', 'disclosure')),
  -- Lien vers le fait de preuve. Présent SSI type evidence (contrainte ci-dessous).
  evidence_link text        references public.wsp_evidence(id),
  created_at    timestamptz not null default now(),
  -- D-036 : marque de révocation. NULL par défaut ; on MARQUE, on n'efface jamais.
  revoked_at    timestamptz,

  -- OCR-101 amendé (contrainte SQL, pas convention) : une update de type evidence
  -- MUST porter un evidence_link ; une update d'un autre type MUST NOT en porter.
  constraint wsp_pu_evidence_link_shape check (
    (update_type = 'evidence'  and evidence_link is not null)
    or (update_type <> 'evidence' and evidence_link is null)
  )
);

comment on table public.wsp_passport_updates is
  'Palier 2 — le Passport grandit par updates append-only. Modèle événement général (D-034) : une update de type evidence par preuve acceptée (evidence_link UNIQUE), d''autres types pour les changements non-evidence. Révocation = revoked_at posé (D-036), jamais de DELETE ni d''update de compensation.';

-- Lien UNIQUE : une preuve → au plus UNE update evidence (OCR-110/114 : UNIQUE).
-- Index unique PARTIEL car evidence_link est NULL pour les types non-evidence.
create unique index if not exists wsp_pu_evidence_link_unique
  on public.wsp_passport_updates (evidence_link)
  where evidence_link is not null;

create index if not exists wsp_pu_passport_idx
  on public.wsp_passport_updates (passport_id);

-- ── 2. APPEND-ONLY HYBRIDE — immuable, SAUF la marque de révocation ───────
-- wsp_reject_mutation() rejette TOUT UPDATE : inutilisable ici, car D-036 exige
-- de POSER revoked_at (un UPDATE contrôlé). Ce garde n'autorise qu'une seule
-- transition : revoked_at NULL → timestamp, une fois, sans toucher aucune autre
-- colonne. Tout le reste (DELETE, modif d'une colonne factuelle, réécriture ou
-- effacement de la marque) est REFUSÉ. C'est D-036 en contrainte, pas en convention.
create or replace function public.wsp_pu_guard_mutation()
returns trigger
language plpgsql
set search_path = ''
as $guard$
begin
  if tg_op = 'DELETE' then
    raise exception 'WSP_APPEND_ONLY: DELETE interdit sur wsp_passport_updates. Une révocation MARQUE (revoked_at), elle n''efface jamais (D-036).'
      using errcode = 'restrict_violation';
  end if;
  -- UPDATE : seule transition permise = poser la marque de révocation.
  if new.id is distinct from old.id
     or new.passport_id is distinct from old.passport_id
     or new.update_type is distinct from old.update_type
     or new.evidence_link is distinct from old.evidence_link
     or new.created_at is distinct from old.created_at then
    raise exception 'WSP_APPEND_ONLY: seul revoked_at peut changer sur wsp_passport_updates (append-only ; D-036).'
      using errcode = 'restrict_violation';
  end if;
  if old.revoked_at is not null then
    raise exception 'WSP_REVOKE_ONCE: revoked_at déjà posé — la marque de révocation est monotone, jamais réécrite (D-036).'
      using errcode = 'restrict_violation';
  end if;
  if new.revoked_at is null then
    raise exception 'WSP_REVOKE_MARK: une révocation POSE revoked_at (NULL→timestamp), jamais l''inverse (D-036).'
      using errcode = 'restrict_violation';
  end if;
  return new;
end;
$guard$;

drop trigger if exists wsp_passport_updates_guard on public.wsp_passport_updates;
create trigger wsp_passport_updates_guard
  before update or delete on public.wsp_passport_updates
  for each row execute function public.wsp_pu_guard_mutation();

-- Garde TRUNCATE (statement-level) — même réutilisation que les 8 tables wsp_.
drop trigger if exists wsp_passport_updates_no_truncate on public.wsp_passport_updates;
create trigger wsp_passport_updates_no_truncate
  before truncate on public.wsp_passport_updates
  for each statement execute function public.wsp_reject_mutation();

-- ── 3. LA RÉVOCATION (D-036) — un fait de révocation MARQUE l'update ──────
-- wsp_fact_revocations est un fait append-only, inséré directement. À son
-- insertion, on POSE revoked_at sur l'update evidence correspondante. On MARQUE
-- (pas d'update de compensation, D-036), on n'efface pas. NE TOUCHE PAS
-- trust_index : le recalcul de Trust est le palier 4.
create or replace function public.wsp_pu_mark_revoked()
returns trigger
language plpgsql
security definer
set search_path = ''
as $mark$
begin
  update public.wsp_passport_updates
     set revoked_at = now()
   where update_type = 'evidence'
     and evidence_link = new.revokes_evidence_id
     and revoked_at is null;
  return new;
end;
$mark$;

drop trigger if exists wsp_fact_revocations_mark_update on public.wsp_fact_revocations;
create trigger wsp_fact_revocations_mark_update
  after insert on public.wsp_fact_revocations
  for each row execute function public.wsp_pu_mark_revoked();

-- ── Grants : table interne (comme wsp_evidence) — aucun accès client direct.
revoke all on public.wsp_passport_updates from anon, authenticated;

-- ── 4. LE CÂBLAGE À L'INGESTION — wsp_ingest_evidence, splicée VERBATIM ─────
-- Reproduction byte-identique de la fonction prouvée (migration …0005), avec
-- TROIS insertions seulement : (A) déclaration v_passport ; (B) rejet D-035 avant
-- l'écriture ; (C) création d'UNE update evidence après l'écriture du fait.
create or replace function public.wsp_ingest_evidence(
  p_issuer_id       text,
  p_timestamp       text,
  p_body            text,
  p_signature       text,
  p_payload         jsonb,
  p_recomputed_hash text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_secret     text;
  v_expected   text;
  v_now        bigint := floor(extract(epoch from now()))::bigint;
  v_ts         bigint;
  v_subject    text;
  v_fw         text;
  v_fwver      text;
  v_skill      text;
  v_claimed    text;
  v_evid       text;
  v_received   text;
  v_crit_count integer;
  v_crit_key   text;
  v_obs        integer;
  v_derived    text;
  v_existing   record;
  v_id         text;
  v_passport   uuid;
begin
  -- ── ÉTAPE 1 — Authentifier l'Issuer (HMAC, temps constant). 401. ────────
  select s.hmac_secret into v_secret
  from public.wsp_issuer_secrets s
  join public.wsp_issuers i on i.id = s.issuer_id and i.status = 'active'
  where s.issuer_id = p_issuer_id;
  if v_secret is null then
    raise exception 'unauthorized' using errcode = '28000';
  end if;
  begin
    v_ts := p_timestamp::bigint;
  exception when others then
    raise exception 'unauthorized' using errcode = '28000';
  end;
  if abs(v_now - v_ts) > 300 then
    raise exception 'unauthorized' using errcode = '28000';
  end if;
  v_expected := encode(extensions.hmac(p_timestamp || '.' || p_body, v_secret, 'sha256'), 'hex');
  if not public.wsp_ct_eq(v_expected, lower(coalesce(p_signature, ''))) then
    raise exception 'unauthorized' using errcode = '28000';
  end if;

  -- ── ÉTAPE 2 — Consentement ACTIF (W6). Non-énumérant. ───────────────────
  v_subject := p_payload #>> '{subject,opus_id}';
  if v_subject is null or not public.wsp_consent_active(v_subject, p_issuer_id) then
    raise exception 'rejected' using errcode = '42501';
  end if;

  -- ── ÉTAPE 3 — Conformité au schéma déclaré. ─────────────────────────────
  if (p_payload ->> 'schema_version') is distinct from '1.0'
     or (p_payload ->> 'type') is distinct from 'evidence'
     or jsonb_typeof(p_payload -> 'issuer')       <> 'object'
     or jsonb_typeof(p_payload -> 'subject')      <> 'object'
     or jsonb_typeof(p_payload -> 'framework')    <> 'object'
     or jsonb_typeof(p_payload -> 'demonstrates') <> 'object'
     or jsonb_typeof(p_payload -> 'observation')  <> 'object'
     or jsonb_typeof(p_payload -> 'provenance')   <> 'object'
     or jsonb_typeof(p_payload -> 'is_declaration') <> 'boolean'
     or jsonb_typeof(p_payload -> 'observation' -> 'criteria') <> 'array'
     or jsonb_typeof(p_payload -> 'observation' -> 'criterion_levels') <> 'object'
     or (p_payload #>> '{issuer,id}') is null
     or (p_payload #>> '{issuer,evidence_id}') is null
     or (p_payload #>> '{issuer,attested_by,actor_id}') is null
     or (p_payload #>> '{issuer,attested_by,role}') is null
     or (p_payload #>> '{demonstrates,skill_id}') is null
     or (p_payload #>> '{demonstrates,claimed_level}') is null
     or (p_payload ->> 'occurred_at') is null
     or (p_payload ->> 'attested_at') is null
     or (p_payload ->> 'canonical_hash') is null then
    raise exception 'schema_invalid' using errcode = '22000';
  end if;

  -- ── ÉTAPE 4 — AUCUN champ interdit (W1). Rejet explicite. ───────────────
  if public.wsp_has_forbidden_field(p_payload) then
    raise exception 'forbidden_field' using errcode = '22000';
  end if;

  -- ── ÉTAPE 5 — PROVENANCE (W4). Rejet explicite. ─────────────────────────
  if (p_payload #>> '{provenance,evidence_ref,kind}') is null
     or (p_payload #>> '{provenance,evidence_ref,id}') is null then
    raise exception 'missing_provenance' using errcode = '22000';
  end if;

  -- ── ÉTAPE 6 — Existence : framework+version, skill, sujet. Non-énumérant. ─
  v_fw    := p_payload #>> '{framework,id}';
  v_fwver := p_payload #>> '{framework,version}';
  v_skill := p_payload #>> '{demonstrates,skill_id}';
  if not exists (
       select 1 from public.wsp_framework_versions
        where framework_id = v_fw and version = v_fwver
     )
     or not exists (
       select 1 from public.wsp_skills
        where id = v_skill and framework_id = v_fw and framework_version = v_fwver
     )
     or not exists (select 1 from public.profiles where opus_id = v_subject) then
    raise exception 'rejected' using errcode = '42501';
  end if;

  -- ── ÉTAPE 7 — Hash : comparer RECALCULÉ (Opus X) au REÇU, temps constant. ─
  v_received := p_payload ->> 'canonical_hash';
  if not public.wsp_ct_eq(lower(coalesce(p_recomputed_hash, '')), lower(coalesce(v_received, ''))) then
    raise exception 'canonical_hash_mismatch' using errcode = '22000';
  end if;

  -- ── ÉTAPE 8 — Cohérence Framework (§10). ────────────────────────────────
  v_claimed := p_payload #>> '{demonstrates,claimed_level}';
  select count(*) into v_crit_count
  from jsonb_object_keys(p_payload -> 'observation' -> 'criterion_levels');
  if v_crit_count <> 1 then
    raise exception 'observation_invalid' using errcode = '22000';
  end if;
  select key into v_crit_key
  from jsonb_each(p_payload -> 'observation' -> 'criterion_levels') limit 1;
  -- le critère porteur du niveau doit figurer dans criteria
  if not (p_payload -> 'observation' -> 'criteria' ? v_crit_key) then
    raise exception 'observation_invalid' using errcode = '22000';
  end if;
  begin
    v_obs := (p_payload -> 'observation' -> 'criterion_levels' ->> v_crit_key)::integer;
  exception when others then
    raise exception 'observation_invalid' using errcode = '22000';
  end;
  -- recalcul du niveau via les bandes publiées de la version CITÉE
  select slug into v_derived
  from public.wsp_skill_levels
  where skill_id = v_skill
    and framework_version = v_fwver
    and v_obs between observation_min and observation_max;
  if v_derived is null then
    raise exception 'below_emission_threshold' using errcode = '22000';
  end if;
  if v_derived <> v_claimed then
    raise exception 'claimed_level_incoherent' using errcode = '22000';
  end if;

  -- ── ÉTAPE 9 — Idempotence (§7) : (issuer_id, issuer_evidence_id) + hash
  --    RECALCULÉ (jamais le reçu). ──────────────────────────────────────────
  v_evid := p_payload #>> '{issuer,evidence_id}';
  select id, canonical_hash into v_existing
  from public.wsp_evidence
  where issuer_id = p_issuer_id and issuer_evidence_id = v_evid;
  if found then
    if v_existing.canonical_hash = p_recomputed_hash then
      return jsonb_build_object('status', 'exists', 'evidence_id', v_existing.id, 'subject_id', v_subject);
    else
      raise exception 'evidence_integrity_conflict' using errcode = '23505';
    end if;
  end if;

  -- ── ÉTAPE 10 (Palier 2, D-035) — le sujet DOIT posséder un Passport,
  --    sinon subject_has_no_passport (jamais d'auto-émission, jamais de silence). ─
  v_passport := public.wsp_require_subject_passport(v_subject);

  -- ── ÉTAPE 11 — Écrire le fait (append-only) ET, indissociablement, sa
  --    Passport update de type evidence (Palier 2, D-034). ───────────────
  begin
    insert into public.wsp_evidence (
      issuer_id, issuer_evidence_id, subject_id,
      framework_id, framework_version,
      attested_by_actor_id, attested_by_role,
      is_declaration, provenance_kind, provenance_id,
      observation, schema_version, canonicalization_algorithm, hash_algorithm,
      canonical_hash, occurred_at, attested_at
    ) values (
      p_issuer_id, v_evid, v_subject,
      v_fw, v_fwver,
      p_payload #>> '{issuer,attested_by,actor_id}', p_payload #>> '{issuer,attested_by,role}',
      (p_payload ->> 'is_declaration')::boolean,
      p_payload #>> '{provenance,evidence_ref,kind}', p_payload #>> '{provenance,evidence_ref,id}',
      p_payload -> 'observation', p_payload ->> 'schema_version',
      p_payload ->> 'canonicalization_algorithm', p_payload ->> 'hash_algorithm',
      p_recomputed_hash,
      (p_payload ->> 'occurred_at')::timestamptz, (p_payload ->> 'attested_at')::timestamptz
    )
    returning id into v_id;
  exception when unique_violation then
    -- Course concurrente : un autre insert a gagné (même payload → même hash).
    select id into v_id from public.wsp_evidence
    where issuer_id = p_issuer_id and issuer_evidence_id = v_evid;
    return jsonb_build_object('status', 'exists', 'evidence_id', v_id, 'subject_id', v_subject);
  end;

  insert into public.wsp_evidence_demonstrates_skill (evidence_id, skill_id, framework_version, claimed_level)
  values (v_id, v_skill, v_fwver, v_claimed);

  -- D-034 : UNE preuve acceptée → EXACTEMENT UNE update de type evidence,
  -- evidence_link = le fait (lien UNIQUE). Une preuve → une update. Toujours.
  -- Transactionnel : née avec le fait, ou pas du tout.
  insert into public.wsp_passport_updates (passport_id, update_type, evidence_link)
  values (v_passport, 'evidence', v_id);

  return jsonb_build_object('status', 'accepted', 'evidence_id', v_id, 'subject_id', v_subject);
end;
$$;

comment on function public.wsp_ingest_evidence(text, text, text, text, jsonb, text) is
  'Ingestion §8 + Palier 2 : HMAC → consentement → schéma → W1 → W4 → existence → hash recalculé → cohérence §10 → idempotence §7 → (D-035) le sujet doit avoir un Passport → écriture du fait → (D-034) UNE Passport update de type evidence, indissociable du fait. Le Registry enregistre, il ne calcule jamais (Trust = palier 4).';
