// @vitest-environment jsdom
/**
 * Cérémonie (Écran 5) — test de RÉVÉLATION.
 * Régression corrigée : quand le serveur confirme (complete:true), la ligne
 * finale doit s'afficher, l'objet se sceller (Opus ID gravé), la vision
 * paraître et le CTA devenir ACTIF. Avant le correctif, l'effet de révélation
 * s'auto-annulait (lineStatus en dépendance) → écran figé, CTA désactivé à jamais.
 *
 * Timers RÉELS + waitFor : on observe la séquence telle qu'elle se joue.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';

const finalizeEmission = vi.fn();
const replace = vi.fn();
const push = vi.fn();

vi.mock('next/navigation', () => ({ useRouter: () => ({ replace, push }) }));
vi.mock('@/lib/supabase/client', () => ({ createClient: () => ({}) }));
vi.mock('@/lib/auth/AuthService', () => ({
  AuthService: class {
    finalizeEmission = finalizeEmission;
  },
}));

import EmissionPage from './page';
import { EMISSION_SEQUENCE, VISION_STATEMENT } from '@/lib/constants/passport.strings';
import { fr } from '@/lib/i18n/fr';

const FINAL_LINE = EMISSION_SEQUENCE[EMISSION_SEQUENCE.length - 1];
const OPUS_ID = 'opx_01KXCQ83A04M72EE68RNY22DNH';
const COMPLETE = {
  complete: true,
  opus_id: OPUS_ID,
  handle: 'opus-x-llc-jm6s',
  lifecycle_stage: 'identity_established',
  trust_state: 'establishing',
  issued_at: '2026-07-13T03:10:05.622278+00:00',
  checks: { profile: true, passport: true, trust_index: true, consents: true },
};

const cta = () => screen.getByRole('button', { name: fr.ceremony.discover }) as HTMLButtonElement;

beforeEach(() => {
  finalizeEmission.mockReset();
  replace.mockReset();
});
afterEach(() => cleanup());

describe('Cérémonie — révélation de la ligne finale', () => {
  it('complete:true → ligne finale + objet scellé (Opus ID) + vision + CTA ACTIF', async () => {
    finalizeEmission.mockResolvedValue(COMPLETE);
    render(<EmissionPage />);

    // Le CTA actif est le DERNIER maillon révélé : sa présence prouve que toute
    // la séquence est allée au bout (avant le correctif, il restait désactivé).
    await waitFor(() => expect(cta().disabled).toBe(false), { timeout: 8000 });

    // Et le reste de la chaîne est bien à l'écran.
    expect(screen.getByText(FINAL_LINE)).toBeTruthy();
    expect(screen.getByText(OPUS_ID)).toBeTruthy();
    expect(screen.getByText(VISION_STATEMENT)).toBeTruthy();
  }, 12000);

  it('complete pas encore true → ligne finale JAMAIS révélée, CTA inactif (V3 gardée)', async () => {
    finalizeEmission.mockResolvedValue({ complete: false, reason: 'not_issued' });
    render(<EmissionPage />);

    // La forge « tient » dignement une fois les 3 lignes jouées.
    await screen.findByText(fr.ceremony.holding, {}, { timeout: 6000 });

    // La ligne finale n'est pas rendue, et le CTA reste désactivé.
    expect(screen.queryByText(FINAL_LINE)).toBeNull();
    expect(cta().disabled).toBe(true);
  }, 12000);
});
