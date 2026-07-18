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

import PublicPassportPage, { generateMetadata } from './page';
import { PUBLIC_PASSPORT_STRINGS as S } from '@/lib/constants/passport.strings';

const paramsFor = (handle: string) => ({ params: Promise.resolve({ handle }) });

beforeEach(() => vi.clearAllMocks());
afterEach(() => cleanup());

describe('Page publique du Passport /p/{handle}', () => {
  it('null → notFound() (privé / unlisted / inexistant indistinguables)', async () => {
    fetchPublicPassport.mockResolvedValue(null);
    await expect(PublicPassportPage(paramsFor('nexiste-pas-zzzz'))).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalledOnce();
  });

  it('ligne publique SIMULÉE (vérifiée) → champs autorisés + timeline + date, Opus ID ABSENT, Trust non calculé', async () => {
    fetchPublicPassport.mockResolvedValue({
      display_name: 'Marie Dubois',
      headline: 'Consultante indépendante',
      lifecycle_stage: 'identity_established',
      issued_at: '2026-07-01T00:00:00Z',
      verified: true,
      is_demo: false,
      trust_status: 'establishing', // stub interne : NE DOIT JAMAIS être rendu.
      skills_status: 'empty',
      skills: [],
      evidence: [
        {
          type: 'certification',
          title: 'Certification X',
          verified: true,
          issued_at: '2026-07-01T00:00:00Z',
          issuer: 'Partenaire Y',
        },
      ],
      // Pollution volontaire : champs internes que le composant NE DOIT JAMAIS rendre.
      opus_id: 'opx_01KXTESTOPUSID0000000000AB',
      profile_id: 'uuid-secret-1234',
      email: 'marie@example.com',
    });

    render(await PublicPassportPage(paramsFor('marie-k3n7')));
    const html = document.body.innerHTML;

    // Champs AUTORISÉS rendus.
    expect(screen.getByText('Marie Dubois')).toBeTruthy();
    expect(screen.getByText('Consultante indépendante')).toBeTruthy();
    expect(screen.getByText('Certification X')).toBeTruthy();
    expect(screen.getByText('Partenaire Y')).toBeTruthy();
    expect(screen.getByText(S.object)).toBeTruthy();

    // Timeline 7 étapes : étape courante + progression rendues.
    expect(screen.getByText('Identity Established')).toBeTruthy();
    expect(screen.getByText('Step 1 of 7')).toBeTruthy();

    // Date d'émission publique (Lot 4) — libellé + date formatée (en-US, UTC).
    expect(html).toContain(S.issuedOn);
    expect(html).toContain('July 1, 2026');

    // Trust : capacité PLANIFIÉE, jamais le stub 'establishing'.
    expect(screen.getByText(S.trustNotComputed)).toBeTruthy();
    expect(screen.getByText(S.trustPlannedNote)).toBeTruthy();
    expect(html).not.toMatch(/establishing/i);

    // OPUS ID + champs internes ABSENTS du DOM (whitelist stricte au rendu).
    expect(html).not.toMatch(/opx_/i);
    expect(html).not.toContain('uuid-secret-1234');
    expect(html).not.toContain('marie@example.com');

    // Un VRAI Passport ne porte JAMAIS le bandeau de démonstration.
    expect(screen.queryByText(S.demoBanner)).toBeNull();
  });

  it('non vérifié + vide → mention sobre, PAS de sceau OR, états vides sans jugement', async () => {
    fetchPublicPassport.mockResolvedValue({
      display_name: null,
      headline: null,
      lifecycle_stage: 'identity_established',
      issued_at: null,
      verified: false,
      is_demo: false,
      trust_status: 'establishing',
      skills_status: 'empty',
      skills: [],
      evidence: [],
    });

    render(await PublicPassportPage(paramsFor('sobre')));

    expect(screen.getByText(S.notVerified)).toBeTruthy();
    expect(screen.queryByText(S.verified)).toBeNull(); // aucun OR mérité.
    expect(screen.getByText(S.skillsEmpty)).toBeTruthy();
    expect(screen.getByText(S.evidenceEmpty)).toBeTruthy();
  });

  // ── Lot 5 — la VITRINE ne doit jamais passer pour un vrai Passport ──────
  const demoFixture = {
    display_name: 'Erwan Signe',
    headline: null,
    lifecycle_stage: 'passport_verified',
    issued_at: '2026-07-01T00:00:00Z',
    verified: true,
    is_demo: true,
    trust_status: 'establishing',
    skills_status: 'emerging',
    skills: [{ name: 'Intention vs Engagement' }, { name: 'Risk Sizing Discipline' }],
    evidence: [
      {
        type: 'assessment',
        title: 'World Trader Framework — Level Assessment',
        verified: true,
        issued_at: '2026-05-12T10:00:00Z',
        issuer: null,
      },
    ],
  };

  it('is_demo → bandeau rendu ET annoncé (role=note), à côté du sceau qu’il contredit', async () => {
    fetchPublicPassport.mockResolvedValue(demoFixture);

    render(await PublicPassportPage(paramsFor('demo-1234')));

    // Le bandeau est présent ET exposé à l'accessibilité (le sceau, lui, est
    // aria-hidden) : un lecteur d'écran entend « démonstration », pas « Verified ».
    expect(screen.getByRole('note')).toHaveProperty('textContent', S.demoBanner);
    // La carte affiche BIEN le sceau — c'est précisément ce que le bandeau annule.
    expect(screen.getAllByText(S.verified).length).toBeGreaterThan(0);
  });

  it('is_demo → les Skills sont rendues par NOM SEUL (jamais un niveau)', async () => {
    fetchPublicPassport.mockResolvedValue(demoFixture);

    render(await PublicPassportPage(paramsFor('demo-1234')));

    expect(screen.getByText('Intention vs Engagement')).toBeTruthy();
    expect(screen.getByText('Risk Sizing Discipline')).toBeTruthy();
    expect(screen.queryByText(S.skillsEmpty)).toBeNull();
    // `skills_status` était rendu BRUT avant le Lot 5 ; la liste l'a remplacé.
    expect(document.body.innerHTML).not.toMatch(/emerging/i);
  });

  it('is_demo → noindex + marqueur dans le titre (le lecteur futur, pas seulement le présent)', async () => {
    fetchPublicPassport.mockResolvedValue(demoFixture);
    const meta = await generateMetadata(paramsFor('demo-1234'));

    expect(meta.robots).toEqual({ index: false, follow: false });
    expect(String(meta.title)).toMatch(/^Demonstration —/);
  });

  it('vrai Passport public → indexable (aucun robots), titre sans marqueur', async () => {
    fetchPublicPassport.mockResolvedValue({ ...demoFixture, is_demo: false });
    const meta = await generateMetadata(paramsFor('marie-k3n7'));

    expect(meta.robots).toBeUndefined();
    expect(String(meta.title)).not.toMatch(/Demonstration/);
  });

  it('non public → metadata VIDE (un titre ne trahit pas un Passport privé)', async () => {
    fetchPublicPassport.mockResolvedValue(null);
    expect(await generateMetadata(paramsFor('prive-ou-inexistant'))).toEqual({});
  });
});
