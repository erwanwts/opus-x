/**
 * =====================================================================
 * T-A (D-058→D-062) — tokens de partage : générer / révoquer / hash-only.
 * =====================================================================
 * Point d'arrêt FALSIFIABLE, sur STAGING (jamais la prod) :
 *   • générer → UN token en clair renvoyé UNE seule fois ; en base, seul le
 *     HASH (sha256) est stocké — le clair n'est JAMAIS relisible ;
 *   • révoquer → le token devient inactif (revoked_at posé) ; idempotent ;
 *   • MVP 1 token stable (D-059) : générer à nouveau ROTE (≤ 1 actif).
 *
 * Le clair-jamais-stocké est prouvé en comparant token_hash au sha256 calculé
 * côté TS (hashLinkToken) : si la base stockait le clair, l'égalité casserait.
 * =====================================================================
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  createUser,
  signIn,
  waitForPassport,
  adminPassport,
  adminShareTokens,
  cleanupAllUsers,
} from './_harness';
import { hashLinkToken } from '../../lib/link/issuerAuthToken';
import type { SupabaseClient } from '@supabase/supabase-js';

afterAll(cleanupAllUsers);

let session: SupabaseClient;
let passportId: string;

beforeAll(async () => {
  const u = await createUser({ tag: 'ta-share', confirmed: true });
  await waitForPassport(u.id);
  passportId = (await adminPassport(u.id))!.id as string;
  session = await signIn(u.email, u.password);
});

describe('T-A — tokens de partage (staging)', () => {
  it('⭐ générer → 1 clair une seule fois ; en base, SEUL le hash (clair jamais relisible)', async () => {
    const gen = await session.rpc('generate_share_token');
    expect(gen.error).toBeNull();
    const clear = (gen.data as { share_token: string }).share_token;
    expect(clear.startsWith('wsps_')).toBe(true);
    expect(clear.length).toBeGreaterThan(64); // 'wsps_' + 64 hex

    // En base : une ligne active, token_hash = sha256(clair). Le clair N'EST PAS stocké.
    const rows = await adminShareTokens(passportId);
    const active = rows.filter((r) => r.revoked_at === null);
    expect(active).toHaveLength(1);
    expect(active[0].token_hash).toBe(hashLinkToken(clear));   // hash, pas le clair
    expect(active[0].token_hash).not.toBe(clear);
    // Aucune colonne ne porte le clair (sérialisation complète de la ligne).
    expect(JSON.stringify(active[0])).not.toContain(clear);
  });

  it('⭐ révoquer → inactif ; idempotent (2e révocation = no-op, pas d’erreur)', async () => {
    const rev = await session.rpc('revoke_share_token');
    expect(rev.error).toBeNull();
    expect((rev.data as { revoked: number }).revoked).toBeGreaterThanOrEqual(1);

    const active1 = (await adminShareTokens(passportId)).filter((r) => r.revoked_at === null);
    expect(active1).toHaveLength(0); // plus aucun actif

    const rev2 = await session.rpc('revoke_share_token');
    expect(rev2.error).toBeNull();
    expect((rev2.data as { revoked: number }).revoked).toBe(0); // idempotent
  });

  it('⭐ MVP 1 token stable (D-059) : re-générer ROTE → ≤ 1 actif, clairs distincts', async () => {
    const a = (await session.rpc('generate_share_token')).data as { share_token: string };
    const b = (await session.rpc('generate_share_token')).data as { share_token: string };
    expect(a.share_token).not.toBe(b.share_token); // rotation → nouveau clair

    const active = (await adminShareTokens(passportId)).filter((r) => r.revoked_at === null);
    expect(active).toHaveLength(1);                 // au plus un actif
    expect(active[0].token_hash).toBe(hashLinkToken(b.share_token)); // le dernier gagne
  });
});
