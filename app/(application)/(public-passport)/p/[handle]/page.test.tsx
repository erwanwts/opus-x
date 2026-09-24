// @vitest-environment jsdom
/**
 * =====================================================================
 * Page publique /p/{handle} — rendu réel + 404 non-énumérant
 * =====================================================================
 * Preuves (offline, mock du lecteur unique — aucune base, aucune activation
 * RLS réelle, garde SEC-02 respectée) :
 *   • lecteur → null  ⇒  notFound() appelé (privé/unlisted/inexistant identiques) ;
 *   • ligne publique SIMULÉE ⇒ champs AUTORISÉS rendus, AUCUN champ interne dans
 *     le DOM, Trust = « Not yet computed » (jamais le stub interne) ;
 *   • OR (sceau « Verified ») uniquement quand verified===true.
 * =====================================================================
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

// vi.hoisted : ces mocks sont lus par les factories vi.mock (hissées au top).
// Sans hoisted, la factory s'exécuterait AVANT l'init des const → ReferenceError.
const { notFound } = vi.hoisted(() => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));
vi.mock('next/navigation', () => ({ notFound }));

const { fetchPublicPassport } = vi.hoisted(() => ({ fetchPublicPassport: vi.fn() }));
vi.mock('@/lib/api/readPublicPassport', () => ({ fetchPublicPassport }));

import PublicPassportPage from './page';
import { PUBLIC_PASSPORT_STRINGS as S, TRUST_STATE_LABELS } from '@/lib/constants/passport.strings';

const paramsFor = (handle: string) => ({ params: Promise.resolve({ handle }) });

beforeEach(() => vi.clearAllMocks());
afterEach(() => cleanup());

describe('Page publique du Passport /p/{handle}', () => {
  it('null → notFound() (privé / unlisted / inexistant indistinguables)', async () => {
    fetchPublicPassport.mockResolvedValue(null);
    await expect(PublicPassportPage(paramsFor('nexiste-pas-zzzz'))).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalledOnce();
  });

  it('ligne publique SIMULÉE (vérifiée) → identité + timeline + date, COMPÉTENCE établie avec PROVENANCE VISIBLE, or mérité, Opus ID ABSENT', async () => {
    fetchPublicPassport.mockResolvedValue({
      display_name: 'Marie Dubois',
      headline: 'Consultante indépendante',
      lifecycle_stage: 'identity_established',
      issued_at: '2026-07-01T00:00:00Z',
      verified: true, // ≥1 compétence `established`
      trust_status: 'established', // résumé DÉRIVÉ — jamais rendu tel quel
      skills_status: 'active',
      evidence: [],
      competencies: [
        {
          skill_id: 'wtr:212',
          skill_name: 'Intention vs Engagement',
          state: 'established',
          basis_level: 'proficient',
          provenance: [{ issuer_name: 'World Trading Skool', occurred_at: '2026-07-01T00:00:00Z' }],
        },
      ],
      // Pollution volontaire : champs internes que le composant NE DOIT JAMAIS rendre.
      opus_id: 'opx_01KXTESTOPUSID0000000000AB',
      profile_id: 'uuid-secret-1234',
      email: 'marie@example.com',
    });

    render(await PublicPassportPage(paramsFor('marie-k3n7')));
    const html = document.body.innerHTML;

    // Identité + objet + handle public (identifiant de la page, déjà dans l'URL).
    expect(screen.getByText('Marie Dubois')).toBeTruthy();
    expect(screen.getByText('Consultante indépendante')).toBeTruthy();
    expect(screen.getByText('@marie-k3n7')).toBeTruthy();
    expect(screen.getByText(S.object)).toBeTruthy();

    // Timeline 7 étapes : étape courante + progression rendues.
    expect(screen.getByText('Identity Established')).toBeTruthy();
    expect(screen.getByText('Step 1 of 7')).toBeTruthy();

    // Date d'émission publique (Lot 4) — libellé + date formatée (en-US, UTC).
    expect(html).toContain(S.issuedOn);
    expect(html).toContain('July 1, 2026');

    // LE CŒUR (D-044) — compétence publiée + état de Trust LISIBLE (pas un score) +
    // PROVENANCE VISIBLE « Verified by [émetteur] · [date] ».
    expect(screen.getByText(S.competencies)).toBeTruthy();
    expect(screen.getByText('Intention vs Engagement')).toBeTruthy();
    expect(screen.getByText(TRUST_STATE_LABELS.established)).toBeTruthy();
    expect(screen.getByText('World Trading Skool')).toBeTruthy();
    expect(html).toContain(S.verifiedBy);
    // Aucun score numérique nulle part (interdit PRODUCT-001).
    expect(html).not.toMatch(/\b\d{1,3}\s*\/\s*100\b/);

    // OPUS ID + champs internes ABSENTS du DOM (whitelist stricte au rendu).
    expect(html).not.toMatch(/opx_/i);
    expect(html).not.toContain('uuid-secret-1234');
    expect(html).not.toContain('marie@example.com');
    expect(html).not.toContain('wtr:212'); // l'id brut ne fuit pas : on montre le NOM
  });

  it('compétence NON established → état lisible SANS or (or = confiance méritée seulement)', async () => {
    fetchPublicPassport.mockResolvedValue({
      display_name: 'En cours',
      headline: null,
      lifecycle_stage: 'identity_established',
      issued_at: null,
      verified: false,
      trust_status: 'emerging',
      skills_status: 'active',
      evidence: [],
      competencies: [
        {
          skill_id: 'wtr:212',
          skill_name: 'Intention vs Engagement',
          state: 'emerging',
          basis_level: 'applied',
          provenance: [{ issuer_name: 'World Trading Skool', occurred_at: '2026-07-01T00:00:00Z' }],
        },
      ],
    });

    render(await PublicPassportPage(paramsFor('emerging-x')));

    // L'état est lisible…
    expect(screen.getByText(TRUST_STATE_LABELS.emerging)).toBeTruthy();
    // …mais l'objet global n'est pas « Verified » (aucune compétence établie).
    expect(screen.getByText(S.notVerified)).toBeTruthy();
    expect(screen.queryByText(S.verified)).toBeNull(); // aucun OR mérité au niveau objet.
  });

  it('aucune compétence publiée → état vide SOBRE, sans jugement', async () => {
    fetchPublicPassport.mockResolvedValue({
      display_name: null,
      headline: null,
      lifecycle_stage: 'identity_established',
      issued_at: null,
      verified: false,
      trust_status: 'establishing',
      skills_status: 'empty',
      evidence: [],
      competencies: [],
    });

    render(await PublicPassportPage(paramsFor('sobre')));

    expect(screen.getByText(S.notVerified)).toBeTruthy();
    expect(screen.queryByText(S.verified)).toBeNull(); // aucun OR mérité.
    expect(screen.getByText(S.competenciesEmpty)).toBeTruthy();
  });
});
