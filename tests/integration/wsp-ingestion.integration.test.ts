/**
 * =====================================================================
 * LOT O2b — L'INGESTION · « Trust Is Verified » (base LIVE staging).
 * =====================================================================
 * Le test joue l'APP : il construit l'objet couvert (§6.1), RECALCULE le hash
 * (JS/JCS), signe en HMAC, et appelle wsp_ingest_evidence — l'ordre §8 complet.
 *
 * ⚠️ CHEMIN HEUREUX D'ABORD. Une suite entièrement négative validerait un
 * système entièrement mort (leçon du search_path cassé).
 *
 * PRÉREQUIS : migrations …0003, …0004, …0005 appliquées.
 * =====================================================================
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { createHash } from 'node:crypto';
import { admin, anonClient, createUser, signIn, waitForPassport, adminProfile } from './_harness';
import { canonicalHash } from '../../lib/wsp/canonical';
import { buildCoveredObject } from '../../lib/wsp/evidenceCovered';
import { signIssuerRequest } from '../../lib/issuer/hmac';
import {
  generateExchangeCode,
  hashLinkToken,
  LINK_CONSENT_VERSION,
  LINK_CODE_TTL_SECONDS,
} from '../../lib/link/issuerAuthToken';
import type { SupabaseClient } from '@supabase/supabase-js';

const ISSUER = 'issuer:qa-ingest-x';
const ISSUER_B = 'issuer:qa-ingest-b';
const SECRET = 'qa-ingest-secret-x-7d21';
const SECRET_B = 'qa-ingest-secret-b-4a90';
const REDIRECT = 'https://ingest-x.example/callback';
const REDIRECT_B = 'https://ingest-b.example/callback';
const ACTOR = '8f2b1c44-0e91-4a7d-9c33-1b6f0d5a77e2';

function uniq(p: string) {
  return `${p}_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e6).toString(36)}`;
}

async function ensureIssuer(id: string, secret: string, redirect: string) {
  await admin
    .from('wsp_issuers')
    .upsert({ id, display_name: 'QA Issuer', status: 'active', redirect_uri: redirect }, { onConflict: 'id', ignoreDuplicates: true });
  await admin.from('wsp_issuer_secrets').upsert({ issuer_id: id, hmac_secret: secret }, { onConflict: 'issuer_id' });
}

async function makeSubject(tag: string): Promise<{ opus: string; client: SupabaseClient }> {
  const u = await createUser({ tag, confirmed: true });
  await waitForPassport(u.id);
  const opus = (await adminProfile(u.id))!.opus_id as string;
  const client = await signIn(u.email, u.password);
  return { opus, client };
}

async function grantConsent(client: SupabaseClient, issuerId: string, redirect: string) {
  const code = generateExchangeCode();
  const { error } = await client.rpc('wsp_authorize_issuer', {
    p_issuer_id: issuerId,
    p_consent_text_version: LINK_CONSENT_VERSION,
    p_code_hash: hashLinkToken(code),
    p_redirect_uri: redirect,
    p_ttl_seconds: LINK_CODE_TTL_SECONDS,
  });
  if (error) throw new Error(`grant: ${error.message}`);
}

/** Construit une Evidence VALIDE (Annexe A), canonical_hash inclus. */
function evidence(opusId: string, issuerId: string, o: Partial<{
  evidenceId: string; claimed: string; obs: number; critKey: string; criteria: string[]; skill: string;
  occurredAt: string; hashOverride: string; extra: Record<string, unknown>; provenance: unknown;
}> = {}) {
  const critKey = o.critKey ?? 'S03.C08';
  const base: Record<string, unknown> = {
    protocol_version: '1.0',
    type: 'evidence',
    schema_version: '1.0',
    canonicalization_algorithm: 'RFC8785',
    hash_algorithm: 'SHA-256',
    issuer: { id: issuerId, evidence_id: o.evidenceId ?? uniq('pu'), attested_by: { actor_id: ACTOR, role: 'coach' } },
    subject: { opus_id: opusId },
    framework: { id: 'framework:wtr', version: '0.1' },
    demonstrates: { skill_id: o.skill ?? 'wtr:212', claimed_level: o.claimed ?? 'applied' },
    observation: { criteria: o.criteria ?? [critKey], criterion_levels: { [critKey]: o.obs ?? 3 } },
    provenance: o.provenance ?? { evidence_ref: { kind: 'mission_result', id: 'uuid-1' } },
    occurred_at: o.occurredAt ?? '2026-07-20T14:32:00.000Z',
    attested_at: '2026-07-20T14:35:12.480Z',
    is_declaration: false,
    ...(o.extra ?? {}),
  };
  let hash = '';
  try {
    hash = canonicalHash(buildCoveredObject(base)).hash;
  } catch {
    hash = '';
  }
  base.canonical_hash = o.hashOverride ?? hash;
  return base;
}

/** Envoie l'Evidence comme le ferait l'app : recalcul JS + signature HMAC. */
async function ingest(issuerId: string, secret: string, payload: Record<string, unknown>) {
  const raw = JSON.stringify(payload);
  const ts = Math.floor(Date.now() / 1000).toString();
  const sig = signIssuerRequest(secret, ts, raw);
  let recomputed = '';
  try {
    recomputed = canonicalHash(buildCoveredObject(payload)).hash;
  } catch {
    recomputed = '';
  }
  return anonClient().rpc('wsp_ingest_evidence', {
    p_issuer_id: issuerId,
    p_timestamp: ts,
    p_body: raw,
    p_signature: sig,
    p_payload: payload,
    p_recomputed_hash: recomputed,
  });
}

/**
 * Recalcul du hash INDÉPENDANT de lib/wsp : objet couvert §6.1 reconstruit à la
 * main, canonicalisé par tri récursif des clés (≡ JCS pour des nombres ENTIERS,
 * seul cas du payload), haché en SHA-256 via node:crypto. Si la lib (build ou
 * canonicalize) déviait, cette valeur différerait de celle en base.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function independentHash(p: any): string {
  const covered = {
    schema_version: p.schema_version,
    canonicalization_algorithm: p.canonicalization_algorithm,
    hash_algorithm: p.hash_algorithm,
    issuer: {
      id: p.issuer.id,
      evidence_id: p.issuer.evidence_id,
      attested_by: { actor_id: p.issuer.attested_by.actor_id, role: p.issuer.attested_by.role },
    },
    subject: { opus_id: p.subject.opus_id },
    framework: { id: p.framework.id, version: p.framework.version },
    demonstrates: { skill_id: p.demonstrates.skill_id, claimed_level: p.demonstrates.claimed_level },
    observation: {
      criteria: [...p.observation.criteria].sort(),
      criterion_levels: p.observation.criterion_levels,
    },
    provenance: {
      evidence_ref: { kind: p.provenance.evidence_ref.kind, id: p.provenance.evidence_ref.id },
    },
    occurred_at: new Date(p.occurred_at).toISOString(),
    attested_at: new Date(p.attested_at).toISOString(),
    is_declaration: p.is_declaration,
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sortDeep = (v: any): any =>
    Array.isArray(v)
      ? v.map(sortDeep)
      : v && typeof v === 'object'
        ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, sortDeep(v[k])]))
        : v;
  return createHash('sha256').update(JSON.stringify(sortDeep(covered)), 'utf8').digest('hex');
}

async function storedHash(evidenceRowId: string): Promise<string | undefined> {
  const { data } = await admin.from('wsp_evidence').select('canonical_hash').eq('id', evidenceRowId).maybeSingle();
  return data?.canonical_hash as string | undefined;
}

async function evidenceCount(issuerId: string, evidenceId: string): Promise<number> {
  const { count } = await admin
    .from('wsp_evidence')
    .select('id', { count: 'exact', head: true })
    .eq('issuer_id', issuerId)
    .eq('issuer_evidence_id', evidenceId);
  return count ?? 0;
}

let A: { opus: string; client: SupabaseClient };

beforeAll(async () => {
  await ensureIssuer(ISSUER, SECRET, REDIRECT);
  await ensureIssuer(ISSUER_B, SECRET_B, REDIRECT_B);
  A = await makeSubject('ing-a');
  await grantConsent(A.client, ISSUER, REDIRECT);
});

describe('O2b — CHEMIN HEUREUX (celui-ci d’abord)', () => {
  it('Evidence valide → ACCEPTÉE ; le hash STOCKÉ EST le hash RECALCULÉ (réel, non constant)', async () => {
    const evId = uniq('pu');
    const payload = evidence(A.opus, ISSUER, { evidenceId: evId });
    const recomputed = canonicalHash(buildCoveredObject(payload)).hash;

    const { data, error } = await ingest(ISSUER, SECRET, payload);
    expect(error).toBeNull();
    expect(data.status).toBe('accepted');
    expect(data.subject_id).toBe(A.opus);

    const { data: fact } = await admin
      .from('wsp_evidence')
      .select('subject_id, canonical_hash, issuer_evidence_id')
      .eq('id', data.evidence_id)
      .maybeSingle();
    expect(fact?.subject_id).toBe(A.opus);
    expect(fact?.issuer_evidence_id).toBe(evId);

    // LE CŒUR : le hash stocké EST le hash recalculé par Opus X (§8.2), un vrai
    // SHA-256 — jamais une constante en dur (le piège des fixtures d'O1).
    expect(fact?.canonical_hash).toBe(recomputed);
    expect(fact?.canonical_hash).toMatch(/^[0-9a-f]{64}$/);
    expect(fact?.canonical_hash).not.toBe('a'.repeat(64));
    // INDÉPENDANT de lib/wsp : recalcul par un canonicaliseur tiers (tri
    // récursif + node:crypto). Non circulaire — valide la lib, pas elle-même.
    expect(fact?.canonical_hash).toBe(independentHash(payload));

    // La relation « démontre » existe.
    const { data: dem } = await admin
      .from('wsp_evidence_demonstrates_skill')
      .select('skill_id, claimed_level')
      .eq('evidence_id', data.evidence_id)
      .maybeSingle();
    expect(dem).toMatchObject({ skill_id: 'wtr:212', claimed_level: 'applied' });

    // Le SUJET lit son fait (RLS).
    const mine = await A.client.from('wsp_evidence').select('id').eq('id', data.evidence_id);
    expect((mine.data ?? []).length).toBe(1);
  });

  it('deux Evidence de contenu différent → hash DIFFÉRENTS (le hash reflète le fait)', async () => {
    const p1 = evidence(A.opus, ISSUER, { occurredAt: '2026-07-20T14:32:00.000Z' });
    const p2 = evidence(A.opus, ISSUER, { occurredAt: '2026-07-21T09:00:00.000Z' });
    const r1 = await ingest(ISSUER, SECRET, p1);
    const r2 = await ingest(ISSUER, SECRET, p2);
    expect(r1.data.status).toBe('accepted');
    expect(r2.data.status).toBe('accepted');

    const h1 = await storedHash(r1.data.evidence_id);
    const h2 = await storedHash(r2.data.evidence_id);
    expect(h1).not.toBe(h2); // un contenu différent ⇒ un hash différent
    // Et chaque hash STOCKÉ == le recalcul indépendant du payload correspondant.
    expect(h1).toBe(independentHash(p1));
    expect(h2).toBe(independentHash(p2));
  });

  it('un payload dont UN SEUL octet change → hash DIFFÉRENT (sensibilité)', async () => {
    const base = evidence(A.opus, ISSUER);
    const flipped = JSON.parse(JSON.stringify(base));
    const a: string = flipped.issuer.attested_by.actor_id;
    flipped.issuer.attested_by.actor_id = a.slice(0, -1) + (a.endsWith('2') ? '3' : '2'); // 1 octet

    // Un octet change ⇒ hash différent, par les DEUX méthodes (indépendante & lib).
    expect(independentHash(base)).not.toBe(independentHash(flipped));
    expect(canonicalHash(buildCoveredObject(base)).hash).not.toBe(
      canonicalHash(buildCoveredObject(flipped)).hash
    );
    // Cohérence croisée : le recalcul INDÉPENDANT == la lib (non circulaire).
    expect(independentHash(base)).toBe(canonicalHash(buildCoveredObject(base)).hash);
  });
});

describe('O2b — authentification & consentement (étapes 1–2)', () => {
  it('HMAC invalide → unauthorized, aucune écriture', async () => {
    const evId = uniq('pu');
    const p = evidence(A.opus, ISSUER, { evidenceId: evId });
    const raw = JSON.stringify(p);
    const ts = Math.floor(Date.now() / 1000).toString();
    const badSig = signIssuerRequest('mauvais-secret', ts, raw);
    const res = await anonClient().rpc('wsp_ingest_evidence', {
      p_issuer_id: ISSUER, p_timestamp: ts, p_body: raw, p_signature: badSig,
      p_payload: p, p_recomputed_hash: canonicalHash(buildCoveredObject(p)).hash,
    });
    expect(res.error?.message).toContain('unauthorized');
    expect(await evidenceCount(ISSUER, evId)).toBe(0);
  });

  it('Issuer inconnu → unauthorized', async () => {
    const res = await ingest('issuer:ghost', SECRET, evidence(A.opus, 'issuer:ghost'));
    expect(res.error?.message).toContain('unauthorized');
  });

  it('sans consentement actif → rejected (W6), aucune écriture', async () => {
    const noConsent = await makeSubject('ing-noconsent');
    const evId = uniq('pu');
    const res = await ingest(ISSUER, SECRET, evidence(noConsent.opus, ISSUER, { evidenceId: evId }));
    expect(res.error?.message).toContain('rejected');
    expect(await evidenceCount(ISSUER, evId)).toBe(0);
  });

  it('après révocation → rejected ; les faits antérieurs restent INTACTS', async () => {
    const s = await makeSubject('ing-revoke');
    await grantConsent(s.client, ISSUER, REDIRECT);
    const first = await ingest(ISSUER, SECRET, evidence(s.opus, ISSUER));
    expect(first.data.status).toBe('accepted');

    await s.client.rpc('wsp_revoke_issuer', { p_issuer_id: ISSUER, p_consent_text_version: LINK_CONSENT_VERSION });
    const after = await ingest(ISSUER, SECRET, evidence(s.opus, ISSUER));
    expect(after.error?.message).toContain('rejected');

    // Le fait antérieur demeure.
    const { data } = await admin.from('wsp_evidence').select('id').eq('id', first.data.evidence_id).maybeSingle();
    expect(data?.id).toBe(first.data.evidence_id);
  });

  it('consentement pour X, un autre Issuer émet → rejected (P4)', async () => {
    // A a consenti à ISSUER, pas à ISSUER_B.
    const res = await ingest(ISSUER_B, SECRET_B, evidence(A.opus, ISSUER_B));
    expect(res.error?.message).toContain('rejected');
  });
});

describe('O2b — W1 / W4 / hash / cohérence (étapes 4–8)', () => {
  it('trust_score dans le payload → forbidden_field (W1)', async () => {
    const p = evidence(A.opus, ISSUER, { extra: { trust_score: 0.9 } });
    const res = await ingest(ISSUER, SECRET, p);
    expect(res.error?.message).toContain('forbidden_field');
  });

  it('prétention de certification → forbidden_field (W1)', async () => {
    const p = evidence(A.opus, ISSUER, { extra: { certification: 'certified' } });
    const res = await ingest(ISSUER, SECRET, p);
    expect(res.error?.message).toContain('forbidden_field');
  });

  it('sans evidence_ref → missing_provenance (W4)', async () => {
    const p = evidence(A.opus, ISSUER, { provenance: {} });
    const res = await ingest(ISSUER, SECRET, p);
    expect(res.error?.message).toContain('missing_provenance');
  });

  it('canonical_hash falsifié → canonical_hash_mismatch', async () => {
    const p = evidence(A.opus, ISSUER, { hashOverride: 'f'.repeat(64) });
    const res = await ingest(ISSUER, SECRET, p);
    expect(res.error?.message).toContain('canonical_hash_mismatch');
  });

  it('claimed_level incohérent → claimed_level_incoherent', async () => {
    const p = evidence(A.opus, ISSUER, { obs: 3, claimed: 'mastery' }); // 3 ⇒ applied
    const res = await ingest(ISSUER, SECRET, p);
    expect(res.error?.message).toContain('claimed_level_incoherent');
  });

  it('observation en bande 0–1 → below_emission_threshold', async () => {
    const p = evidence(A.opus, ISSUER, { obs: 1, claimed: 'aware' });
    const res = await ingest(ISSUER, SECRET, p);
    expect(res.error?.message).toContain('below_emission_threshold');
  });
});

describe('O2b — existence non-énumérante (étape 6)', () => {
  it('Skill inconnue → rejected', async () => {
    const p = evidence(A.opus, ISSUER, { skill: 'wtr:999' });
    const res = await ingest(ISSUER, SECRET, p);
    expect(res.error?.message).toContain('rejected');
  });

  it('sujet inexistant ≡ sujet sans consentement (même réponse, non-énumérant)', async () => {
    const ghost = await ingest(ISSUER, SECRET, evidence('opx_0000000000000000000000000', ISSUER));
    const noConsent = await makeSubject('ing-nc2');
    const nc = await ingest(ISSUER, SECRET, evidence(noConsent.opus, ISSUER));
    expect(ghost.error?.message).toBe(nc.error?.message);
  });
});

describe('O2b — idempotence (étapes 9–10)', () => {
  it('double envoi → UNE SEULE Evidence', async () => {
    const evId = uniq('pu');
    const p = evidence(A.opus, ISSUER, { evidenceId: evId });
    const first = await ingest(ISSUER, SECRET, p);
    const second = await ingest(ISSUER, SECRET, p);
    expect(first.data.status).toBe('accepted');
    expect(second.data.status).toBe('exists');
    expect(await evidenceCount(ISSUER, evId)).toBe(1);
  });

  it('envoi concurrent ×5 → UNE SEULE Evidence', async () => {
    const evId = uniq('pu');
    const p = evidence(A.opus, ISSUER, { evidenceId: evId });
    const results = await Promise.all(Array.from({ length: 5 }, () => ingest(ISSUER, SECRET, p)));
    const accepted = results.filter((r) => r.data?.status === 'accepted');
    expect(accepted).toHaveLength(1);
    expect(await evidenceCount(ISSUER, evId)).toBe(1);
  });

  it('même identité, hash différent → evidence_integrity_conflict', async () => {
    const evId = uniq('pu');
    const first = await ingest(ISSUER, SECRET, evidence(A.opus, ISSUER, { evidenceId: evId }));
    expect(first.data.status).toBe('accepted');
    // Même issuer_evidence_id, contenu différent (occurred_at) ⇒ hash différent.
    const conflicting = evidence(A.opus, ISSUER, { evidenceId: evId, occurredAt: '2026-07-21T09:00:00.000Z' });
    const res = await ingest(ISSUER, SECRET, conflicting);
    expect(res.error?.message).toContain('evidence_integrity_conflict');
    expect(await evidenceCount(ISSUER, evId)).toBe(1);
  });
});
