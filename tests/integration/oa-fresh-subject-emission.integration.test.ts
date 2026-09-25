/**
 * =====================================================================
 * O-A — Sujet FRAIS : le Passeport naît DANS le flux, privé par défaut.
 * =====================================================================
 * Décision D-052 : le Passeport naît PENDANT l'activation (voie a). O-A câble
 * /link → establish → magic-link → émission → /link pour un sujet non établi.
 *
 * Ici on prouve le POINT D'ARRÊT côté base, sur STAGING (jamais la prod) :
 *   • un sujet NON confirmé n'a AUCUN Passeport (V1 — pas d'émission
 *     prématurée) ;
 *   • dès que l'email est confirmé (transition email_confirmed_at, exactement
 *     le chemin du magic link), le trigger ÉMET : le Passeport existe,
 *     visibility='private', lifecycle_stage='identity_established'.
 *
 * Le câblage de ROUTAGE (retour /link porté de bout en bout, filet
 * anti-détournement) est prouvé, lui, par lib/link/returnPath.test.ts.
 * =====================================================================
 */
import { describe, it, expect, afterAll } from 'vitest';
import {
  admin,
  createUser,
  adminPassport,
  adminPassportCount,
  waitForPassport,
  cleanupAllUsers,
} from './_harness';

afterAll(cleanupAllUsers);

describe('O-A — émission du sujet frais (staging)', () => {
  it('⭐ non confirmé → AUCUN Passeport ; confirmation → Passeport privé, identity_established', async () => {
    // 1. Sujet FRAIS, identité NON vérifiée (comme à l'arrivée sur /link sans session).
    const u = await createUser({ tag: 'oa-fresh', confirmed: false });

    // V1 — rien n'est émis tant que l'email n'est pas réellement confirmé.
    expect(await adminPassportCount(u.id)).toBe(0);

    // 2. Confirmation de l'email = transition email_confirmed_at (chemin magic link).
    const { error } = await admin.auth.admin.updateUserById(u.id, { email_confirm: true });
    expect(error).toBeNull();

    // 3. Le trigger a émis : le Passeport naît, privé par défaut.
    const passport = await waitForPassport(u.id);
    expect(passport).not.toBeNull();
    expect(passport!.visibility).toBe('private');
    expect(passport!.lifecycle_stage).toBe('identity_established');
    expect(await adminPassportCount(u.id)).toBe(1);
  });

  it('confirmation IDEMPOTENTE : re-confirmer ne crée jamais un 2ᵉ Passeport', async () => {
    const u = await createUser({ tag: 'oa-fresh-idem', confirmed: false });
    await admin.auth.admin.updateUserById(u.id, { email_confirm: true });
    await waitForPassport(u.id);

    // Une seconde écriture de email_confirmed_at ne doit pas dédoubler l'émission.
    await admin.auth.admin.updateUserById(u.id, { email_confirm: true });
    await new Promise((r) => setTimeout(r, 400));

    expect(await adminPassportCount(u.id)).toBe(1);
    const passport = await adminPassport(u.id);
    expect(passport!.visibility).toBe('private');
  });
});
