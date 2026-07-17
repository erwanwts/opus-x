/**
 * LOT 11 + WEB-003 Lot 3 — Passport public : posture RENFORCÉE (vue + Point B).
 *
 * Depuis Lot 3, l'anon ne lit plus AUCUNE table brute :
 *   • `passports` et `profiles` sont RÉVOQUÉS pour anon → accès direct = erreur.
 *   • La lecture publique passe EXCLUSIVEMENT par `public_passport_view`, qui ne
 *     projette que {handle, lifecycle_stage, display_name, headline} des seules
 *     lignes visibility='public'.
 *
 * On prouve : (A) Point B fermé — tables brutes inaccessibles à anon ;
 * (B) non-énumération via la vue — privé/inexistant indistinguables ;
 * (C) sur une ligne publique, la vue ne renvoie QUE les 4 colonnes publiques
 * (jamais profile_id / id / status), et le nom (display_name) est bien servi.
 *
 * Rollback empreinte nulle : le compte démo est supprimé en afterAll (cascade).
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  admin,
  createUser,
  waitForPassport,
  anonClient,
  cleanupAllUsers,
  type TestUser,
} from './_harness';

const PUBLIC_VIEW_COLUMNS = ['handle', 'lifecycle_stage', 'display_name', 'headline'];

let user: TestUser;
let realHandle: string;
let anon: SupabaseClient;

beforeAll(async () => {
  user = await createUser({ tag: 'pub-posture', confirmed: true, fullName: 'QA Public Name' });
  const pass = await waitForPassport(user.id);
  realHandle = pass!.handle;
  anon = anonClient();
});

afterAll(cleanupAllUsers);

describe('Passport public — posture renforcée (Point B fermé + vue)', () => {
  it('A) Point B : l’anon ne lit AUCUNE table brute (passports & profiles révoqués)', async () => {
    const passports = await anon.from('passports').select('*');
    const profiles = await anon.from('profiles').select('*');
    // Accès direct révoqué → PostgREST renvoie une erreur (permission denied).
    expect(passports.error).not.toBeNull();
    expect(profiles.error).not.toBeNull();
  });

  it('B) non-énumérant via la vue : un handle réel PRIVÉ et un inexistant sont indistinguables', async () => {
    const real = await anon.from('public_passport_view').select('*').eq('handle', realHandle);
    const fake = await anon.from('public_passport_view').select('*').eq('handle', 'nexiste-pas-zzzz');

    // Le Passport est privé (Sprint 1) → absent de la vue, comme l'inexistant.
    expect(real.data ?? []).toHaveLength(0);
    expect(fake.data ?? []).toHaveLength(0);
    expect(real.data ?? []).toEqual(fake.data ?? []);
  });

  it('C) ligne publique : la vue ne renvoie QUE les 4 colonnes publiques, nom servi, aucun champ interne', async () => {
    // Ouverture ciblée (service_role) de CE handle uniquement.
    const up = await admin.from('passports').update({ visibility: 'public' }).eq('handle', realHandle);
    expect(up.error).toBeNull();

    try {
      const res = await anon.from('public_passport_view').select('*').eq('handle', realHandle);
      expect(res.error).toBeNull();
      const row = (res.data ?? [])[0];
      expect(row).toBeTruthy();

      // EXACTEMENT les 4 colonnes publiques — jamais profile_id / id / status.
      expect(Object.keys(row).sort()).toEqual([...PUBLIC_VIEW_COLUMNS].sort());
      expect(row).not.toHaveProperty('profile_id');
      expect(row).not.toHaveProperty('id');
      expect(row).not.toHaveProperty('status');

      // Le nom est bien servi par la vue (join profiles).
      expect(row.display_name).toBe('QA Public Name');
      expect(row.lifecycle_stage).toBe('identity_established');
    } finally {
      // Défensif : on referme immédiatement (afterAll supprime aussi le compte).
      await admin.from('passports').update({ visibility: 'private' }).eq('handle', realHandle);
    }
  });
});
