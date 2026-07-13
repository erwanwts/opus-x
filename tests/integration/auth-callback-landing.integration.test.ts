/**
 * LOT 12 — Correctif de parcours : ATTERRISSAGE après le magic link.
 *
 * Reproduit le scénario du bug de prod, corrigé : une identité vérifie son
 * email (l'équivalent live de l'échange de code — verifyOtp transforme le
 * jeton à usage unique en session, comme exchangeCodeForSession), la SESSION
 * EST POSÉE, /emission devient atteignable (la garde V1 du middleware est
 * franchie car email_confirmed_at est renseigné), et finalize_emission()
 * renvoie complete:true.
 *
 * V1 n'est jamais affaiblie : AVANT la vérification, aucun passport et aucune
 * session ; c'est bien la vérification qui débloque tout.
 */
import { describe, it, expect, afterAll } from 'vitest';
import { createUser, anonClient, admin, adminPassport, waitForPassport, cleanupAllUsers } from './_harness';

afterAll(cleanupAllUsers);

describe('Atterrissage post-magic-link', () => {
  it('AVANT vérification : aucune session, aucun passport (V1 intacte)', async () => {
    const u = await createUser({ tag: 'land-before', confirmed: false });
    await new Promise((r) => setTimeout(r, 400));
    expect(await adminPassport(u.id)).toBeNull();

    const { data } = await admin.auth.admin.getUserById(u.id);
    expect(data.user?.email_confirmed_at ?? null).toBeNull();
  });

  it('vérification → SESSION POSÉE → /emission atteignable → finalize complete:true', async () => {
    // Identité établie mais pas encore « atterrie » (lien non cliqué).
    const u = await createUser({ tag: 'land-success', confirmed: false });
    expect(await adminPassport(u.id)).toBeNull(); // V1 : rien encore

    // Le lien magique : on génère le jeton comme le ferait l'email…
    const { data: link, error: linkErr } = await admin.auth.admin.generateLink({
      type: 'magiclink',
      email: u.email,
    });
    expect(linkErr).toBeNull();
    const tokenHash = link!.properties!.hashed_token;

    // …et l'onglet l'échange contre une SESSION (analogue exchangeCodeForSession).
    const browser = anonClient();
    const { data: verified, error: verifyErr } = await browser.auth.verifyOtp({
      token_hash: tokenHash,
      type: 'magiclink',
    });
    expect(verifyErr).toBeNull();
    // La session est bel et bien posée dans ce client.
    expect(verified.session).not.toBeNull();

    // Garde V1 du middleware : email_confirmed_at renseigné ⇒ /emission passe.
    const { data: who } = await browser.auth.getUser();
    expect(who.user?.email_confirmed_at).toBeTruthy();

    // L'émission a été déclenchée par la confirmation ; la cérémonie la finalise.
    await waitForPassport(u.id);
    const { data: fin, error: finErr } = await browser.rpc('finalize_emission');
    expect(finErr).toBeNull();
    expect(fin.complete).toBe(true);
    expect(fin.lifecycle_stage).toBe('identity_established');
    expect(fin.opus_id).toMatch(/^opx_/);
  });
});
