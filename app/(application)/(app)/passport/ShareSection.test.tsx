// @vitest-environment jsdom
/**
 * T-C — « Partager mon passeport » : le sujet génère (clair une fois) / copie /
 * révoque. Falsifiable : le clair mène à /verify/{token} ; après révocation il
 * n'est plus affiché ; le clair n'apparaît qu'après un geste explicite.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { fr } from '@/lib/i18n/fr';

vi.mock('@/lib/supabase/client', () => ({ createClient: vi.fn() }));
import { createClient } from '@/lib/supabase/client';
import { ShareSection } from './ShareSection';

const t = fr.share;

/** Client mocké : from() (état initial) + rpc() (generate/revoke). */
function mockClient(opts: { initialActive?: boolean; backendAbsent?: boolean } = {}) {
  const maybeSingle = vi.fn(async () =>
    opts.backendAbsent
      ? { data: null, error: { code: 'PGRST205', message: 'Could not find the table public.passport_share_tokens in the schema cache' } }
      : { data: opts.initialActive ? { created_at: '2026-09-26T10:00:00Z' } : null, error: null },
  );
  const chain = { select: () => chain, is: () => chain, maybeSingle };
  const rpc = vi.fn(async (name: string) => {
    if (name === 'generate_share_token') return { data: { share_token: 'wsps_deadbeef' }, error: null };
    if (name === 'revoke_share_token') return { data: { revoked: 1 }, error: null };
    return { data: null, error: null };
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (createClient as any).mockReturnValue({ from: () => chain, rpc });
  return { rpc, maybeSingle };
}

beforeEach(() => vi.clearAllMocks());
afterEach(() => cleanup());

describe('T-C — ShareSection (gate gracieux)', () => {
  it('⭐ backend ABSENT (migrations token non déployées) → section MASQUÉE', async () => {
    const { maybeSingle } = mockClient({ backendAbsent: true });
    render(<ShareSection />);
    await waitFor(() => expect(maybeSingle).toHaveBeenCalled());
    // Rien ne s'affiche : ni titre, ni bouton qui échouerait.
    expect(screen.queryByText(t.title)).toBeNull();
    expect(screen.queryByRole('button', { name: t.generate })).toBeNull();
  });

  it('⭐ backend PRÉSENT sans token → section VISIBLE, état « aucun » + bouton', async () => {
    mockClient(); // present, pas de token actif
    render(<ShareSection />);
    expect(await screen.findByText(t.none)).toBeTruthy();
    expect(screen.getByRole('button', { name: t.generate })).toBeTruthy();
  });

  it('⭐ générer → affiche le lien /verify/{token} UNE fois (clair après un geste explicite)', async () => {
    mockClient();
    render(<ShareSection />);

    // État initial : aucun lien, le clair n'est PAS affiché.
    expect(await screen.findByText(t.none)).toBeTruthy();
    expect(screen.queryByDisplayValue(/\/verify\//)).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: t.generate }));

    // Le lien clair apparaît, pointant vers /verify/{token}, avec l'avertissement.
    const field = (await screen.findByLabelText(t.shownOnceTitle)) as HTMLInputElement;
    expect(field.value).toContain('/verify/wsps_deadbeef');
    expect(screen.getByText(t.shownOnceWarning)).toBeTruthy();
  });

  it('⭐ copier → écrit le lien dans le presse-papiers', async () => {
    mockClient();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    render(<ShareSection />);
    await screen.findByText(t.none);

    fireEvent.click(screen.getByRole('button', { name: t.generate }));
    await screen.findByLabelText(t.shownOnceTitle);
    fireEvent.click(screen.getByRole('button', { name: t.copy }));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith(expect.stringContaining('/verify/wsps_deadbeef')));
  });

  it('⭐ révoquer → le lien clair disparaît, l’état repasse à « aucun »', async () => {
    const { rpc } = mockClient();
    render(<ShareSection />);
    await screen.findByText(t.none);

    fireEvent.click(screen.getByRole('button', { name: t.generate }));
    await screen.findByLabelText(t.shownOnceTitle);

    fireEvent.click(screen.getByRole('button', { name: t.revoke }));

    await waitFor(() => expect(rpc).toHaveBeenCalledWith('revoke_share_token'));
    await waitFor(() => expect(screen.queryByLabelText(t.shownOnceTitle)).toBeNull()); // clair effacé
    expect(await screen.findByText(t.none)).toBeTruthy();
  });

  it('état initial ACTIF (lien déjà généré) → propose de révoquer, sans jamais ré-afficher le clair', async () => {
    mockClient({ initialActive: true });
    render(<ShareSection />);

    expect(await screen.findByText(t.activeNote)).toBeTruthy();
    expect(screen.getByRole('button', { name: t.revoke })).toBeTruthy();
    // Le clair n'est JAMAIS ré-affiché depuis l'état (hash-only).
    expect(screen.queryByLabelText(t.shownOnceTitle)).toBeNull();
  });
});
