/**
 * =====================================================================
 * PALIER 1 — Le pont WSP → Passport (base LIVE staging).
 * =====================================================================
 * On établit, À VIDE, la RÉSOLUTION `wsp_evidence.subject_id (opus_id)
 * → profiles → passports.id` et le REJET D-035 (sujet sans Passport).
 * Aucune écriture, aucun passport_update, aucune mutation de l'ingestion
 * (c'est le Palier 2).
 *
 * FALSIFIABILITÉ (anti-tautologie). Le cas « AVEC Passport » assère le
 * `passport_id` EXACT (celui lu par l'admin), pas un simple « non null ».
 * Fausser la jointure du résolveur (mauvaise colonne, mauvais sens) fait
 * retourner NULL ou un autre id → le test CASSE. Le cas « SANS Passport »
 * vérifie que le profil EXISTE encore (donc on teste bien « pas de
 * Passport », pas « sujet inconnu ») et que le rejet nommé se déclenche.
 *
 * PRÉREQUIS : migration 20260831000001_wsp_passport_bridge appliquée.
 * =====================================================================
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  admin,
  createUser,
  waitForPassport,
  adminProfile,
  adminPassport,
  cleanupAllUsers,
} from './_harness';

/** Sujet réel : user confirmé → profil + Passport émis par le trigger. */
async function makeSubjectWithPassport(tag: string) {
  const u = await createUser({ tag, confirmed: true });
  const passport = await waitForPassport(u.id);
  if (!passport) throw new Error(`Passport non émis pour ${tag}`);
  const opus = (await adminProfile(u.id))!.opus_id as string;
  return { userId: u.id, opus, passportId: passport.id as string };
}

describe('Pont WSP→Passport (Palier 1) — résolution + rejet D-035', () => {
  let withPassport: { userId: string; opus: string; passportId: string };
  let noPassport: { userId: string; opus: string };

  beforeAll(async () => {
    // (a) un sujet AVEC Passport.
    withPassport = await makeSubjectWithPassport('bridge-has');

    // (b) un sujet SANS Passport : on émet, puis on DÉTACHE le Passport
    //     (toutes les FK vers passports sont ON DELETE CASCADE ; wsp_evidence
    //     ne référence pas passports). Le PROFIL, lui, subsiste avec son opus_id.
    const s = await makeSubjectWithPassport('bridge-none');
    const { error } = await admin.from('passports').delete().eq('id', s.passportId);
    if (error) throw new Error(`détachement du Passport impossible : ${error.message}`);
    noPassport = { userId: s.userId, opus: s.opus };
  });

  afterAll(cleanupAllUsers);

  it('CHEMIN HEUREUX — sujet AVEC Passport → le résolveur retourne le passport_id EXACT', async () => {
    const { data, error } = await admin.rpc('wsp_resolve_subject_passport', {
      p_opus_id: withPassport.opus,
    });
    expect(error).toBeNull();
    // Assertion FALSIFIABLE : l'id exact, pas « un id quelconque ».
    expect(data).toBe(withPassport.passportId);
  });

  it('SANS Passport — le profil subsiste, mais le résolveur signale l’ABSENCE (NULL)', async () => {
    // Garantit qu'on teste « pas de Passport » et non « sujet inconnu ».
    const profile = await adminProfile(noPassport.userId);
    expect(profile?.opus_id).toBe(noPassport.opus);
    expect(await adminPassport(noPassport.userId)).toBeNull();

    const { data, error } = await admin.rpc('wsp_resolve_subject_passport', {
      p_opus_id: noPassport.opus,
    });
    expect(error).toBeNull();
    expect(data).toBeNull(); // absence signalée proprement, pas une erreur
  });

  it('REJET D-035 — sujet SANS Passport → wsp_require lève subject_has_no_passport', async () => {
    const { error } = await admin.rpc('wsp_require_subject_passport', {
      p_opus_id: noPassport.opus,
    });
    expect(error).not.toBeNull();
    expect(error!.message).toContain('subject_has_no_passport');
  });

  it('REJET D-035 — un opus_id INEXISTANT est aussi rejeté (require), et résolu en NULL', async () => {
    const ghost = 'opx_000000000000000000000000000';
    const resolved = await admin.rpc('wsp_resolve_subject_passport', { p_opus_id: ghost });
    expect(resolved.error).toBeNull();
    expect(resolved.data).toBeNull();

    const required = await admin.rpc('wsp_require_subject_passport', { p_opus_id: ghost });
    expect(required.error).not.toBeNull();
    expect(required.error!.message).toContain('subject_has_no_passport');
  });

  it('CONTRÔLE anti-tautologie — le résolveur ne retourne pas un id CONSTANT', async () => {
    // Le sujet AVEC Passport résout vers SON id ; le sujet SANS Passport
    // résout vers NULL. Deux entrées, deux sorties distinctes : le résolveur
    // discrimine réellement (une jointure faussée aplatirait cette différence).
    const a = await admin.rpc('wsp_resolve_subject_passport', { p_opus_id: withPassport.opus });
    const b = await admin.rpc('wsp_resolve_subject_passport', { p_opus_id: noPassport.opus });
    expect(a.data).toBe(withPassport.passportId);
    expect(b.data).toBeNull();
    expect(a.data).not.toBe(b.data);
  });
});
