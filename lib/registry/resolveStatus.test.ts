/**
 * Résolveur de statut (étape 6, palier 1) — testé ISOLÉMENT.
 *
 * Falsifiable, pas tautologique : le statut attendu est comparé aux FAITS passés
 * (source), pas à la valeur que la fonction calcule d'elle-même. Un bug de dérivation
 * (révocation ignorée, mauvais Record) change la sortie et casse un cas.
 */
import { describe, it, expect } from 'vitest';
import { resolveStatus, type ApprovalFact } from './resolveStatus';

const promo = (declares: string[]): ApprovalFact => ({ id: 'PROMO-001', kind: 'promotion', declares_normative: declares });
const ratif = (declares: string[]): ApprovalFact => ({ id: 'RATIF-001', kind: 'founding-ratification', declares_normative: declares });
const revoke = (revokes: string[]): ApprovalFact => ({ id: 'REV', kind: 'revocation', revokes_normative: revokes });

describe('resolveStatus — dérive le statut du FAIT, jamais d’un champ', () => {
  it('aucun fait → Draft (pour n’importe quel Record)', () => {
    expect(resolveStatus('OCR-104', [])).toBe('Draft');
    expect(resolveStatus('OCR-000', [])).toBe('Draft');
  });

  it('un fait de promotion → Normative pour le Record déclaré, Draft pour les autres', () => {
    const f = [promo(['OCR-104'])];
    expect(resolveStatus('OCR-104', f)).toBe('Normative');
    expect(resolveStatus('OCR-999', f)).toBe('Draft'); // non déclaré → pas promu
  });

  it('RATIF fondateur déclare {OCR-000, OCR-005} Normative', () => {
    const f = [ratif(['OCR-000', 'OCR-005'])];
    expect(resolveStatus('OCR-000', f)).toBe('Normative');
    expect(resolveStatus('OCR-005', f)).toBe('Normative');
    expect(resolveStatus('OCR-001', f)).toBe('Draft'); // non déclaré
  });

  it('promotion PUIS révocation → Draft (le 2ᵉ fait retranche, D-013) ; ordre indifférent', () => {
    expect(resolveStatus('OCR-104', [promo(['OCR-104']), revoke(['OCR-104'])])).toBe('Draft');
    expect(resolveStatus('OCR-104', [revoke(['OCR-104']), promo(['OCR-104'])])).toBe('Draft');
    // une révocation d’un AUTRE Record ne touche pas celui-ci
    expect(resolveStatus('OCR-104', [promo(['OCR-104']), revoke(['OCR-000'])])).toBe('Normative');
  });

  it('plusieurs faits d’approbation cumulent (union)', () => {
    const f = [ratif(['OCR-000', 'OCR-005']), promo(['OCR-104'])];
    expect(resolveStatus('OCR-000', f)).toBe('Normative');
    expect(resolveStatus('OCR-104', f)).toBe('Normative');
    expect(resolveStatus('OCR-101', f)).toBe('Draft');
  });

  it('MUTATION — un résolveur qui IGNORE la révocation rendrait Normative ; on exige Draft', () => {
    // promotion + révocation du MÊME Record : seul un résolveur correct retranche → Draft.
    expect(resolveStatus('OCR-104', [promo(['OCR-104']), revoke(['OCR-104'])])).not.toBe('Normative');
  });

  it('PURE — le fait seul décide ; aucun champ Status n’est requis ni lu', () => {
    // Aucune donnée de Record n’est fournie ; le statut se dérive du seul fait.
    expect(resolveStatus('OCR-104', [promo(['OCR-104'])])).toBe('Normative');
  });
});
