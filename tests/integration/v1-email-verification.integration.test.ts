/**
 * LOT 11 — VIGILANCE V1 (la plus importante du sprint) + "lien magique expiré".
 *
 * INVARIANT FONDAMENTAL : aucune identité non vérifiée ne reçoit de Passport.
 *
 * On le prouve sur trois plans convergents :
 *   V1-a  Garde du trigger : email_confirmed_at IS NULL ⇒ 0 profil, 0 passport.
 *   V1-b  Refus de session : la plateforme n'émet AUCUNE session à un non
 *         confirmé ⇒ finalize_emission() lui est INATTEIGNABLE (auth.uid()
 *         ne peut jamais désigner une identité non vérifiée).
 *   V1-c  Contrôle positif : au moment EXACT de la confirmation, le Passport
 *         est émis ⇒ la barrière, c'est bien la vérification de l'email.
 *
 * "Lien magique expiré" = confirmation jamais acquise : même invariant que V1-a/b,
 *   plus le rejet d'un token invalide/expiré par verifyOtp.
 *
 * NOTE d'honnêteté (défense en profondeur) : finalize_emission() reteste
 *   email_confirmed_at côté serveur et renverrait { complete:false,
 *   reason:'email_not_verified' }. Cette branche est INATTEIGNABLE par
 *   construction — la plateforme n'ouvre pas de session à un non confirmé —
 *   donc elle ne peut être exercée en live sans dé-confirmer un utilisateur,
 *   ce que GoTrue refuse (email_confirm:false à l'update ne vide pas le
 *   timestamp). On ne fabrique donc pas un PASS artificiel : les garanties
 *   V1-a et V1-b sont strictement plus fortes.
 */
import { describe, it, expect, afterAll } from 'vitest';
import {
  createUser,
  signIn,
  trySignIn,
  adminProfile,
  adminPassport,
  waitForPassport,
  anonClient,
  admin,
  cleanupAllUsers,
} from './_harness';

afterAll(cleanupAllUsers);

describe('V1 — aucune identité non vérifiée ne reçoit de Passport', () => {
  it('V1-a · email non confirmé ⇒ AUCUN profil, AUCUN passport (garde du trigger)', async () => {
    const u = await createUser({ tag: 'v1-unconf', confirmed: false });

    // Laisser au trigger toute chance de s'exécuter : il ne DOIT rien faire.
    await new Promise((r) => setTimeout(r, 600));

    expect(await adminProfile(u.id)).toBeNull();
    expect(await adminPassport(u.id)).toBeNull();
  });

  it('V1-b · la plateforme REFUSE la session à un non confirmé ⇒ finalize inatteignable', async () => {
    const u = await createUser({ tag: 'v1-nosession', confirmed: false });
    const attempt = await trySignIn(u.email, u.password);

    expect(attempt.hasSession).toBe(false);
    expect(attempt.error).toMatch(/confirm/i); // "Email not confirmed"

    // Sans session, l'appel RPC s'exécute en rôle anon : auth.uid() est nul,
    // finalize_emission lève "Non authentifié" (42501). Jamais d'émission.
    const { data, error } = await attempt.client.rpc('finalize_emission');
    expect(data == null || data.complete !== true).toBe(true);
    expect(error).not.toBeNull();

    // Et toujours rien en base.
    expect(await adminPassport(u.id)).toBeNull();
  });

  it('V1-c · contrôle positif : la confirmation de l’email DÉCLENCHE l’émission', async () => {
    const u = await createUser({ tag: 'v1-conf', confirmed: true });
    const passport = await waitForPassport(u.id);

    expect(passport).not.toBeNull();
    expect(passport!.lifecycle_stage).toBe('identity_established');
    const profile = await adminProfile(u.id);
    expect(profile!.opus_id).toMatch(/^opx_/);

    // La session, elle, est bien accordée à une identité vérifiée.
    const session = await signIn(u.email, u.password);
    const { data } = await session.auth.getUser();
    expect(data.user?.email_confirmed_at).toBeTruthy();
  });

  it('lien magique expiré/invalide ⇒ verifyOtp rejette, aucune session, aucun passport', async () => {
    const u = await createUser({ tag: 'v1-expired', confirmed: false });

    // Un token de confirmation faux/expiré ne peut pas vérifier l'identité.
    const anon = anonClient();
    const { data, error } = await anon.auth.verifyOtp({
      email: u.email,
      token: '000000',
      type: 'email',
    });
    expect(error).not.toBeNull();
    expect(data?.session ?? null).toBeNull();

    // L'identité reste non vérifiée ⇒ aucune émission.
    const { data: gu } = await admin.auth.admin.getUserById(u.id);
    expect(gu.user?.email_confirmed_at ?? null).toBeNull();
    expect(await adminPassport(u.id)).toBeNull();
  });
});
