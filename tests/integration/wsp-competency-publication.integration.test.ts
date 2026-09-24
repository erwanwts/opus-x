/**
 * =====================================================================
 * PALIER 5 (back) — divulgation PAR COMPÉTENCE + vue publique (D-042), staging.
 * =====================================================================
 * La vue n'expose une compétence QUE si (passeport public) ET (compétence publiée)
 * — DOUBLE FILTRE, imposé en base. Défaut = non publié. L'API est owner-scopée.
 *
 * ⭐ MUTATION DÉCISIVE : le test « compétence NON publiée → absente de la vue » est
 * le garde du filtre `published`. Retirer ce filtre ferait apparaître la compétence
 * → ce test CASSERAIT (le filtre par compétence mord, ce n'est pas une tautologie).
 *
 * PRÉREQUIS : migration 20260924000003_wsp_competency_publication appliquée.
 * =====================================================================
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import { admin, anonClient, createUser, waitForPassport, adminProfile, adminPassport, signIn, cleanupAllUsers } from './_harness';
import { canonicalHash } from '../../lib/wsp/canonical';
import { buildCoveredObject } from '../../lib/wsp/evidenceCovered';
import { signIssuerRequest } from '../../lib/issuer/hmac';
import { generateExchangeCode, hashLinkToken, LINK_CONSENT_VERSION, LINK_CODE_TTL_SECONDS } from '../../lib/link/issuerAuthToken';

const ISSUER = 'issuer:qa-pub-x';
const SECRET = 'qa-pub-secret-x-2244';
const REDIRECT = 'https://pub-x.example/callback';
const ACTOR = '2b3c4d55-6e70-4f81-9a02-3b4c5d6e7f80';
const SKILL = 'wtr:212';
const FV = '0.1';

function uniq(p: string) { return `${p}_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e6).toString(36)}`; }
async function ensureIssuer() {
  await admin.from('wsp_issuers').upsert({ id: ISSUER, display_name: 'QA Pub Issuer', status: 'active', redirect_uri: REDIRECT }, { onConflict: 'id', ignoreDuplicates: true });
  await admin.from('wsp_issuer_secrets').upsert({ issuer_id: ISSUER, hmac_secret: SECRET }, { onConflict: 'issuer_id' });
}
async function makeSubject(tag: string) {
  const u = await createUser({ tag, confirmed: true });
  const passport = await waitForPassport(u.id);
  if (!passport) throw new Error(`Passport non émis pour ${tag}`);
  const opus = (await adminProfile(u.id))!.opus_id as string;
  const client = await signIn(u.email, u.password);
  return { userId: u.id, opus, passportId: passport.id as string, handle: passport.handle as string, client };
}
async function grantConsent(client: SupabaseClient) {
  const code = generateExchangeCode();
  const { error } = await client.rpc('wsp_authorize_issuer', {
    p_issuer_id: ISSUER, p_consent_text_version: LINK_CONSENT_VERSION,
    p_code_hash: hashLinkToken(code), p_redirect_uri: REDIRECT, p_ttl_seconds: LINK_CODE_TTL_SECONDS,
  });
  if (error) throw new Error(`grant: ${error.message}`);
}
async function acceptProficient(opus: string): Promise<string> {
  const critKey = 'S03.C08';
  const payload: Record<string, unknown> = {
    protocol_version: '1.0', type: 'evidence', schema_version: '1.0',
    canonicalization_algorithm: 'RFC8785', hash_algorithm: 'SHA-256',
    issuer: { id: ISSUER, evidence_id: uniq('ev'), attested_by: { actor_id: ACTOR, role: 'coach' } },
    subject: { opus_id: opus }, framework: { id: 'framework:wtr', version: FV },
    demonstrates: { skill_id: SKILL, claimed_level: 'proficient' },
    observation: { criteria: [critKey], criterion_levels: { [critKey]: 4 } },
    provenance: { evidence_ref: { kind: 'mission_result', id: 'uuid-1' } },
    occurred_at: '2026-07-20T14:32:00.000Z', attested_at: '2026-07-20T14:35:12.480Z', is_declaration: false,
  };
  payload.canonical_hash = canonicalHash(buildCoveredObject(payload)).hash;
  const raw = JSON.stringify(payload); const ts = Math.floor(Date.now() / 1000).toString();
  const { data, error } = await anonClient().rpc('wsp_ingest_evidence', {
    p_issuer_id: ISSUER, p_timestamp: ts, p_body: raw, p_signature: signIssuerRequest(SECRET, ts, raw),
    p_payload: payload, p_recomputed_hash: canonicalHash(buildCoveredObject(payload)).hash,
  });
  if (error) throw new Error(`ingest: ${error.message}`);
  return (data as { evidence_id: string }).evidence_id;
}
async function makePublic(passportId: string) {
  const { error } = await admin.from('passports').update({ visibility: 'public' }).eq('id', passportId);
  if (error) throw new Error(`makePublic: ${error.message}`);
}
/** Ce qu'un VISITEUR anonyme voit de la vue publique, pour un handle. */
async function publicView(handle: string) {
  const { data } = await anonClient().from('public_passport_competencies').select('*').eq('handle', handle);
  return (data ?? []) as Record<string, unknown>[];
}

beforeAll(ensureIssuer);
afterAll(cleanupAllUsers);

describe('Palier 5 — divulgation par compétence, double filtre (D-042)', () => {
  it('FILTRE 1 — passeport PRIVÉ : même une compétence publiée ne sort JAMAIS', async () => {
    const A = await makeSubject('pub-a'); await grantConsent(A.client);
    await acceptProficient(A.opus); // compétence established
    await A.client.rpc('wsp_publish_competency', { p_skill_id: SKILL, p_framework_version: FV }); // publiée...
    // ...mais passeport PRIVÉ (défaut) → rien ne sort.
    expect(await publicView(A.handle)).toHaveLength(0);
  });

  it('⭐ FILTRE 2 — passeport PUBLIC mais compétence NON publiée → absente (mutation : retirer le filtre published casserait)', async () => {
    const B = await makeSubject('pub-b'); await grantConsent(B.client);
    await acceptProficient(B.opus);
    await makePublic(B.passportId);
    // NON publiée (défaut) → la vue ne la montre pas, MALGRÉ le passeport public.
    expect(await publicView(B.handle)).toHaveLength(0);
  });

  it('DOUBLE FILTRE satisfait — public + publiée → la compétence APPARAÎT (état + provenance, pas de contenu brut)', async () => {
    const C = await makeSubject('pub-c'); await grantConsent(C.client);
    await acceptProficient(C.opus);
    await makePublic(C.passportId);
    await C.client.rpc('wsp_publish_competency', { p_skill_id: SKILL, p_framework_version: FV });

    const rows = await publicView(C.handle);
    expect(rows).toHaveLength(1);
    const row = rows[0];
    expect(row.skill_id).toBe(SKILL);
    expect(row.state).toBe('established');
    // provenance = existence (émetteur, date), JAMAIS le contenu brut
    expect(Array.isArray(row.evidence_provenance)).toBe(true);
    expect((row.evidence_provenance as unknown[]).length).toBeGreaterThanOrEqual(1);
    // whitelist stricte : aucune colonne de contenu brut
    const cols = Object.keys(row).sort();
    expect(cols).toEqual(['basis_level', 'evidence_provenance', 'handle', 'skill_id', 'state']);
    for (const forbidden of ['observation', 'canonical_hash', 'opus_id', 'profile_id', 'passport_id'])
      expect(cols).not.toContain(forbidden);
  });

  it('DÉPUBLIER — la compétence disparaît de la vue (réversible)', async () => {
    const D = await makeSubject('pub-d'); await grantConsent(D.client);
    await acceptProficient(D.opus);
    await makePublic(D.passportId);
    await D.client.rpc('wsp_publish_competency', { p_skill_id: SKILL, p_framework_version: FV });
    expect(await publicView(D.handle)).toHaveLength(1);

    await D.client.rpc('wsp_unpublish_competency', { p_skill_id: SKILL, p_framework_version: FV });
    expect(await publicView(D.handle)).toHaveLength(0); // disparue
  });

  it('API OWNER-SCOPÉE — un sujet ne publie pas la compétence d’un AUTRE', async () => {
    const E = await makeSubject('pub-e'); await grantConsent(E.client);
    await acceptProficient(E.opus);
    await makePublic(E.passportId);
    await E.client.rpc('wsp_publish_competency', { p_skill_id: SKILL, p_framework_version: FV });
    expect(await publicView(E.handle)).toHaveLength(1);

    // F (autre sujet, sans preuve) tente de publier « la » compétence : il n'agit
    // que sur SON passport → competency_not_found (il n'a pas cette compétence).
    const F = await makeSubject('pub-f');
    const attempt = await F.client.rpc('wsp_publish_competency', { p_skill_id: SKILL, p_framework_version: FV });
    expect(attempt.error).not.toBeNull();
    // La publication de E est INTACTE (F n'a pas pu la toucher).
    expect(await publicView(E.handle)).toHaveLength(1);
  });
});
