/**
 * LOT 11 — La GARDE DE SÉCURITÉ elle-même.
 * On prouve qu'elle REFUSE dès que la cible de test = la base principale,
 * et qu'elle ACCEPTE la configuration de staging réellement en place.
 */
import { describe, it, expect } from 'vitest';
import { firstGuardViolation, TEST_URL, MAIN_URL, projectRef } from './_harness';

const SVC = 'svc';
const ANON = 'anon';

describe('Garde de sécurité QA', () => {
  it('REFUSE si l’URL de test est identique à celle de .env.local', () => {
    const v = firstGuardViolation({
      testUrl: 'https://mainproj.supabase.co',
      mainUrl: 'https://mainproj.supabase.co',
      service: SVC,
      anon: ANON,
    });
    expect(v).toMatch(/IDENTIQUE/);
  });

  it('REFUSE si le project ref est le même malgré un slash final / une casse', () => {
    const v = firstGuardViolation({
      testUrl: 'https://MainProj.supabase.co/',
      mainUrl: 'https://mainproj.supabase.co',
      service: SVC,
      anon: ANON,
    });
    expect(v).toMatch(/MÊME/);
  });

  it('REFUSE si la service_role est absente', () => {
    const v = firstGuardViolation({
      testUrl: 'https://staging.supabase.co',
      mainUrl: 'https://main.supabase.co',
      service: undefined,
      anon: ANON,
    });
    expect(v).toMatch(/SERVICE_ROLE/);
  });

  it('ACCEPTE deux projets distincts', () => {
    const v = firstGuardViolation({
      testUrl: 'https://staging.supabase.co',
      mainUrl: 'https://main.supabase.co',
      service: SVC,
      anon: ANON,
    });
    expect(v).toBeNull();
  });

  it('la configuration réelle cible bien le staging, PAS la principale', () => {
    expect(TEST_URL).toBeTruthy();
    expect(projectRef(TEST_URL)).not.toBe(projectRef(MAIN_URL));
    // Sanity : les refs connues du sprint.
    expect(projectRef(TEST_URL)).toBe('bnzahwzuwoxjrxpqsjhp');
    expect(projectRef(MAIN_URL)).toBe('lhqephwypvcnkaezmmtx');
  });
});
