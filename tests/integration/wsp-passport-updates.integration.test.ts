/**
 * =====================================================================
 * PALIER 2 — wsp_passport_updates : le Passport GRANDIT (base LIVE staging).
 * =====================================================================
 * Modèle événement général (D-034) : une preuve acceptée → EXACTEMENT une
 * update de type evidence, evidence_link UNIQUE. Révocation (D-036) : on POSE
 * revoked_at (append-only), jamais de DELETE, jamais d'update de compensation.
 *
 * FALSIFIABILITÉ : le lien unique, la contrainte de forme (evidence↔link) et
 * l'append-only sont prouvés par des tentatives qui DOIVENT échouer — casser
 * la contrainte en base ferait passer ces tentatives, et le test casserait.
 *
 * PRÉREQUIS : migration 20260831000002_wsp_passport_updates appliquée.
 * =====================================================================
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createHash } from 'node:crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  admin,
  anonClient,
  createUser,
  waitForPassport,
  adminProfile,
  adminPassport,
  signIn,
  cleanupAllUsers,
} from './_harness';
import { canonicalHash } from '../../lib/wsp/canonical';
import { buildCoveredObject } from '../../lib/wsp/evidenceCovered';
import { signIssuerRequest } from '../../lib/issuer/hmac';
import {
  generateExchangeCode,
  hashLinkToken,
  LINK_CONSENT_VERSION,
  LINK_CODE_TTL_SECONDS,
} from '../../lib/link/issuerAuthToken';

const ISSUER = 'issuer:qa-pu-x';
const SECRET = 'qa-pu-secret-x-8813';
const REDIRECT = 'https://pu-x.example/callback';
const ACTOR = '7c1a9e22-3b40-4d51-8a62-9f0e1d4b6c33';

function uniq(p: string) {
  return `${p}_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e6).toString(36)}`;
}

async function ensureIssuer(id: string, secret: string, redirect: string) {
  await admin.from('wsp_issuers').upsert(
    { id, display_name: 'QA PU Issuer', status: 'active', redirect_uri: redirect },
    { onConflict: 'id', ignoreDuplicates: true },
  );
  await admin.from('wsp_issuer_secrets').upsert({ issuer_id: id, hmac_secret: secret }, { onConflict: 'issuer_id' });
}

async function makeSubjectWithPassport(tag: string) {
  const u = await createUser({ tag, confirmed: true });
  const passport = await waitForPassport(u.id);
  if (!passport) throw new Error(`Passport non émis pour ${tag}`);
  const opus = (await adminProfile(u.id))!.opus_id as string;
  const client = await signIn(u.email, u.password);
  return { userId: u.id, opus, passportId: passport.id as string, client };
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
  if (error) throw new Error(`grant consent: ${error.message}`);
}

/** Evidence valide (Annexe A), canonical_hash inclus. */
function evidence(opusId: string, issuerId: string, evidenceId: string) {
  const critKey = 'S03.C08';
  const base: Record<string, unknown> = {
    protocol_version: '1.0',
    type: 'evidence',
    schema_version: '1.0',
    canonicalization_algorithm: 'RFC8785',
    hash_algorithm: 'SHA-256',
    issuer: { id: issuerId, evidence_id: evidenceId, attested_by: { actor_id: ACTOR, role: 'coach' } },
    subject: { opus_id: opusId },
    framework: { id: 'framework:wtr', version: '0.1' },
    demonstrates: { skill_id: 'wtr:212', claimed_level: 'applied' },
    observation: { criteria: [critKey], criterion_levels: { [critKey]: 3 } },
    provenance: { evidence_ref: { kind: 'mission_result', id: 'uuid-1' } },
    occurred_at: '2026-07-20T14:32:00.000Z',
    attested_at: '2026-07-20T14:35:12.480Z',
    is_declaration: false,
  };
  base.canonical_hash = canonicalHash(buildCoveredObject(base)).hash;
  return base;
}

/** Ingère comme l'app : recalcul JS du hash + signature HMAC. */
async function ingest(issuerId: string, secret: string, payload: Record<string, unknown>) {
  const raw = JSON.stringify(payload);
  const ts = Math.floor(Date.now() / 1000).toString();
  const sig = signIssuerRequest(secret, ts, raw);
  const recomputed = canonicalHash(buildCoveredObject(payload)).hash;
  return anonClient().rpc('wsp_ingest_evidence', {
    p_issuer_id: issuerId,
    p_timestamp: ts,
    p_body: raw,
    p_signature: sig,
    p_payload: payload,
    p_recomputed_hash: recomputed,
  });
}

async function acceptEvidence(opus: string): Promise<string> {
  const payload = evidence(opus, ISSUER, uniq('ev'));
  const { data, error } = await ingest(ISSUER, SECRET, payload);
  if (error) throw new Error(`ingest: ${error.message}`);
  expect((data as { status: string }).status).toBe('accepted');
  return (data as { evidence_id: string }).evidence_id;
}

async function updatesForEvidence(evidenceId: string) {
  const { data } = await admin
    .from('wsp_passport_updates')
    .select('*')
    .eq('evidence_link', evidenceId);
  return data ?? [];
}

let A: { userId: string; opus: string; passportId: string; client: SupabaseClient };

beforeAll(async () => {
  await ensureIssuer(ISSUER, SECRET, REDIRECT);
  A = await makeSubjectWithPassport('pu-a');
  await grantConsent(A.client, ISSUER, REDIRECT);
});

afterAll(cleanupAllUsers);

describe('Palier 2 — wsp_passport_updates : une preuve → une update', () => {
  it('preuve ACCEPTÉE → EXACTEMENT 1 update evidence, evidence_link correct, sur le bon Passport', async () => {
    const evId = await acceptEvidence(A.opus);
    const rows = await updatesForEvidence(evId);
    expect(rows).toHaveLength(1);
    expect(rows[0].update_type).toBe('evidence');
    expect(rows[0].evidence_link).toBe(evId);
    expect(rows[0].passport_id).toBe(A.passportId);
    expect(rows[0].revoked_at).toBeNull();
  });

  it('2e preuve pour le MÊME sujet → 2e update DISTINCTE (pas d’écrasement)', async () => {
    const ev1 = await acceptEvidence(A.opus);
    const ev2 = await acceptEvidence(A.opus);
    expect(ev1).not.toBe(ev2);
    const u1 = (await updatesForEvidence(ev1))[0];
    const u2 = (await updatesForEvidence(ev2))[0];
    expect(u1.id).not.toBe(u2.id); // deux updates, deux identités
    expect(u1.evidence_link).toBe(ev1);
    expect(u2.evidence_link).toBe(ev2);
    // le Passport porte AU MOINS ces 2 updates (accumulation append-only)
    const { count } = await admin
      .from('wsp_passport_updates')
      .select('id', { count: 'exact', head: true })
      .eq('passport_id', A.passportId);
    expect(count ?? 0).toBeGreaterThanOrEqual(2);
  });

  it('CONTRAINTE UNIQUE — 2e update avec le MÊME evidence_link → REJET (23505)', async () => {
    const evId = await acceptEvidence(A.opus); // a déjà 1 update
    const dup = await admin
      .from('wsp_passport_updates')
      .insert({ passport_id: A.passportId, update_type: 'evidence', evidence_link: evId });
    expect(dup.error).not.toBeNull();
    expect(dup.error!.code).toBe('23505'); // unique_violation
  });

  it('CONTRAINTE CHECK — update NON-evidence AVEC evidence_link → REJET (23514)', async () => {
    const evId = await acceptEvidence(A.opus);
    const bad = await admin
      .from('wsp_passport_updates')
      .insert({ passport_id: A.passportId, update_type: 'disclosure', evidence_link: evId });
    expect(bad.error).not.toBeNull();
    expect(bad.error!.code).toBe('23514'); // check_violation (forme evidence↔link)
  });

  it('CONTRAINTE CHECK — update evidence SANS evidence_link → REJET (23514)', async () => {
    const bad = await admin
      .from('wsp_passport_updates')
      .insert({ passport_id: A.passportId, update_type: 'evidence', evidence_link: null });
    expect(bad.error).not.toBeNull();
    expect(bad.error!.code).toBe('23514');
  });

  it('RÉVOCATION (D-036) → revoked_at POSÉ, ligne PRÉSERVÉE (pas de DELETE)', async () => {
    const evId = await acceptEvidence(A.opus);
    const before = (await updatesForEvidence(evId))[0];
    expect(before.revoked_at).toBeNull();

    const rev = await admin.from('wsp_fact_revocations').insert({
      revokes_evidence_id: evId,
      issuer_id: ISSUER,
      issuer_revocation_id: uniq('rev'),
      reason: 'palier 2 — preuve D-036',
      revoked_by: ACTOR,
      occurred_at: new Date().toISOString(),
      canonical_hash: 'f'.repeat(64),
    });
    expect(rev.error).toBeNull();

    const after = await updatesForEvidence(evId);
    expect(after).toHaveLength(1); // ligne préservée : jamais de DELETE
    expect(after[0].id).toBe(before.id); // MÊME ligne, marquée
    expect(after[0].revoked_at).not.toBeNull(); // marque posée
  });

  it('APPEND-ONLY — DELETE d’une update REFUSÉ ; modif d’une colonne factuelle REFUSÉE', async () => {
    const evId = await acceptEvidence(A.opus);
    const u = (await updatesForEvidence(evId))[0];

    const del = await admin.from('wsp_passport_updates').delete().eq('id', u.id);
    expect(del.error).not.toBeNull(); // append-only : pas de DELETE

    const mut = await admin.from('wsp_passport_updates').update({ evidence_link: null }).eq('id', u.id);
    expect(mut.error).not.toBeNull(); // seul revoked_at peut changer
  });
});
