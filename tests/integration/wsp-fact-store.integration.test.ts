/**
 * =====================================================================
 * LOT O1 — Fact store d'Evidence : garanties DB (base LIVE de staging).
 * =====================================================================
 * Prouve les conditions de sortie du Lot O1 :
 *   • W2 — UPDATE/DELETE direct sur les 4 tables de faits → ÉCHEC SGBD,
 *     service_role INCLUS (append-only par construction).
 *   • §7 (ENG-002) — identité d'émission : (issuer_id, issuer_evidence_id)
 *     UNIQUE ; un doublon d'émission est rejeté.
 *   • W4 — provenance obligatoire : une Evidence sans provenance est refusée
 *     au niveau base (NOT NULL structurel).
 *   • RLS (ENG-001 §10) — le sujet lit SES faits ; un autre sujet n'en lit
 *     rien ; anon n'a aucun accès.
 *   • W2 (révocation) — une révocation est un NOUVEAU fait ; l'Evidence
 *     révoquée demeure intacte.
 *
 * PRÉREQUIS : migration 20260713000002_wsp_fact_store.sql appliquée au staging.
 *
 * ⚠️ NATURE APPEND-ONLY : les faits insérés ici sont PERMANENTS (ni UPDATE ni
 * DELETE possibles — c'est précisément ce qu'on prouve). Le staging accumule
 * donc des faits QA. L'Issuer QA est idempotent (ON CONFLICT DO NOTHING) ;
 * les sujets créés ne peuvent pas être supprimés tant qu'ils portent un fait
 * (la FK subject_id → profiles(opus_id) le refuse — cohérent : on ne supprime
 * pas un sujet qui a une histoire). C'est voulu, pas une fuite.
 * =====================================================================
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { admin, anonClient, createUser, signIn, waitForPassport, adminProfile } from './_harness';

const QA_ISSUER = 'issuer:qa-test'; // Issuer d'exemple (données de test, hors W7). Jamais un vrai nom.

function uniq(p: string) {
  return `${p}_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e6).toString(36)}`;
}

/** Une Evidence valide (structure O1 ; la vérif de contenu est O2). */
function evidenceRow(opusId: string, issuerEvidenceId: string) {
  return {
    issuer_id: QA_ISSUER,
    issuer_evidence_id: issuerEvidenceId,
    subject_id: opusId,
    framework_id: 'framework:wtf',
    framework_version: '0.1',
    attested_by_actor_id: '8f2b1c44-0e91-4a7d-9c33-1b6f0d5a77e2',
    attested_by_role: 'coach',
    is_declaration: false,
    provenance_kind: 'mission_result',
    provenance_id: '3d9e5a10-77bc-4f21-8e04-2a9c6b1f0d55',
    observation: { criteria: ['S03.C08'], criterion_levels: { 'S03.C08': 3 } },
    schema_version: '1.0',
    canonicalization_algorithm: 'RFC8785',
    hash_algorithm: 'SHA-256',
    canonical_hash: 'a'.repeat(64),
    occurred_at: '2026-07-20T14:32:00.000Z',
    attested_at: '2026-07-20T14:35:12.480Z',
  };
}

/** Une révocation valide (fait à part entière, avec identité d'émission §7). */
function revocationRow(evidenceId: string, revId: string) {
  return {
    revokes_evidence_id: evidenceId,
    issuer_id: QA_ISSUER,
    issuer_revocation_id: revId,
    reason: 'QA — révocation de test',
    revoked_by: '8f2b1c44-0e91-4a7d-9c33-1b6f0d5a77e2', // acteur humain, ≠ issuer_id
    occurred_at: '2026-07-21T09:00:00.000Z',
    canonical_hash: 'b'.repeat(64),
  };
}

async function makeSubject(tag: string): Promise<string> {
  const u = await createUser({ tag, confirmed: true });
  await waitForPassport(u.id);
  const profile = await adminProfile(u.id);
  return profile!.opus_id as string;
}

let opusA = '';
let opusB = '';
let userA = { email: '', password: '' };
let evidenceIdA = '';

beforeAll(async () => {
  // Issuer QA — idempotent (ON CONFLICT DO NOTHING via upsert ignoreDuplicates :
  // pas d'UPDATE, compatible append-only).
  await admin
    .from('wsp_issuers')
    .upsert(
      { id: QA_ISSUER, display_name: 'QA Issuer', status: 'active' },
      { onConflict: 'id', ignoreDuplicates: true }
    );

  const a = await createUser({ tag: 'facts-a', confirmed: true });
  userA = { email: a.email, password: a.password };
  await waitForPassport(a.id);
  opusA = (await adminProfile(a.id))!.opus_id as string;

  opusB = await makeSubject('facts-b');

  // L'Evidence de A (insérée par le service_role — chemin d'ingestion serveur).
  const { data, error } = await admin
    .from('wsp_evidence')
    .insert(evidenceRow(opusA, uniq('pu')))
    .select('id, issuer_evidence_id')
    .single();
  if (error) throw new Error(`insert evidence A: ${error.message}`);
  evidenceIdA = data!.id;

  await admin
    .from('wsp_evidence_demonstrates_skill')
    .insert({
      evidence_id: evidenceIdA,
      skill_id: 'wtf:212',
      framework_version: '0.1',
      claimed_level: 'applied',
    });
});

/** Insère une Evidence fraîche pour A et renvoie son id (pour tester demonstrates). */
async function freshEvidence(): Promise<string> {
  const { data, error } = await admin
    .from('wsp_evidence')
    .insert(evidenceRow(opusA, uniq('pu')))
    .select('id')
    .single();
  if (error) throw new Error(`freshEvidence: ${error.message}`);
  return data!.id as string;
}

describe('Lot O1 — append-only par construction (W2)', () => {
  it('UPDATE direct sur wsp_evidence → ÉCHEC SGBD (service_role inclus)', async () => {
    const { error } = await admin
      .from('wsp_evidence')
      .update({ is_declaration: true })
      .eq('id', evidenceIdA);
    expect(error).not.toBeNull();
    expect(error!.message).toMatch(/WSP_APPEND_ONLY|append|immuable|forbidden/i);
  });

  it('DELETE direct sur wsp_evidence → ÉCHEC SGBD', async () => {
    const { error } = await admin.from('wsp_evidence').delete().eq('id', evidenceIdA);
    expect(error).not.toBeNull();
  });

  it('UPDATE/DELETE sur wsp_evidence_demonstrates_skill → ÉCHEC SGBD', async () => {
    const up = await admin
      .from('wsp_evidence_demonstrates_skill')
      .update({ claimed_level: 'mastery' })
      .eq('evidence_id', evidenceIdA);
    expect(up.error).not.toBeNull();
    const del = await admin
      .from('wsp_evidence_demonstrates_skill')
      .delete()
      .eq('evidence_id', evidenceIdA);
    expect(del.error).not.toBeNull();
  });

  it('UPDATE/DELETE sur wsp_issuers → ÉCHEC SGBD', async () => {
    const up = await admin.from('wsp_issuers').update({ status: 'suspended' }).eq('id', QA_ISSUER);
    expect(up.error).not.toBeNull();
    const del = await admin.from('wsp_issuers').delete().eq('id', QA_ISSUER);
    expect(del.error).not.toBeNull();
  });

  it('l’Evidence est TOUJOURS intacte après ces tentatives', async () => {
    const { data } = await admin
      .from('wsp_evidence')
      .select('is_declaration, subject_id')
      .eq('id', evidenceIdA)
      .maybeSingle();
    expect(data?.is_declaration).toBe(false);
    expect(data?.subject_id).toBe(opusA);
  });
});

describe('Lot O1 — identité d’émission (ENG-002 §7)', () => {
  it('un doublon (issuer_id, issuer_evidence_id) est REJETÉ — clé d’idempotence', async () => {
    const eid = uniq('pu');
    const first = await admin.from('wsp_evidence').insert(evidenceRow(opusA, eid));
    expect(first.error).toBeNull();

    // Même identité d'émission, contenu différent → conflit d'identité.
    const dupe = evidenceRow(opusA, eid);
    dupe.provenance_id = 'ffffffff-ffff-4fff-8fff-ffffffffffff';
    const second = await admin.from('wsp_evidence').insert(dupe);
    expect(second.error).not.toBeNull();
    expect(second.error!.code).toBe('23505'); // unique_violation
  });
});

describe('Lot O1 — claimed_level contraint aux niveaux publiés (W2, par construction)', () => {
  // Les inserts en échec ne créent aucune ligne : on peut réutiliser une même
  // Evidence pour les deux rejets, puis prouver l'insert valide.
  it('claimed_level inexistant (« grandmaster ») → ÉCHEC BASE (FK)', async () => {
    const ev = await freshEvidence();
    const { error } = await admin.from('wsp_evidence_demonstrates_skill').insert({
      evidence_id: ev,
      skill_id: 'wtf:212',
      framework_version: '0.1',
      claimed_level: 'grandmaster',
    });
    expect(error).not.toBeNull();
    expect(error!.code).toBe('23503'); // foreign_key_violation
  });

  it('niveau d’une AUTRE version du Framework → ÉCHEC BASE', async () => {
    const ev = await freshEvidence(); // parent en version 0.1
    const { error } = await admin.from('wsp_evidence_demonstrates_skill').insert({
      evidence_id: ev,
      skill_id: 'wtf:212',
      framework_version: '0.2', // ≠ parent → trigger de cohérence rejette
      claimed_level: 'applied',
    });
    expect(error).not.toBeNull();
    expect(error!.message).toMatch(/incohérente|WSP_EDS|check|foreign key/i);
  });

  it('claimed_level valide à la bonne version → OK', async () => {
    const ev = await freshEvidence();
    const { error } = await admin.from('wsp_evidence_demonstrates_skill').insert({
      evidence_id: ev,
      skill_id: 'wtf:212',
      framework_version: '0.1',
      claimed_level: 'applied',
    });
    expect(error).toBeNull();
  });
});

describe('Lot O1 — provenance obligatoire (W4 structurel)', () => {
  it('une Evidence sans provenance_id est refusée au niveau base', async () => {
    const row = evidenceRow(opusA, uniq('pu')) as Record<string, unknown>;
    delete row.provenance_id;
    const { error } = await admin.from('wsp_evidence').insert(row);
    expect(error).not.toBeNull();
    expect(error!.code).toBe('23502'); // not_null_violation
  });
});

describe('Lot O1 — révocation = nouveau fait (W2)', () => {
  it('une révocation référence l’Evidence, qui DEMEURE intacte', async () => {
    const { error } = await admin
      .from('wsp_fact_revocations')
      .insert(revocationRow(evidenceIdA, uniq('rev')));
    expect(error).toBeNull();

    // L'Evidence révoquée existe toujours (jamais supprimée).
    const { data } = await admin
      .from('wsp_evidence')
      .select('id')
      .eq('id', evidenceIdA)
      .maybeSingle();
    expect(data?.id).toBe(evidenceIdA);
  });

  it('UPDATE sur une révocation → ÉCHEC SGBD (elle aussi append-only)', async () => {
    const { error } = await admin
      .from('wsp_fact_revocations')
      .update({ reason: 'altéré' })
      .eq('revokes_evidence_id', evidenceIdA);
    expect(error).not.toBeNull();
  });
});

describe('Lot O1 — identité d’émission de la révocation (ENG-002 §7)', () => {
  it('un doublon (issuer_id, issuer_revocation_id) est REJETÉ — relivraison idempotente', async () => {
    const rid = uniq('rev');
    const first = await admin.from('wsp_fact_revocations').insert(revocationRow(evidenceIdA, rid));
    expect(first.error).toBeNull();

    // Même identité d'émission de révocation → rejet (pas de second fait permanent).
    const second = await admin.from('wsp_fact_revocations').insert(revocationRow(evidenceIdA, rid));
    expect(second.error).not.toBeNull();
    expect(second.error!.code).toBe('23505'); // unique_violation
  });

  it('une révocation d’un Issuer inexistant → ÉCHEC BASE (FK)', async () => {
    const row = revocationRow(evidenceIdA, uniq('rev'));
    row.issuer_id = 'issuer:does-not-exist';
    const { error } = await admin.from('wsp_fact_revocations').insert(row);
    expect(error).not.toBeNull();
    expect(error!.code).toBe('23503'); // foreign_key_violation
  });
});

describe('Lot O1 — RLS : le sujet lit ses faits, personne d’autre', () => {
  it('le sujet A lit SA propre Evidence', async () => {
    const clientA = await signIn(userA.email, userA.password);
    const { data } = await clientA.from('wsp_evidence').select('id, subject_id');
    expect((data ?? []).some((e) => e.id === evidenceIdA)).toBe(true);
    expect((data ?? []).every((e) => e.subject_id === opusA)).toBe(true);
  });

  it('le sujet B ne lit RIEN de l’Evidence de A (RLS)', async () => {
    const b = await createUser({ tag: 'facts-b-reader', confirmed: true });
    const clientB = await signIn(b.email, b.password);
    const { data } = await clientB.from('wsp_evidence').select('id').eq('id', evidenceIdA);
    expect(data ?? []).toHaveLength(0);
  });

  it('anon n’a AUCUN accès au fact store', async () => {
    const anon = anonClient();
    const { data } = await anon.from('wsp_evidence').select('id').eq('id', evidenceIdA);
    expect(data ?? []).toHaveLength(0);
  });

  it('l’identité de l’Issuer est lisible, mais jamais le secret HMAC', async () => {
    const clientA = await signIn(userA.email, userA.password);
    const ok = await clientA.from('wsp_issuers').select('id, display_name, status').eq('id', QA_ISSUER);
    expect((ok.data ?? []).length).toBe(1);

    // La colonne hmac_key_ref n'est pas accordée à authenticated → erreur.
    const leak = await clientA.from('wsp_issuers').select('hmac_key_ref').eq('id', QA_ISSUER);
    expect(leak.error).not.toBeNull();
  });
});
