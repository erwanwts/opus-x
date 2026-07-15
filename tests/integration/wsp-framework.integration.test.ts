/**
 * =====================================================================
 * LOT O0 — Publier le Framework : garanties DB (base LIVE de staging).
 * =====================================================================
 * Exécuté contre le projet Supabase de STAGING (.env.test.local), jamais la
 * base principale — la garde du harnais l'impose au chargement.
 *
 * Prouve les conditions de sortie du Lot O0 :
 *   • WTF-212 existe avec un identifiant canonique stable et versionné.
 *   • Un Issuer le découvre en ANON, sans configuration spécifique (D9).
 *   • Une version de Framework ne peut être ni modifiée ni supprimée —
 *     ÉCHEC AU NIVEAU SGBD, même pour le service_role (contrainte base,
 *     pas convention).
 *
 * PRÉREQUIS : la migration 20260713000001_wsp_framework.sql doit être
 * appliquée au projet de staging.
 * =====================================================================
 */
import { describe, it, expect } from 'vitest';
import { admin, anonClient } from './_harness';

describe('Lot O0 — semantics zone : seed & découverte', () => {
  it('WTF-212 existe avec un identifiant canonique stable + version', async () => {
    const { data: skill } = await admin
      .from('wsp_skills')
      .select('id, code, name, framework_id, framework_version')
      .eq('id', 'wtf:212')
      .maybeSingle();

    expect(skill).not.toBeNull();
    expect(skill!.id).toBe('wtf:212');
    expect(skill!.code).toBe('WTF-212');
    expect(skill!.framework_id).toBe('framework:wtf');
    expect(skill!.framework_version).toBe('0.1');
  });

  it('le Framework v0.1 et ses 4 niveaux sont seedés (Aware/Applied/Proficient/Mastery)', async () => {
    const { data: version } = await admin
      .from('wsp_framework_versions')
      .select('id, version, status')
      .eq('id', 'framework:wtf@0.1')
      .maybeSingle();
    expect(version?.version).toBe('0.1');
    expect(version?.status).toBe('published');

    const { data: levels } = await admin
      .from('wsp_skill_levels')
      .select('slug, rank, observation_min, observation_max')
      .eq('skill_id', 'wtf:212')
      .order('rank');
    expect((levels ?? []).map((l) => l.slug)).toEqual([
      'aware',
      'applied',
      'proficient',
      'mastery',
    ]);
    // Correspondance des niveaux (§5.3 / P1) : 2→aware … 5→mastery.
    expect(levels![0]).toMatchObject({ observation_min: 2, observation_max: 2 });
    expect(levels![3]).toMatchObject({ observation_min: 5, observation_max: 5 });
  });

  it('un Issuer découvre les Skills en ANON, sans configuration (D9)', async () => {
    const anon = anonClient();
    const { data: skill, error } = await anon
      .from('wsp_skills')
      .select('id, code, framework_version')
      .eq('id', 'wtf:212')
      .maybeSingle();
    expect(error).toBeNull();
    expect(skill?.id).toBe('wtf:212');
  });
});

describe('Lot O0-EXT — correspondance PUBLIÉE & date d’effet (ENG-002 v0.2 §9)', () => {
  it('effective_date est présente sur la version (backfill ADD COLUMN, append-only intact)', async () => {
    const { data: version, error } = await admin
      .from('wsp_framework_versions')
      .select('version, effective_date')
      .eq('id', 'framework:wtf@0.1')
      .maybeSingle();
    expect(error).toBeNull();
    expect(version?.effective_date).toBe('2026-07-13');
  });

  it('les 4 niveaux portent une bande d’observation, aucune ne couvre 0–1 (seuil P2 par omission)', async () => {
    const { data: levels } = await admin
      .from('wsp_skill_levels')
      .select('slug, observation_min, observation_max')
      .eq('skill_id', 'wtf:212')
      .order('rank');
    expect((levels ?? []).length).toBe(4);
    // Chaque niveau a une bande, et AUCUNE ne descend à 0 ou 1 (§9.2.3).
    for (const l of levels ?? []) {
      expect(typeof l.observation_min).toBe('number');
      expect(typeof l.observation_max).toBe('number');
      expect(l.observation_min).toBeGreaterThanOrEqual(2);
    }
  });

  it('la correspondance publiée (bandes) + effective_date sont lisibles en ANON (D9)', async () => {
    const anon = anonClient();
    const bands = await anon
      .from('wsp_skill_levels')
      .select('slug, observation_min, observation_max')
      .eq('skill_id', 'wtf:212');
    expect(bands.error).toBeNull();
    expect((bands.data ?? []).length).toBe(4);

    const ver = await anon
      .from('wsp_framework_versions')
      .select('effective_date')
      .eq('id', 'framework:wtf@0.1')
      .maybeSingle();
    expect(ver.error).toBeNull();
    expect(ver.data?.effective_date).toBe('2026-07-13');
  });
});

describe('Lot O0 — immuabilité : une version publiée ne change jamais (contrainte base)', () => {
  it('UPDATE direct sur une version de Framework → ÉCHEC SGBD (même en service_role)', async () => {
    const { error } = await admin
      .from('wsp_framework_versions')
      .update({ status: 'deprecated' })
      .eq('id', 'framework:wtf@0.1');
    expect(error).not.toBeNull();
    expect(error!.message).toMatch(/WSP_APPEND_ONLY|append|immuable|forbidden/i);
  });

  it('DELETE direct sur une version de Framework → ÉCHEC SGBD', async () => {
    const { error } = await admin
      .from('wsp_framework_versions')
      .delete()
      .eq('id', 'framework:wtf@0.1');
    expect(error).not.toBeNull();
  });

  it('UPDATE direct sur une Skill publiée → ÉCHEC SGBD', async () => {
    const { error } = await admin
      .from('wsp_skills')
      .update({ name: 'altéré' })
      .eq('id', 'wtf:212');
    expect(error).not.toBeNull();
  });

  it('DELETE direct sur un niveau publié → ÉCHEC SGBD', async () => {
    const { error } = await admin
      .from('wsp_skill_levels')
      .delete()
      .eq('id', 'wtf:212#applied');
    expect(error).not.toBeNull();
  });

  it('la Skill est TOUJOURS intacte après ces tentatives (rien n’a muté)', async () => {
    const { data: skill } = await admin
      .from('wsp_skills')
      .select('name')
      .eq('id', 'wtf:212')
      .maybeSingle();
    expect(skill?.name).toBe('Intention vs Engagement');
  });
});
