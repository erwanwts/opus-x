/**
 * =====================================================================
 * O-C (D-053) — table de liaison : Opus X AUTORITAIRE, unicité qui MORD.
 * =====================================================================
 * Point d'arrêt, sur STAGING (jamais la prod) : le couple
 * (issuer_id, external_subject_id) résout vers UN opus, et NUL ne peut le
 * repointer. Deux preuves indépendantes que l'unicité mord :
 *   • par la RPC : un AUTRE sujet qui réclame le même couple → refus ;
 *   • par la BASE : un INSERT direct (service_role) d'un doublon → 23505.
 *     (La contrainte tient même si un jour une écriture contournait la RPC.)
 *
 * Sujet TOUJOURS dérivé de la session (P3) : la RPC ne prend jamais l'opus_id.
 * =====================================================================
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  admin,
  createUser,
  signIn,
  waitForPassport,
  adminProfile,
  cleanupAllUsers,
} from './_harness';
import type { SupabaseClient } from '@supabase/supabase-js';

afterAll(cleanupAllUsers);

const ISSUER = 'issuer:qa-link-x';
const uniqExt = (p: string) => `${p}_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e6).toString(36)}`;

let opusA: string, opusB: string;
let sessionA: SupabaseClient, sessionB: SupabaseClient;

beforeAll(async () => {
  await admin.from('wsp_issuers').upsert(
    { id: ISSUER, display_name: 'QA Link Issuer', status: 'active', redirect_uri: 'https://qa-link.example/callback' },
    { onConflict: 'id', ignoreDuplicates: true },
  );

  const a = await createUser({ tag: 'oc-a', confirmed: true });
  const b = await createUser({ tag: 'oc-b', confirmed: true });
  await waitForPassport(a.id);
  await waitForPassport(b.id);
  opusA = (await adminProfile(a.id))!.opus_id as string;
  opusB = (await adminProfile(b.id))!.opus_id as string;
  sessionA = await signIn(a.email, a.password);
  sessionB = await signIn(b.email, b.password);
});

describe('O-C — reliage autoritaire (staging)', () => {
  it('⭐ le sujet relie son id externe → opus (session, jamais fourni) ; re-relier = idempotent', async () => {
    const ext = uniqExt('stu');

    const first = await sessionA.rpc('wsp_link_subject', { p_issuer_id: ISSUER, p_external_subject_id: ext });
    expect(first.error).toBeNull();
    expect(first.data.status).toBe('linked');
    expect(first.data.opus_id).toBe(opusA); // dérivé de la session A

    // Idempotent : même sujet, même couple → 'existing', aucune 2e ligne.
    const again = await sessionA.rpc('wsp_link_subject', { p_issuer_id: ISSUER, p_external_subject_id: ext });
    expect(again.error).toBeNull();
    expect(again.data.status).toBe('existing');

    const { count } = await admin
      .from('wsp_issuer_subject_links')
      .select('id', { count: 'exact', head: true })
      .eq('issuer_id', ISSUER)
      .eq('external_subject_id', ext);
    expect(count).toBe(1);

    // Résolution service_role : le couple → opusA.
    const resolved = await admin.rpc('wsp_resolve_external_subject', {
      p_issuer_id: ISSUER, p_external_subject_id: ext,
    });
    expect(resolved.data).toBe(opusA);
  });

  it('⭐ UNICITÉ MORD (RPC) : un AUTRE sujet ne peut pas repointer le couple', async () => {
    const ext = uniqExt('stu');
    await sessionA.rpc('wsp_link_subject', { p_issuer_id: ISSUER, p_external_subject_id: ext });

    // B réclame le MÊME couple → refus (Opus X autoritaire).
    const conflict = await sessionB.rpc('wsp_link_subject', { p_issuer_id: ISSUER, p_external_subject_id: ext });
    expect(conflict.error).not.toBeNull();

    // La vérité n'a pas bougé : le couple résout toujours vers A.
    const resolved = await admin.rpc('wsp_resolve_external_subject', {
      p_issuer_id: ISSUER, p_external_subject_id: ext,
    });
    expect(resolved.data).toBe(opusA);
  });

  it('⭐ UNICITÉ MORD (BASE) : un INSERT direct d’un doublon échoue en 23505', async () => {
    const ext = uniqExt('stu');
    await sessionA.rpc('wsp_link_subject', { p_issuer_id: ISSUER, p_external_subject_id: ext });

    // Contournement de la RPC : écriture directe service_role d'un doublon
    // vers un AUTRE opus. La CONTRAINTE doit mordre même ici.
    const dup = await admin
      .from('wsp_issuer_subject_links')
      .insert({ issuer_id: ISSUER, external_subject_id: ext, opus_id: opusB });
    expect(dup.error).not.toBeNull();
    expect(dup.error!.code).toBe('23505'); // unique_violation
  });
});
