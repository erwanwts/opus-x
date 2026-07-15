-- =====================================================================
-- Opus X — Sprint 2 — LOT O2b : L'INGESTION · « Trust Is Verified »
-- Autorités : SPRINT-002 (Lot O2, W1–W7, D6) · ENG-002 v0.2 §5,§6,§7,§8,§9,§10.
--
-- Le point où Opus X devient un TIERS DE CONFIANCE. L'ordre de vérification
-- (ENG-002 §8) est NORMATIF — aucune étape ne se réordonne, aucune ne se saute.
-- Le recalcul du hash (étape 7) se fait EN JS (RFC 8785, lib/wsp/canonical) ;
-- ce RPC reçoit le hash RECALCULÉ par Opus X et le COMPARE au reçu (§8.1/§8.2).
--
-- « Le Registry enregistre ; il ne calcule JAMAIS. » (WSP-001 §13.3)
-- =====================================================================

-- ---------------------------------------------------------------------
-- W1 — détection récursive d'un champ interdit (score de confiance, indice,
-- prétention de certification). Aucun champ §6.1 ne matche ce motif.
-- ---------------------------------------------------------------------
create or replace function public.wsp_has_forbidden_field(p jsonb)
returns boolean
language plpgsql
immutable
set search_path = ''
as $$
declare
  k text;
  v jsonb;
begin
  if jsonb_typeof(p) = 'object' then
    for k, v in select key, value from jsonb_each(p) loop
      if k ~* '(trust|confidence|certif|score|index)' then
        return true;
      end if;
      if public.wsp_has_forbidden_field(v) then
        return true;
      end if;
    end loop;
  elsif jsonb_typeof(p) = 'array' then
    for v in select value from jsonb_array_elements(p) loop
      if public.wsp_has_forbidden_field(v) then
        return true;
      end if;
    end loop;
  end if;
  return false;
end;
$$;

comment on function public.wsp_has_forbidden_field(jsonb) is
  'W1 : true si le payload contient un champ de confiance / indice / certification (récursif). Aucun champ §6.1 ne matche.';

revoke all on function public.wsp_has_forbidden_field(jsonb) from public, anon, authenticated;

-- =====================================================================
-- wsp_ingest_evidence — les 10 étapes de l'ordre §8, dans l'ordre, atomiques.
--   p_body            : le corps brut (base du HMAC de l'Issuer)
--   p_payload         : le même, parsé (jsonb)
--   p_recomputed_hash : le hash RECALCULÉ par Opus X (JS/JCS) — jamais le reçu
--
-- Rejets : une exception dont le message est le CODE. Deux familles :
--   • NON-ÉNUMÉRANTS (mêmes réponses) : 'unauthorized' (étape 1),
--     'rejected' (étapes 2 & 6 — consentement/existence indistinguables).
--   • EXPLICITES : schema_invalid, forbidden_field (W1), missing_provenance
--     (W4), canonical_hash_mismatch, observation_invalid,
--     below_emission_threshold, claimed_level_incoherent,
--     evidence_integrity_conflict.
-- =====================================================================
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

  -- ── ÉTAPE 10 — Écrire le fait, append-only. ET RIEN D'AUTRE. ────────────
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

  return jsonb_build_object('status', 'accepted', 'evidence_id', v_id, 'subject_id', v_subject);
end;
$$;

comment on function public.wsp_ingest_evidence(text, text, text, text, jsonb, text) is
  'Ingestion §8 (ordre normatif) : HMAC → consentement → schéma → W1 → W4 → existence → hash recalculé → cohérence §10 → idempotence §7 → écriture append-only. Le Registry enregistre, il ne calcule jamais.';

revoke all on function public.wsp_ingest_evidence(text, text, text, text, jsonb, text) from public;
-- Serveur à serveur (l'Issuer n'est pas un utilisateur Supabase) : la sécurité
-- est le HMAC vérifié À L'INTÉRIEUR (étape 1), pas l'appartenance d'un rôle.
grant execute on function public.wsp_ingest_evidence(text, text, text, text, jsonb, text) to anon, authenticated;
