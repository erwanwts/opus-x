/**
 * =====================================================================
 * D-040 — avancée du lifecycle, JALON MONOTONE (high-water mark), staging LIVE.
 * =====================================================================
 * L'étape avance vers la plus haute étape BASSE atteignable et ne recule JAMAIS.
 * Une révocation (D-036) n'affecte que le contenu (skills/evidence actifs), pas
 * le jalon. Étapes basses seulement (≤ skills_emerging) ; étapes hautes = palier 4.
 *
 * ⚠️ MESURÉ : toute preuve ingérée porte OBLIGATOIREMENT une skill (demonstrates
 * requis, schéma). Donc la 1re preuve satisfait déjà skills_emerging → l'étape
 * SAUTE 1→3 (clause de saut, D-040). receiving_evidence (2) n'est un état de repos
 * qu'avec une preuve SANS skill — testée ici en isolation (insert direct).
 *
 * PRÉREQUIS : migration 20260924000001_wsp_lifecycle_advance appliquée.
 * =====================================================================
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import { admin, anonClient, createUser, waitForPassport, adminProfile, adminPassport, signIn, cleanupAllUsers } from './_harness';
import { canonicalHash } from '../../lib/wsp/canonical';
import { buildCoveredObject } from '../../lib/wsp/evidenceCovered';
import { signIssuerRequest } from '../../lib/issuer/hmac';
import { generateExchangeCode, hashLinkToken, LINK_CONSENT_VERSION, LINK_CODE_TTL_SECONDS } from '../../lib/link/issuerAuthToken';

const ISSUER = 'issuer:qa-lc-x';
const SECRET = 'qa-lc-secret-x-6620';
const REDIRECT = 'https://lc-x.example/callback';
const ACTOR = '3e2d1c00-9a80-4b71-8c62-4f0a6d5b1a22';
const SKILL = 'wtr:212';

function uniq(p: string) {
  return `${p}_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e6).toString(36)}`;
}

async function ensureIssuer() {
  await admin.from('wsp_issuers').upsert(
    { id: ISSUER, display_name: 'QA Lifecycle Issuer', status: 'active', redirect_uri: REDIRECT },
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
    p_issuer_id: ISSUER,
    p_consent_text_version: LINK_CONSENT_VERSION,
    p_code_hash: hashLinkToken(code),
    p_redirect_uri: REDIRECT,
    p_ttl_seconds: LINK_CODE_TTL_SECONDS,
  });
  if (error) throw new Error(`grant consent: ${error.message}`);
}

/** Ingère une preuve VALIDE (porte donc une skill) pour un sujet. */
async function acceptEvidence(opus: string): Promise<string> {
  const critKey = 'S03.C08';
  const payload: Record<string, unknown> = {
    protocol_version: '1.0', type: 'evidence', schema_version: '1.0',
    canonicalization_algorithm: 'RFC8785', hash_algorithm: 'SHA-256',
    issuer: { id: ISSUER, evidence_id: uniq('ev'), attested_by: { actor_id: ACTOR, role: 'coach' } },
    subject: { opus_id: opus },
    framework: { id: 'framework:wtr', version: '0.1' },
    demonstrates: { skill_id: SKILL, claimed_level: 'applied' },
    observation: { criteria: [critKey], criterion_levels: { [critKey]: 3 } },
    provenance: { evidence_ref: { kind: 'mission_result', id: 'uuid-1' } },
    occurred_at: '2026-07-20T14:32:00.000Z', attested_at: '2026-07-20T14:35:12.480Z', is_declaration: false,
  };
  payload.canonical_hash = canonicalHash(buildCoveredObject(payload)).hash;
  const raw = JSON.stringify(payload);
  const ts = Math.floor(Date.now() / 1000).toString();
  const { data, error } = await anonClient().rpc('wsp_ingest_evidence', {
    p_issuer_id: ISSUER, p_timestamp: ts, p_body: raw,
    p_signature: signIssuerRequest(SECRET, ts, raw),
    p_payload: payload, p_recomputed_hash: canonicalHash(buildCoveredObject(payload)).hash,
  });
  if (error) throw new Error(`ingest: ${error.message}`);
  return (data as { evidence_id: string }).evidence_id;
}

async function stageOf(userId: string): Promise<string> {
  return (await adminPassport(userId))!.lifecycle_stage as string;
}

beforeAll(ensureIssuer);
afterAll(cleanupAllUsers);

describe('D-040 — avancée du lifecycle, jalon monotone (high-water mark)', () => {
  it('1re preuve (porte une skill) → SAUTE à skills_emerging (clause de saut, D-040)', async () => {
    const A = await makeSubject('lc-a');
    expect(await stageOf(A.userId)).toBe('identity_established'); // départ (émission)
    await grantConsent(A.client);
    await acceptEvidence(A.opus);
    expect(await stageOf(A.userId)).toBe('skills_emerging'); // saut 1→3 : evidence + skill
  });

  it('receiving_evidence en ISOLATION — preuve SANS skill → l’étape s’arrête à receiving_evidence', async () => {
    const B = await makeSubject('lc-b');
    // Preuve directe SANS demonstrates_skill (impossible via l'ingestion) → evidence
    // actif = 1, skill actif = 0. Le trigger d'avancée doit viser receiving_evidence.
    const ev = await admin.from('wsp_evidence').insert({
      issuer_id: ISSUER, issuer_evidence_id: uniq('skl'), subject_id: B.opus,
      framework_id: 'framework:wtr', framework_version: '0.1',
      attested_by_actor_id: ACTOR, attested_by_role: 'coach', is_declaration: false,
      provenance_kind: 'mission_result', provenance_id: 'uuid-1',
      observation: { criteria: [], criterion_levels: {} },
      schema_version: '1.0', canonicalization_algorithm: 'RFC8785', hash_algorithm: 'SHA-256',
      canonical_hash: 'd'.repeat(64), occurred_at: '2026-07-20T14:32:00.000Z', attested_at: '2026-07-20T14:35:12.480Z',
    }).select('id').single();
    expect(ev.error).toBeNull();
    const pu = await admin.from('wsp_passport_updates').insert({
      passport_id: B.passportId, update_type: 'evidence', evidence_link: (ev.data as { id: string }).id,
    });
    expect(pu.error).toBeNull();
    expect(await stageOf(B.userId)).toBe('receiving_evidence'); // evidence sans skill : s'arrête à 2
  });

  it('⭐ MONOTONIE — révoquer la preuve (0 skill/0 evidence actif) → l’étape RESTE skills_emerging', async () => {
    const C = await makeSubject('lc-c');
    await grantConsent(C.client);
    const evId = await acceptEvidence(C.opus);
    expect(await stageOf(C.userId)).toBe('skills_emerging');

    // Révocation = fait nouveau (D-036) : marque l'update, rend la skill inactive.
    const rev = await admin.from('wsp_fact_revocations').insert({
      revokes_evidence_id: evId, issuer_id: ISSUER, issuer_revocation_id: uniq('rev'),
      reason: 'D-040 test monotonie', revoked_by: ACTOR,
      occurred_at: new Date().toISOString(), canonical_hash: 'a'.repeat(64),
    });
    expect(rev.error).toBeNull();

    // DÉCISIF : le jalon ne recule pas, même contenu vidé.
    expect(await stageOf(C.userId)).toBe('skills_emerging');
    // Et même en FORÇANT un recalcul, le high-water mark tient (cible < courant → rien).
    const forced = await admin.rpc('wsp_advance_lifecycle', { p_passport_id: C.passportId });
    expect(forced.error).toBeNull();
    expect(await stageOf(C.userId)).toBe('skills_emerging');
  });

  it('MUTATION structurelle — faire reculer l’étape en base → le trigger REJETTE', async () => {
    const D = await makeSubject('lc-d');
    await grantConsent(D.client);
    await acceptEvidence(D.opus);
    expect(await stageOf(D.userId)).toBe('skills_emerging');

    // Tentative directe de descente : le garde wsp_lifecycle_no_regress doit lever.
    const down = await admin.from('passports').update({ lifecycle_stage: 'identity_established' }).eq('id', D.passportId);
    expect(down.error).not.toBeNull(); // rejet structurel (pas une convention)
    expect(await stageOf(D.userId)).toBe('skills_emerging'); // inchangé
  });

  it('AUCUNE étape HAUTE — le mécanisme ne dépasse jamais skills_emerging (pas de trust engine)', async () => {
    const E = await makeSubject('lc-e');
    await grantConsent(E.client);
    await acceptEvidence(E.opus);
    await acceptEvidence(E.opus); // 2e preuve : toujours étape basse
    const stage = await stageOf(E.userId);
    expect(['identity_established', 'receiving_evidence', 'skills_emerging']).toContain(stage);
    expect(['trust_established', 'passport_verified', 'trusted_professional', 'authority']).not.toContain(stage);
  });
});
