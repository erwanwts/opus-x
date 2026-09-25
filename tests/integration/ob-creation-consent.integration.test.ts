/**
 * =====================================================================
 * O-B (D-054) — le consentement de CRÉATION, dans son propre système.
 * =====================================================================
 * Point d'arrêt, sur STAGING (jamais la prod) : à l'émission, une ligne de
 * consentement-création DÉDIÉE existe, SÉPARÉE des deux autres systèmes —
 * public.consents (produit) et wsp_consent_events (autorisation d'Issuer).
 *
 * Chemin FIDÈLE : on pose passport_creation dans les métadonnées de signup
 * (comme establishIdentity), sujet NON confirmé, puis on confirme → le trigger
 * d'émission matérialise la ligne (issue_passport, réservé au trigger).
 *
 * Falsifiable :
 *   • flux AVEC passport_creation → 1 ligne (decision='create', granted) ;
 *   • absente de public.consents (terms/privacy) et de wsp_consent_events (0) ;
 *   • flux SANS passport_creation → AUCUNE ligne de création, produit intact
 *     → les trois systèmes sont indépendants (mutation-prouvé).
 * =====================================================================
 */
import { describe, it, expect, afterAll } from 'vitest';
import {
  admin,
  waitForPassport,
  adminProfile,
  adminConsents,
  adminCreationConsents,
} from './_harness';

const createdIds: string[] = [];

/** Crée un sujet NON confirmé avec des métadonnées de signup arbitraires. */
async function createUnconfirmed(tag: string, meta: Record<string, unknown>): Promise<string> {
  const email = `opusx-qa-${tag}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}@example.com`;
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: `Pw!${Math.random().toString(36).slice(2, 10)}Aa9`,
    email_confirm: false,
    user_metadata: meta,
  });
  if (error || !data.user) throw new Error(`createUser: ${error?.message}`);
  createdIds.push(data.user.id);
  return data.user.id;
}

/** Confirme l'email (transition email_confirmed_at) → déclenche l'émission. */
async function confirm(id: string) {
  const { error } = await admin.auth.admin.updateUserById(id, { email_confirm: true });
  if (error) throw new Error(`confirm: ${error.message}`);
}

afterAll(async () => {
  for (const id of createdIds) {
    try {
      await admin.auth.admin.deleteUser(id);
    } catch {
      /* best-effort */
    }
  }
});

const V = { version: 'v1.0.0', effective_date: '2026-07-11' };

describe('O-B — consentement de création (staging)', () => {
  it('⭐ flux AVEC passport_creation → ligne dédiée, séparée des deux autres systèmes', async () => {
    const id = await createUnconfirmed('ob-create', {
      full_name: 'QA Create',
      locale: 'fr',
      consents: [
        { type: 'terms', granted: true, ...V },
        { type: 'privacy', granted: true, ...V },
      ],
      passport_creation: { decision: 'create', granted: true, ...V },
    });
    await confirm(id);
    await waitForPassport(id);
    const prof = await adminProfile(id);

    // 1. Système DÉDIÉ : une ligne de création, decision='create', accordée.
    const creation = await adminCreationConsents(id);
    expect(creation).toHaveLength(1);
    expect(creation[0].decision).toBe('create');
    expect(creation[0].granted).toBe(true);
    expect(creation[0].version).toBe('v1.0.0');

    // 2. SÉPARÉ du système produit : public.consents ne porte que terms/privacy.
    const product = await adminConsents(id);
    expect(product.map((c) => c.type).sort()).toEqual(['privacy', 'terms']);
    expect(product.some((c) => 'decision' in c)).toBe(false);

    // 3. SÉPARÉ du système d'émission Issuer : aucun événement (aucun octroi ici).
    const { count } = await admin
      .from('wsp_consent_events')
      .select('id', { count: 'exact', head: true })
      .eq('subject_id', prof!.opus_id);
    expect(count ?? 0).toBe(0);
  });

  it('sujet établi PUIS re-confirmé → idempotent : toujours 1 seule ligne de création', async () => {
    const id = await createUnconfirmed('ob-idem', {
      full_name: 'QA Idem',
      locale: 'fr',
      passport_creation: { decision: 'create', granted: true, ...V },
    });
    await confirm(id);
    await waitForPassport(id);
    await confirm(id); // re-confirmation
    await new Promise((r) => setTimeout(r, 400));
    expect(await adminCreationConsents(id)).toHaveLength(1);
  });

  it('flux SANS passport_creation → AUCUNE ligne de création, produit intact', async () => {
    const id = await createUnconfirmed('ob-nocreate', {
      full_name: 'QA No Create',
      locale: 'fr',
      consents: [{ type: 'terms', granted: true, ...V }],
    });
    await confirm(id);
    await waitForPassport(id);

    expect(await adminCreationConsents(id)).toHaveLength(0); // système indépendant
    expect((await adminConsents(id)).length).toBeGreaterThanOrEqual(1); // produit intact
  });
});
