/**
 * Règle de résolution gravée (précédence du Concept sur le Record), telle
 * qu'appliquée par `scripts/registry/node-ref.mjs` :
 *
 *   « Within a Relations section, if a target identifier matches both a Record
 *     title and a declared Concept, concept resolution SHALL take precedence.
 *     Record resolution SHALL only occur when no declared Concept matches the
 *     identifier. »
 *
 * Le générateur ne FABRIQUE jamais une sémantique absente de la source : ces
 * tests vérifient uniquement l'ORDRE de résolution, jamais une inférence.
 */
import { describe, it, expect } from 'vitest';
// @ts-expect-error — module de script (.mjs), sans déclaration de types
import { makeParseNodeRef } from '../../scripts/registry/node-ref.mjs';

/** Tables minimales reproduisant la configuration réelle du corpus. */
function resolver(overrides: { concepts?: string[] } = {}) {
  return makeParseNodeRef({
    NAME_ALIASES: new Map([['protocol', 'OCR-100']]),
    TITLE_TO_ID: new Map([
      ['framework', 'OCR-115'],
      ['evidence', 'OCR-110'],
      ['identity', 'OCR-125'],
    ]),
    FLAGGED_NAMES: new Set(['identity']),
    LABEL_TO_CATEGORY: new Map(
      (overrides.concepts ?? []).map((c) => [c, 'protocol_concept'] as const)
    ),
  });
}

describe('précédence du Concept déclaré sur la résolution par titre de Record', () => {
  it('titre de Record ET concept déclaré → le CONCEPT l’emporte', () => {
    const r = resolver({ concepts: ['framework'] })('Framework');
    expect(r.id).toBe('ext:framework');
    expect(r.type).toBe('external');
    expect(r.resolved_by_concept).toBe(true);
    expect(r.resolved_by_name).toBeUndefined();
  });

  it('titre de Record SANS concept déclaré → le Record, comme avant', () => {
    const r = resolver()('Framework');
    expect(r.id).toBe('OCR-115');
    expect(r.type).toBe('internal');
    expect(r.resolved_by_name).toBe(true);
  });

  it('un concept déclaré qui n’est le titre d’aucun Record reste externe', () => {
    const r = resolver({ concepts: ['framework version'] })('Framework Version');
    expect(r.id).toBe('ext:framework-version');
    expect(r.type).toBe('external');
    // Aucun titre ne matche : la règle n’a pas à trancher, elle ne s’applique pas.
    expect(r.resolved_by_concept).toBeUndefined();
  });

  it('la règle ne touche pas les autres titres du corpus', () => {
    const r = resolver({ concepts: ['framework'] })('Evidence');
    expect(r.id).toBe('OCR-110');
    expect(r.resolved_by_name).toBe(true);
  });

  it('un OCR-id explicite prime sur tout — la règle ne s’applique jamais', () => {
    const r = resolver({ concepts: ['framework'] })('Framework (OCR-115)');
    expect(r.id).toBe('OCR-115');
    expect(r.type).toBe('internal');
    expect(r.resolved_by_concept).toBeUndefined();
  });

  it('la note entre parenthèses est préservée quand le concept l’emporte', () => {
    const r = resolver({ concepts: ['framework'] })('Framework (reflexive)');
    expect(r.id).toBe('ext:framework');
    expect(r.note).toBe('reflexive');
    expect(r.resolved_by_concept).toBe(true);
  });

  it('un titre AMBIGU (flagged) n’est résolu ni par concept ni par titre', () => {
    const r = resolver({ concepts: ['identity'] })('Identity');
    expect(r.id).toBe('ext:identity');
    expect(r.resolved_by_concept).toBeUndefined();
    expect(r.resolved_by_name).toBeUndefined();
  });

  it('HORS PÉRIMÈTRE — un raccourci de name_aliases reste résolu vers le Record', () => {
    // La règle gravée ne vise que la résolution par TITRE. Les alias relèvent
    // d'un autre mécanisme (les 2 alias_self_loop connus), instruit séparément.
    const r = resolver({ concepts: ['protocol'] })('Protocol');
    expect(r.id).toBe('OCR-100');
    expect(r.resolved_by_alias).toBe(true);
  });
});
