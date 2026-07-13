/**
 * LOT 11 — Cohérence Opus ID / handle / lifecycle_stage / issued_at
 *          + session sur un autre appareil (multi-device).
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  createUser,
  signIn,
  waitForPassport,
  adminProfile,
  adminPassport,
  adminPassportCount,
  cleanupAllUsers,
  type TestUser,
} from './_harness';

// Opus ID : opx_ + 26 caractères base32 Crockford (exclut I, L, O, U).
const OPUS_ID_RE = /^opx_[0-9A-HJKMNP-TV-Z]{26}$/;
// Handle : slug minuscule + suffixe, segments alphanumériques séparés de tirets.
const HANDLE_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

describe('Cohérence des identifiants après émission', () => {
  let user: TestUser;

  beforeAll(async () => {
    user = await createUser({ tag: 'coh', confirmed: true, fullName: 'Marie Dubois' });
    await waitForPassport(user.id);
  });
  afterAll(cleanupAllUsers);

  it('opus_id, handle, lifecycle_stage et issued_at sont cohérents et bien formés', async () => {
    const profile = await adminProfile(user.id);
    const passport = await adminPassport(user.id);

    // Opus ID : format canonique permanent.
    expect(profile!.opus_id).toMatch(OPUS_ID_RE);
    // Handle : dérivé du nom (slug 'marie-dubois') + suffixe, découplé de l'opus_id.
    expect(passport!.handle).toMatch(HANDLE_RE);
    expect(passport!.handle.startsWith('marie-dubois')).toBe(true);
    expect(passport!.handle).not.toBe(profile!.opus_id);
    // Cycle de vie : étape 1, verrouillée en Sprint 1.
    expect(passport!.lifecycle_stage).toBe('identity_established');
    // Date d'émission : présente, valide, en 2026, cohérente avec la création.
    expect(passport!.issued_at).toBeTruthy();
    expect(Number.isNaN(Date.parse(passport!.issued_at))).toBe(false);
    expect(new Date(passport!.issued_at).getUTCFullYear()).toBe(2026);
  });

  it('finalize_emission renvoie EXACTEMENT les identifiants stockés (RPC ↔ base)', async () => {
    const profile = await adminProfile(user.id);
    const passport = await adminPassport(user.id);

    const session = await signIn(user.email, user.password);
    const { data } = await session.rpc('finalize_emission');

    expect(data.opus_id).toBe(profile!.opus_id);
    expect(data.handle).toBe(passport!.handle);
    expect(data.lifecycle_stage).toBe(passport!.lifecycle_stage);
    expect(new Date(data.issued_at).toISOString()).toBe(new Date(passport!.issued_at).toISOString());
  });
});

describe('Session sur un autre appareil (multi-device)', () => {
  let user: TestUser;

  beforeAll(async () => {
    user = await createUser({ tag: 'multidev', confirmed: true });
    await waitForPassport(user.id);
  });
  afterAll(cleanupAllUsers);

  it('deux sessions indépendantes voient le MÊME Passport unique', async () => {
    // Deux "appareils" : deux ouvertures de session distinctes.
    const device1 = await signIn(user.email, user.password);
    const device2 = await signIn(user.email, user.password);

    const p1 = await device1.from('passports').select('*');
    const p2 = await device2.from('passports').select('*');

    expect(p1.data).toHaveLength(1);
    expect(p2.data).toHaveLength(1);
    // Même identité vue des deux côtés.
    expect(p1.data![0].id).toBe(p2.data![0].id);
    expect(p1.data![0].handle).toBe(p2.data![0].handle);

    // Finaliser depuis les deux appareils n'émet jamais un second Passport.
    const [f1, f2] = await Promise.all([
      device1.rpc('finalize_emission'),
      device2.rpc('finalize_emission'),
    ]);
    expect(f1.data.opus_id).toBe(f2.data.opus_id);
    expect(await adminPassportCount(user.id)).toBe(1);
  });
});
