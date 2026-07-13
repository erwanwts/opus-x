/**
 * LOT 11 — VIGILANCE V3.
 * finalize_emission() ne renvoie complete:true QUE si les 4 écritures existent
 * (profil + passport + trust_index + consentement accordé). Une émission
 * PARTIELLE renvoie complete:false — la cérémonie n'affiche alors jamais
 * « Identity Successfully Established ».
 */
import { describe, it, expect, afterAll } from 'vitest';
import {
  createUser,
  signIn,
  waitForPassport,
  adminProfile,
  cleanupAllUsers,
} from './_harness';

afterAll(cleanupAllUsers);

describe('V3 — signal serveur de complétude', () => {
  it('émission COMPLÈTE (4 écritures) ⇒ complete:true, tous les checks à true', async () => {
    const u = await createUser({ tag: 'v3-complete', confirmed: true });
    await waitForPassport(u.id);

    const session = await signIn(u.email, u.password);
    const { data, error } = await session.rpc('finalize_emission');

    expect(error).toBeNull();
    expect(data.complete).toBe(true);
    expect(data.checks).toEqual({
      profile: true,
      passport: true,
      trust_index: true,
      consents: true,
    });
    // Cohérence RPC ↔ base : l'opus_id renvoyé est celui du profil.
    const profile = await adminProfile(u.id);
    expect(data.opus_id).toBe(profile!.opus_id);
    expect(data.lifecycle_stage).toBe('identity_established');
    expect(data.trust_state).toBe('establishing');
  });

  it('émission PARTIELLE (aucun consentement accordé) ⇒ complete:false', async () => {
    // Utilisateur confirmé SANS bloc consents dans les métadonnées :
    // le trigger écrit profil + passport + trust_index, mais 0 consentement.
    const u = await createUser({ tag: 'v3-partial', confirmed: true, consents: null });
    await waitForPassport(u.id);

    const session = await signIn(u.email, u.password);
    const { data, error } = await session.rpc('finalize_emission');

    expect(error).toBeNull();
    // 3 écritures sur 4 : le signal REFUSE de déclarer l'émission complète.
    expect(data.complete).toBe(false);
    expect(data.checks.profile).toBe(true);
    expect(data.checks.passport).toBe(true);
    expect(data.checks.trust_index).toBe(true);
    expect(data.checks.consents).toBe(false);
  });
});
