/**
 * Garde de parité STAGING ↔ DÉPÔT (D-037) — la DÉCISION pure, falsifiable.
 *
 * On prouve par MUTATION : chaque sentinelle qu'on « éteint » doit produire
 * une violation nommée. Une garde qui ne vérifierait plus un invariant
 * casserait ici — pas de tautologie.
 */
import { describe, it, expect } from 'vitest';
import { parityViolation, SENTINELS, type ParityProbes } from './parityRules';

const CONFORME: ParityProbes = {
  bridgeResolveFn: 'present',
  publicViewIssuedAt: 'present',
  anonPassportsRaw: 'denied',
  passportUpdatesTable: 'present',
  skillsSourceFn: 'present',
  lifecycleAdvanceFn: 'present',
};

describe('parityViolation — garde vérité-terrain (pure)', () => {
  it('staging CONFORME → aucune violation (null)', () => {
    expect(parityViolation(CONFORME)).toBeNull();
  });

  it('MUTATION — pont absent → violation nommant la fonction et sa migration', () => {
    const v = parityViolation({ ...CONFORME, bridgeResolveFn: 'absent' });
    expect(v).not.toBeNull();
    expect(v).toContain('wsp_resolve_subject_passport');
    expect(v).toContain('20260831000001_wsp_passport_bridge');
  });

  it('MUTATION — issued_at absent → violation nommant la colonne', () => {
    const v = parityViolation({ ...CONFORME, publicViewIssuedAt: 'absent' });
    expect(v).not.toBeNull();
    expect(v).toContain('issued_at');
    expect(v).toContain('20260717000002_public_passport_view_issued_at');
  });

  it('MUTATION — anon lit passports en brut (durcissement absent) → violation', () => {
    const v = parityViolation({ ...CONFORME, anonPassportsRaw: 'readable' });
    expect(v).not.toBeNull();
    expect(v).toContain('passports');
    expect(v).toContain('20260717000001_public_passport_view');
  });

  it('MUTATION — table wsp_passport_updates absente → violation (palier 2)', () => {
    const v = parityViolation({ ...CONFORME, passportUpdatesTable: 'absent' });
    expect(v).not.toBeNull();
    expect(v).toContain('wsp_passport_updates');
    expect(v).toContain('20260831000002_wsp_passport_updates');
  });

  it('MUTATION — fonction wsp_my_active_skills absente → violation (palier 3)', () => {
    const v = parityViolation({ ...CONFORME, skillsSourceFn: 'absent' });
    expect(v).not.toBeNull();
    expect(v).toContain('wsp_my_active_skills');
    expect(v).toContain('20260901000001_wsp_skills_source');
  });

  it('MUTATION — fonction wsp_advance_lifecycle absente → violation (D-040)', () => {
    const v = parityViolation({ ...CONFORME, lifecycleAdvanceFn: 'absent' });
    expect(v).not.toBeNull();
    expect(v).toContain('wsp_advance_lifecycle');
    expect(v).toContain('20260924000001_wsp_lifecycle_advance');
  });

  it('plusieurs dérives → TOUTES listées (jamais la première seule)', () => {
    const v = parityViolation({
      bridgeResolveFn: 'absent',
      publicViewIssuedAt: 'absent',
      anonPassportsRaw: 'readable',
      passportUpdatesTable: 'absent',
      skillsSourceFn: 'absent',
      lifecycleAdvanceFn: 'absent',
    });
    for (const s of SENTINELS) expect(v).toContain(s.migration);
  });

  it('le message ORIENTE vers la correction (db push, staging uniquement)', () => {
    const v = parityViolation({ ...CONFORME, bridgeResolveFn: 'absent' });
    expect(v).toContain('supabase db push');
    expect(v).toContain('jamais la prod');
  });
});
