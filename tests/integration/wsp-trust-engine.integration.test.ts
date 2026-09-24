/**
 * =====================================================================
 * PALIER 4 — Trust engine : Trust PAR COMPÉTENCE (OCR-105, D-041), staging LIVE.
 * =====================================================================
 * État par compétence dérivé des preuves ACTIVES selon le niveau atteint.
 * D-041 : proficient|mastery → established. Déterministe, pas de volume/score.
 *
 * ⭐ DEUX invariants opposés prouvés ensemble :
 *   • le Trust PAR COMPÉTENCE reflète l'INSTANT (monte ET descend) ;
 *   • le lifecycle est MONOTONE (Trust Established franchi ne recule jamais, D-040).
 *
 * PRÉREQUIS : migration 20260924000002_wsp_trust_engine appliquée.
 * =====================================================================
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import { admin, anonClient, createUser, waitForPassport, adminProfile, adminPassport, signIn, cleanupAllUsers } from './_harness';
import { canonicalHash } from '../../lib/wsp/canonical';
import { buildCoveredObject } from '../../lib/wsp/evidenceCovered';
import { signIssuerRequest } from '../../lib/issuer/hmac';
import { generateExchangeCode, hashLinkToken, LINK_CONSENT_VERSION, LINK_CODE_TTL_SECONDS } from '../../lib/link/issuerAuthToken';

const ISSUER = 'issuer:qa-te-x';
const SECRET = 'qa-te-secret-x-7731';
const REDIRECT = 'https://te-x.example/callback';
const ACTOR = '9a1b2c33-4d50-4e61-8f72-1a2b3c4d5e60';
const SKILL = 'wtr:212';

function uniq(p: string) {
  return `${p}_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e6).toString(36)}`;
}
async function ensureIssuer() {
  await admin.from('wsp_issuers').upsert(
    { id: ISSUER, display_name: 'QA Trust Issuer', status: 'active', redirect_uri: REDIRECT },
    { onConflict: 'id', ignoreDuplicates: true },
  );
  await admin.from('wsp_issuer_secrets').upsert({ issuer_id: ISSUER, hmac_secret: SECRET }, { onConflict: 'issuer_id' });
}
async function makeSubject(tag: string) {
  const u = await createUser({ tag, confirmed: true });
  const passport = await waitForPassport(u.id);
  if (!passport) throw new Error(`Passport non émis pour ${tag}`);
  const opus = (await adminProfile(u.id))!.opus_id as string;
  const client = await signIn(u.email, u.password);
  return { userId: u.id, opus, passportId: passport.id as string, client };
}
async function grantConsent(client: SupabaseClient) {
  const code = generateExchangeCode();
  const { error } = await client.rpc('wsp_authorize_issuer', {
    p_issuer_id: ISSUER, p_consent_text_version: LINK_CONSENT_VERSION,
    p_code_hash: hashLinkToken(code), p_redirect_uri: REDIRECT, p_ttl_seconds: LINK_CODE_TTL_SECONDS,
  });
  if (error) throw new Error(`grant: ${error.message}`);
}

/** Ingère une preuve à un NIVEAU précis (obs ↔ niveau : aware2 applied3 proficient4 mastery5). */
async function acceptAt(opus: string, level: string, obs: number): Promise<string> {
  const critKey = 'S03.C08';
  const payload: Record<string, unknown> = {
    protocol_version: '1.0', type: 'evidence', schema_version: '1.0',
    canonicalization_algorithm: 'RFC8785', hash_algorithm: 'SHA-256',
    issuer: { id: ISSUER, evidence_id: uniq('ev'), attested_by: { actor_id: ACTOR, role: 'coach' } },
    subject: { opus_id: opus }, framework: { id: 'framework:wtr', version: '0.1' },
    demonstrates: { skill_id: SKILL, claimed_level: level },
    observation: { criteria: [critKey], criterion_levels: { [critKey]: obs } },
    provenance: { evidence_ref: { kind: 'mission_result', id: 'uuid-1' } },
    occurred_at: '2026-07-20T14:32:00.000Z', attested_at: '2026-07-20T14:35:12.480Z', is_declaration: false,
  };
  payload.canonical_hash = canonicalHash(buildCoveredObject(payload)).hash;
  const raw = JSON.stringify(payload);
  const ts = Math.floor(Date.now() / 1000).toString();
  const { data, error } = await anonClient().rpc('wsp_ingest_evidence', {
    p_issuer_id: ISSUER, p_timestamp: ts, p_body: raw, p_signature: signIssuerRequest(SECRET, ts, raw),
    p_payload: payload, p_recomputed_hash: canonicalHash(buildCoveredObject(payload)).hash,
  });
  if (error) throw new Error(`ingest(${level}): ${error.message}`);
  return (data as { evidence_id: string }).evidence_id;
}
async function competency(passportId: string): Promise<{ state: string; basis_level: string | null } | null> {
  const { data } = await admin.from('wsp_competency_trust').select('state, basis_level').eq('passport_id', passportId).eq('skill_id', SKILL).maybeSingle();
  return (data as { state: string; basis_level: string | null } | null) ?? null;
}
async function stageOf(userId: string): Promise<string> {
  return (await adminPassport(userId))!.lifecycle_stage as string;
}

beforeAll(ensureIssuer);
afterAll(cleanupAllUsers);

describe('Palier 4 — Trust par compétence (OCR-105, D-041)', () => {
  it('SEUIL — aware → establishing (sous le seuil emerging)', async () => {
    const A = await makeSubject('te-a'); await grantConsent(A.client);
    await acceptAt(A.opus, 'aware', 2);
    const c = await competency(A.passportId);
    expect(c?.state).toBe('establishing');
    expect(c?.basis_level).toBe('aware');
  });

  it('SEUIL — applied → emerging (pas established : falsifie un mapping trop généreux)', async () => {
    const B = await makeSubject('te-b'); await grantConsent(B.client);
    await acceptAt(B.opus, 'applied', 3);
    expect((await competency(B.passportId))?.state).toBe('emerging');
  });

  it('SEUIL D-041 — proficient → established ET lifecycle → trust_established (lien étape 4)', async () => {
    const C = await makeSubject('te-c'); await grantConsent(C.client);
    await acceptAt(C.opus, 'proficient', 4);
    expect((await competency(C.passportId))?.state).toBe('established'); // D-041
    expect(await stageOf(C.userId)).toBe('trust_established');           // lien lifecycle (high-water)
  });

  it('⭐ NON-MONOTONIE du Trust vs MONOTONIE du lifecycle — révoquer established', async () => {
    const D = await makeSubject('te-d'); await grantConsent(D.client);
    const evId = await acceptAt(D.opus, 'proficient', 4);
    expect((await competency(D.passportId))?.state).toBe('established');
    expect(await stageOf(D.userId)).toBe('trust_established');

    // Révocation (D-036) : le Trust reflète l'instant → la compétence REDESCEND.
    const rev = await admin.from('wsp_fact_revocations').insert({
      revokes_evidence_id: evId, issuer_id: ISSUER, issuer_revocation_id: uniq('rev'),
      reason: 'palier 4 — non-monotonie Trust', revoked_by: ACTOR,
      occurred_at: new Date().toISOString(), canonical_hash: 'b'.repeat(64),
    });
    expect(rev.error).toBeNull();

    expect((await competency(D.passportId))?.state).toBe('establishing'); // Trust DESCEND (instant)
    expect(await stageOf(D.userId)).toBe('trust_established');            // lifecycle RESTE (monotone D-040)
  });

  it('verified_count BRANCHÉ — established → 1 ; après révocation → 0 (reflète le Trust réel)', async () => {
    const E = await makeSubject('te-e'); await grantConsent(E.client);
    const evId = await acceptAt(E.opus, 'mastery', 5);
    expect((await competency(E.passportId))?.state).toBe('established'); // mastery aussi (D-041)
    // owner-scopé : le sujet compte SES compétences established
    const c1 = await E.client.rpc('wsp_my_established_count');
    expect(c1.data).toBe(1);

    await admin.from('wsp_fact_revocations').insert({
      revokes_evidence_id: evId, issuer_id: ISSUER, issuer_revocation_id: uniq('rev'),
      reason: 'palier 4 — verified_count', revoked_by: ACTOR,
      occurred_at: new Date().toISOString(), canonical_hash: 'c'.repeat(64),
    });
    const c0 = await E.client.rpc('wsp_my_established_count');
    expect(c0.data).toBe(0); // le Trust réel est retombé → verified_count suit
  });
});
