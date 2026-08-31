/**
 * =====================================================================
 * PALIER 3 (skills, #5) — la source des skills rebranchée (base LIVE staging).
 * =====================================================================
 * On lit les compétences depuis la source RÉELLE (wsp_evidence_demonstrates_skill,
 * preuves acceptées) au lieu de la table Sprint-1 vide. D-036 : preuves révoquées
 * EXCLUES. Owner-scopé : `wsp_my_active_skills()` rend les skills du CALLER.
 *
 * FALSIFIABILITÉ : le test assère qu'un skill PRÉCIS (wtr:212) APPARAÎT depuis la
 * source réelle — si la fonction lisait la table vide (public.skills), elle
 * rendrait [] et le test casserait. La révocation le fait DISPARAÎTRE (D-036).
 *
 * PRÉREQUIS : migration 20260901000001_wsp_skills_source appliquée.
 * =====================================================================
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  admin,
  anonClient,
  createUser,
  waitForPassport,
  adminProfile,
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
import { DashboardService } from '../../lib/dashboard/DashboardService';

const ISSUER = 'issuer:qa-skills-x';
const SECRET = 'qa-skills-secret-x-4471';
const REDIRECT = 'https://skills-x.example/callback';
const ACTOR = '5d3f2a11-7c80-4e62-9b41-2a0e6d5c8b44';
const SKILL = 'wtr:212';

function uniq(p: string) {
  return `${p}_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e6).toString(36)}`;
}

async function ensureIssuer(id: string, secret: string, redirect: string) {
  await admin.from('wsp_issuers').upsert(
    { id, display_name: 'QA Skills Issuer', status: 'active', redirect_uri: redirect },
    { onConflict: 'id', ignoreDuplicates: true },
  );
  await admin.from('wsp_issuer_secrets').upsert({ issuer_id: id, hmac_secret: secret }, { onConflict: 'issuer_id' });
}

async function makeSubject(tag: string) {
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

function evidence(opusId: string, evidenceId: string) {
  const critKey = 'S03.C08';
  const base: Record<string, unknown> = {
    protocol_version: '1.0',
    type: 'evidence',
    schema_version: '1.0',
    canonicalization_algorithm: 'RFC8785',
    hash_algorithm: 'SHA-256',
    issuer: { id: ISSUER, evidence_id: evidenceId, attested_by: { actor_id: ACTOR, role: 'coach' } },
    subject: { opus_id: opusId },
    framework: { id: 'framework:wtr', version: '0.1' },
    demonstrates: { skill_id: SKILL, claimed_level: 'applied' },
    observation: { criteria: [critKey], criterion_levels: { [critKey]: 3 } },
    provenance: { evidence_ref: { kind: 'mission_result', id: 'uuid-1' } },
    occurred_at: '2026-07-20T14:32:00.000Z',
    attested_at: '2026-07-20T14:35:12.480Z',
    is_declaration: false,
  };
  base.canonical_hash = canonicalHash(buildCoveredObject(base)).hash;
  return base;
}

async function acceptEvidenceFor(opus: string): Promise<string> {
  const payload = evidence(opus, uniq('ev'));
  const raw = JSON.stringify(payload);
  const ts = Math.floor(Date.now() / 1000).toString();
  const sig = signIssuerRequest(SECRET, ts, raw);
  const recomputed = canonicalHash(buildCoveredObject(payload)).hash;
  const { data, error } = await anonClient().rpc('wsp_ingest_evidence', {
    p_issuer_id: ISSUER,
    p_timestamp: ts,
    p_body: raw,
    p_signature: sig,
    p_payload: payload,
    p_recomputed_hash: recomputed,
  });
  if (error) throw new Error(`ingest: ${error.message}`);
  expect((data as { status: string }).status).toBe('accepted');
  return (data as { evidence_id: string }).evidence_id;
}

async function mySkills(client: SupabaseClient): Promise<{ skill_uri: string; claimed_level: string }[]> {
  const { data, error } = await client.rpc('wsp_my_active_skills');
  if (error) throw new Error(`wsp_my_active_skills: ${error.message}`);
  return (data ?? []) as { skill_uri: string; claimed_level: string }[];
}

beforeAll(async () => {
  await ensureIssuer(ISSUER, SECRET, REDIRECT);
});

afterAll(cleanupAllUsers);

describe('Palier 3 — la source des skills rebranchée sur le réel', () => {
  it('sujet avec preuve ACTIVE → son skill APPARAÎT (skill_uri + claimed_level réels)', async () => {
    const A = await makeSubject('skills-a');
    await grantConsent(A.client, ISSUER, REDIRECT);
    await acceptEvidenceFor(A.opus);

    const rows = await mySkills(A.client);
    // FALSIFIABLE : source vide (public.skills) → [] → cette assertion casserait.
    const s = rows.find((r) => r.skill_uri === SKILL);
    expect(s).toBeDefined();
    expect(s!.claimed_level).toBe('applied');
  });

  it('preuve RÉVOQUÉE (D-036) → son skill NE COMPTE PLUS', async () => {
    const B = await makeSubject('skills-b');
    await grantConsent(B.client, ISSUER, REDIRECT);
    const evId = await acceptEvidenceFor(B.opus);

    // présent avant révocation
    expect((await mySkills(B.client)).some((r) => r.skill_uri === SKILL)).toBe(true);

    // révocation = fait nouveau (le trigger du palier 2 marque aussi l'update)
    const rev = await admin.from('wsp_fact_revocations').insert({
      revokes_evidence_id: evId,
      issuer_id: ISSUER,
      issuer_revocation_id: uniq('rev'),
      reason: 'palier 3 — D-036 skills',
      revoked_by: ACTOR,
      occurred_at: new Date().toISOString(),
      canonical_hash: 'a'.repeat(64),
    });
    expect(rev.error).toBeNull();

    // la SEULE preuve de ce skill est révoquée → le skill disparaît
    expect((await mySkills(B.client)).some((r) => r.skill_uri === SKILL)).toBe(false);
  });

  it('OWNER-SCOPÉ — un sujet ne voit QUE ses skills ; le service_role (hors auth) n’en voit aucun', async () => {
    const C = await makeSubject('skills-c');
    await grantConsent(C.client, ISSUER, REDIRECT);
    await acceptEvidenceFor(C.opus);

    // C voit son skill ; un autre sujet (D, sans preuve) ne le voit pas.
    expect((await mySkills(C.client)).some((r) => r.skill_uri === SKILL)).toBe(true);
    const D = await makeSubject('skills-d');
    expect(await mySkills(D.client)).toHaveLength(0);

    // service_role (admin, sans JWT) → current_opus_id() NULL → aucun skill.
    const { data } = await admin.rpc('wsp_my_active_skills');
    expect((data ?? []) as unknown[]).toHaveLength(0);
  });

  it('verified_count RESTE 0 malgré des skills actifs — jamais de vérification non calculée (palier 4)', async () => {
    const E = await makeSubject('skills-e');
    await grantConsent(E.client, ISSUER, REDIRECT);
    await acceptEvidenceFor(E.opus);

    // Le Dashboard lit la source réelle : des skills actifs EXISTENT (count ≥ 1)...
    const dash = await new DashboardService(E.client).getDashboard();
    expect(dash?.skills_status).toBeTruthy();
    expect(dash!.skills_status!.count).toBeGreaterThanOrEqual(1);
    // ...mais AUCUN n'est « vérifié » : le trust engine (palier 4) n'existe pas.
    // FALSIFIABLE : égaler verified_count à count sans trust → cette assertion casse.
    expect(dash!.skills_status!.verified_count).toBe(0);
  });
});
