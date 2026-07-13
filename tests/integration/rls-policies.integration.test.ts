/**
 * LOT 11 — Accès aux données d'un autre utilisateur + AUDIT DE TOUTES LES
 * POLICIES RLS, une par une.
 *
 * Principe vérifié : deny-by-default. B ne lit RIEN de A. anon ne lit rien
 * de privé. Les tables stub (frameworks/partners) sont totalement closes.
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  createUser,
  signIn,
  waitForPassport,
  anonClient,
  adminPassport,
  cleanupAllUsers,
  type TestUser,
} from './_harness';

let A: TestUser;
let B: TestUser;
let bSession: SupabaseClient; // authentifié en tant que B
let anon: SupabaseClient; // public, sans session
let aPassportId: string;

beforeAll(async () => {
  A = await createUser({ tag: 'rls-A', confirmed: true, fullName: 'Alice A' });
  B = await createUser({ tag: 'rls-B', confirmed: true, fullName: 'Bob B' });
  const aPass = await waitForPassport(A.id);
  await waitForPassport(B.id);
  aPassportId = aPass!.id;
  bSession = await signIn(B.email, B.password);
  anon = anonClient();
});

afterAll(cleanupAllUsers);

/** Aucune ligne remontée (que ce soit par erreur de grant ou par RLS vide). */
function expectNoRows(res: { data: unknown[] | null }) {
  expect(res.data ?? []).toHaveLength(0);
}

describe('Accès croisé — B ne lit RIEN de A', () => {
  it('profiles : B ne voit pas le profil de A, et ne voit que le sien', async () => {
    expectNoRows(await bSession.from('profiles').select('*').eq('id', A.id));
    const own = await bSession.from('profiles').select('*');
    expect(own.data).toHaveLength(1);
    expect(own.data![0].id).toBe(B.id);
  });

  it('passports : B ne voit pas le Passport de A, et ne voit que le sien', async () => {
    expectNoRows(await bSession.from('passports').select('*').eq('profile_id', A.id));
    const own = await bSession.from('passports').select('*');
    expect(own.data).toHaveLength(1);
    expect(own.data![0].profile_id).toBe(B.id);
  });

  it('trust_index / skills / evidence de A : invisibles pour B', async () => {
    expectNoRows(await bSession.from('trust_index').select('*').eq('passport_id', aPassportId));
    expectNoRows(await bSession.from('skills').select('*').eq('passport_id', aPassportId));
    expectNoRows(await bSession.from('evidence').select('*').eq('passport_id', aPassportId));
  });

  it('consents de A : invisibles pour B', async () => {
    expectNoRows(await bSession.from('consents').select('*').eq('profile_id', A.id));
  });

  it('B ne peut pas MODIFIER le Passport de A (RLS with check)', async () => {
    const res = await bSession
      .from('passports')
      .update({ visibility: 'public' })
      .eq('profile_id', A.id)
      .select();
    expectNoRows(res); // aucune ligne affectée
    // Et le Passport de A reste strictement privé.
    const aPass = await adminPassport(A.id);
    expect(aPass!.visibility).toBe('private');
  });

  it('B ne peut pas MODIFIER le profil de A', async () => {
    const res = await bSession
      .from('profiles')
      .update({ headline: 'pirané' })
      .eq('id', A.id)
      .select();
    expectNoRows(res);
  });
});

describe('Audit des policies RLS — table par table', () => {
  // -- profiles ---------------------------------------------------------
  it('profiles : SELECT self autorisé, INSERT client interdit, anon interdit', async () => {
    // self OK
    const self = await bSession.from('profiles').select('id').eq('id', B.id);
    expect(self.data).toHaveLength(1);
    // insert client interdit (aucune policy INSERT)
    const ins = await bSession.from('profiles').insert({ id: B.id, opus_id: 'opx_x', full_name: 'x' });
    expect(ins.error).not.toBeNull();
    // anon : grant révoqué
    const an = await anon.from('profiles').select('*');
    expect(an.error).not.toBeNull();
  });

  // -- passports --------------------------------------------------------
  it('passports : SELECT owner OK, anon limité à visibility=public (⇒ 0), INSERT/DELETE client interdits', async () => {
    const owner = await bSession.from('passports').select('id').eq('profile_id', B.id);
    expect(owner.data).toHaveLength(1);
    // anon : la policy publique existe mais aucune ligne n'est publique.
    const an = await anon.from('passports').select('*');
    expect(an.error).toBeNull();
    expectNoRows(an);
    // insert client interdit
    const ins = await bSession
      .from('passports')
      .insert({ profile_id: B.id, handle: 'hack-handle' });
    expect(ins.error).not.toBeNull();
    // delete client interdit (aucune policy DELETE) ⇒ 0 ligne affectée
    const del = await bSession.from('passports').delete().eq('profile_id', B.id).select();
    expectNoRows(del);
    expect(await adminPassport(B.id)).not.toBeNull(); // toujours là
  });

  // -- trust_index ------------------------------------------------------
  it('trust_index : SELECT owner OK, écriture client interdite, anon interdit', async () => {
    const own = await bSession
      .from('trust_index')
      .select('*, passports!inner(profile_id)')
      .eq('passports.profile_id', B.id);
    expect(own.error).toBeNull();
    // écriture interdite (aucune policy INSERT/UPDATE)
    const bPass = await adminPassport(B.id);
    const upd = await bSession
      .from('trust_index')
      .update({ score: 99 })
      .eq('passport_id', bPass!.id)
      .select();
    expectNoRows(upd);
    // anon révoqué
    expect((await anon.from('trust_index').select('*')).error).not.toBeNull();
  });

  // -- skills / evidence ------------------------------------------------
  it('skills : SELECT owner OK (vide), écriture client interdite, anon interdit', async () => {
    expect((await bSession.from('skills').select('*')).error).toBeNull();
    const ins = await bSession.from('skills').insert({ passport_id: aPassportId, name: 'x' });
    expect(ins.error).not.toBeNull();
    expect((await anon.from('skills').select('*')).error).not.toBeNull();
  });

  it('evidence : SELECT owner OK (vide), écriture client interdite, anon interdit', async () => {
    expect((await bSession.from('evidence').select('*')).error).toBeNull();
    const ins = await bSession
      .from('evidence')
      .insert({ passport_id: aPassportId, type: 'x', title: 'x' });
    expect(ins.error).not.toBeNull();
    expect((await anon.from('evidence').select('*')).error).not.toBeNull();
  });

  // -- consents ---------------------------------------------------------
  it('consents : SELECT/INSERT owner OK, insert POUR AUTRUI interdit, anon interdit', async () => {
    // owner voit ses 2 consentements
    const own = await bSession.from('consents').select('*').eq('profile_id', B.id);
    expect(own.data!.length).toBeGreaterThanOrEqual(2);
    // insert pour SOI, valide
    const okIns = await bSession.from('consents').insert({
      profile_id: B.id,
      type: 'public_share',
      granted: false,
      version: 'v1.0.0',
      effective_date: '2026-07-11',
    });
    expect(okIns.error).toBeNull();
    // insert POUR A (usurpation) : refusé par with check (profile_id = auth.uid())
    const badIns = await bSession.from('consents').insert({
      profile_id: A.id,
      type: 'public_share',
      granted: true,
      version: 'v1.0.0',
      effective_date: '2026-07-11',
    });
    expect(badIns.error).not.toBeNull();
    // anon révoqué
    expect((await anon.from('consents').select('*')).error).not.toBeNull();
  });

  // -- stubs : frameworks / passport_frameworks / partners --------------
  it('stubs (frameworks / passport_frameworks / partners) : clos pour anon ET authenticated', async () => {
    for (const table of ['frameworks', 'passport_frameworks', 'partners']) {
      expect((await bSession.from(table).select('*')).error).not.toBeNull();
      expect((await anon.from(table).select('*')).error).not.toBeNull();
    }
  });
});
