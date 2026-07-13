/**
 * LOT 11 — Double-clic · retry réseau · reprise après interruption ·
 *          création concurrente · absence de doublon.
 *
 * L'émission est ATOMIQUE et IDEMPOTENTE : quel que soit le nombre d'appels,
 * simultanés ou rejoués, il n'existe JAMAIS deux Passports pour un profil.
 * (Garanti par l'unicité passports.profile_id + les `on conflict do nothing`.)
 */
import { describe, it, expect, afterAll } from 'vitest';
import {
  createUser,
  signIn,
  waitForPassport,
  adminPassport,
  adminPassportCount,
  wipeApplicationRows,
  cleanupAllUsers,
} from './_harness';

afterAll(cleanupAllUsers);

describe('Idempotence de l’émission', () => {
  it('double-clic : deux finalize SIMULTANÉS ⇒ un seul Passport', async () => {
    const u = await createUser({ tag: 'idem-dblclick', confirmed: true });
    await waitForPassport(u.id);
    const session = await signIn(u.email, u.password);

    const [a, b] = await Promise.all([
      session.rpc('finalize_emission'),
      session.rpc('finalize_emission'),
    ]);

    expect(a.data.complete).toBe(true);
    expect(b.data.complete).toBe(true);
    expect(await adminPassportCount(u.id)).toBe(1);
    // Même identité renvoyée par les deux appels.
    expect(a.data.opus_id).toBe(b.data.opus_id);
  });

  it('retry réseau : finalize rejoué en série ⇒ opus_id STABLE, jamais régénéré', async () => {
    const u = await createUser({ tag: 'idem-retry', confirmed: true });
    await waitForPassport(u.id);
    const session = await signIn(u.email, u.password);

    const r1 = await session.rpc('finalize_emission');
    const r2 = await session.rpc('finalize_emission');
    const r3 = await session.rpc('finalize_emission');

    expect(r1.data.opus_id).toBe(r2.data.opus_id);
    expect(r2.data.opus_id).toBe(r3.data.opus_id);
    expect(await adminPassportCount(u.id)).toBe(1);
  });

  it('création concurrente via le filet de sécurité : 5 finalize simultanés ⇒ un seul Passport', async () => {
    const u = await createUser({ tag: 'idem-concurrent', confirmed: true });
    await waitForPassport(u.id);

    // Reprise après interruption : on efface l'empreinte applicative (le trigger
    // avait émis), puis 5 appels SIMULTANÉS reconstruisent l'émission. Le filet
    // de sécurité de finalize_emission() doit converger vers UN seul Passport.
    await wipeApplicationRows(u.id);
    expect(await adminPassport(u.id)).toBeNull();

    const session = await signIn(u.email, u.password);
    const results = await Promise.all(
      Array.from({ length: 5 }, () => session.rpc('finalize_emission'))
    );

    // Aucune erreur bloquante, et surtout : exactement un Passport.
    expect(await adminPassportCount(u.id)).toBe(1);
    const opusIds = new Set(results.map((r) => r.data?.opus_id).filter(Boolean));
    expect(opusIds.size).toBe(1); // une seule identité forgée
  });

  it('reprise après interruption : réémission après effacement ⇒ Passport cohérent unique', async () => {
    const u = await createUser({ tag: 'idem-resume', confirmed: true });
    await waitForPassport(u.id);

    await wipeApplicationRows(u.id);
    const session = await signIn(u.email, u.password);
    const { data } = await session.rpc('finalize_emission');

    expect(data.complete).toBe(true);
    expect(data.lifecycle_stage).toBe('identity_established');
    expect(await adminPassportCount(u.id)).toBe(1);
  });
});
