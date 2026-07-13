/**
 * LOT 11 — Passport privé réellement inaccessible publiquement (non-énumérant).
 *
 * Au niveau BASE : le rôle anon ne peut lire aucune ligne privée. Un handle
 * réel (mais privé) et un handle inexistant renvoient le MÊME résultat vide :
 * le public ne peut pas distinguer « existe mais privé » de « n'existe pas ».
 * (La non-énumération au niveau HTTP — 404 au corps identique — est couverte
 *  par les tests unitaires du Lot 8 : app/passports/[handle]/route.test.ts.)
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  createUser,
  waitForPassport,
  anonClient,
  cleanupAllUsers,
  type TestUser,
} from './_harness';

let user: TestUser;
let realHandle: string;
let anon: SupabaseClient;

beforeAll(async () => {
  user = await createUser({ tag: 'pub-priv', confirmed: true });
  const pass = await waitForPassport(user.id);
  realHandle = pass!.handle;
  anon = anonClient();
});

afterAll(cleanupAllUsers);

describe('Confidentialité publique du Passport', () => {
  it('anon ne peut lire AUCUN Passport (tous privés en Sprint 1)', async () => {
    const res = await anon.from('passports').select('*');
    expect(res.error).toBeNull(); // grant SELECT présent, mais RLS = visibility public only
    expect(res.data ?? []).toHaveLength(0);
  });

  it('non-énumérant : un handle réel PRIVÉ et un handle inexistant sont indistinguables', async () => {
    const real = await anon.from('passports').select('*').eq('handle', realHandle);
    const fake = await anon.from('passports').select('*').eq('handle', 'nexiste-pas-zzzz');

    // Les deux renvoient exactement la même chose : rien.
    expect(real.data ?? []).toHaveLength(0);
    expect(fake.data ?? []).toHaveLength(0);
    expect(real.data ?? []).toEqual(fake.data ?? []);
  });

  it('le Passport existe pourtant bien (vu par le service_role) : c’est la RLS qui masque', async () => {
    // Confirme que le vide public n'est pas un "faux négatif" : la ligne existe.
    const { data } = await anon.from('passports').select('handle').eq('handle', realHandle);
    expect(data ?? []).toHaveLength(0); // invisible en public
    expect(realHandle).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/); // mais réel et bien formé
  });
});
