/**
 * LOT 11 — VIGILANCE V2.
 * Les consentements recueillis AVANT l'existence du profil (transportés dans
 * les métadonnées de signup) sont bien journalisés — avec VERSION et DATE
 * D'ENTRÉE EN VIGUEUR — et un renvoi de lien / retry ne les DUPLIQUE jamais.
 */
import { describe, it, expect, afterAll } from 'vitest';
import {
  createUser,
  signIn,
  waitForPassport,
  adminConsents,
  cleanupAllUsers,
} from './_harness';

afterAll(cleanupAllUsers);

describe('V2 — journalisation des consentements pré-profil', () => {
  it('les consentements du signup sont journalisés avec version ET date d’entrée en vigueur', async () => {
    const u = await createUser({ tag: 'v2-journal', confirmed: true });
    await waitForPassport(u.id);

    const consents = await adminConsents(u.id);
    const byType = Object.fromEntries(consents.map((c) => [c.type, c]));

    // Les deux consentements requis, transportés depuis les métadonnées.
    expect(Object.keys(byType).sort()).toEqual(['privacy', 'terms']);

    for (const type of ['terms', 'privacy'] as const) {
      expect(byType[type].granted).toBe(true);
      // Version documentaire précise.
      expect(byType[type].version).toBe('v1.0.0');
      // Date d'entrée en vigueur, colonne DISTINCTE (traçabilité juridique).
      expect(byType[type].effective_date).toBe('2026-07-11');
      // Horodatage de recueil présent.
      expect(byType[type].granted_at).toBeTruthy();
    }
  });

  it('un retry (finalize rejoué) ne DUPLIQUE aucun consentement', async () => {
    const u = await createUser({ tag: 'v2-retry', confirmed: true });
    await waitForPassport(u.id);

    const before = await adminConsents(u.id);
    expect(before.length).toBe(2);

    // Rejoue l'émission plusieurs fois (équivaut à un renvoi de lien / retry réseau).
    const session = await signIn(u.email, u.password);
    await session.rpc('finalize_emission');
    await session.rpc('finalize_emission');
    await session.rpc('finalize_emission');

    const after = await adminConsents(u.id);
    // Idempotence stricte : index unique (profile_id, type, version).
    expect(after.length).toBe(2);
    expect(after.map((c) => c.type).sort()).toEqual(['privacy', 'terms']);
  });

  it('le format de version est contraint (vX.Y.Z) au niveau base', async () => {
    // Un consentement à version malformée est refusé par la contrainte CHECK.
    const u = await createUser({ tag: 'v2-badversion', confirmed: true });
    const profile = await waitForPassport(u.id);
    expect(profile).not.toBeNull();

    const session = await signIn(u.email, u.password);
    const { error } = await session.from('consents').insert({
      profile_id: u.id,
      type: 'public_share',
      granted: true,
      version: '2026-07', // format invalide
      effective_date: '2026-07-11',
    });
    expect(error).not.toBeNull(); // consents_version_format_chk
  });
});
