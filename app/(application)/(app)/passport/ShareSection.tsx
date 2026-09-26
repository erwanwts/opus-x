/**
 * =====================================================================
 * T-C — « Partager mon passeport » (D-058→D-062) — le sujet est maître.
 * =====================================================================
 * Registre OUTIL sur la page OBJET : générer / copier (une fois) / révoquer un
 * lien de partage tokenisé (/verify/{token}). Réutilise generate_share_token /
 * revoke_share_token (T-A), owner-scopé (le sujet = sa session).
 *
 * Le lien en clair n'est affiché QU'UNE fois (cohérent T-A : hash-only en base
 * — jamais relisible). L'état « un lien est actif » se lit sans le clair.
 * V2 (multiples / expiration / ciblé) : réservé, non construit (D-059).
 * =====================================================================
 */
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { fr } from '@/lib/i18n/fr';

const t = fr.share;

type ActiveState = { active: boolean; createdAt: string | null };
type Backend = 'checking' | 'present' | 'absent';

/**
 * Le backend token est-il ABSENT (table/RPC non déployée) ? On distingue ce cas
 * — masquer la section — d'une simple absence de token actif (afficher « aucun »).
 * En prod tant que les migrations token ne sont pas appliquées, PostgREST répond
 * « relation introuvable » (schema cache) : la section disparaît, sans re-déploiement
 * le jour où les migrations arrivent.
 */
function isBackendAbsent(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  if (error.code === 'PGRST205' || error.code === 'PGRST202' || error.code === '42P01' || error.code === '42883') {
    return true; // table absente du cache / undefined_table / undefined_function
  }
  return /does not exist|schema cache|could not find the (table|function)/i.test(error.message ?? '');
}

export function ShareSection() {
  const [supabase] = useState(() => createClient());
  const [backend, setBackend] = useState<Backend>('checking');
  const [state, setState] = useState<ActiveState>({ active: false, createdAt: null });
  const [link, setLink] = useState<string | null>(null); // clair, affiché UNE fois
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  // État initial : le backend token est-il là ? Si oui, un lien est-il actif ?
  // (RLS owner — jamais le clair.) Backend absent → section masquée (gate gracieux).
  useEffect(() => {
    let alive = true;
    (async () => {
      const { data, error: e } = await supabase
        .from('passport_share_tokens')
        .select('created_at')
        .is('revoked_at', null)
        .maybeSingle();
      if (!alive) return;
      if (isBackendAbsent(e)) {
        setBackend('absent'); // migrations token non déployées → on masque tout
        return;
      }
      setBackend('present');
      if (data) setState({ active: true, createdAt: (data as { created_at: string }).created_at });
    })();
    return () => {
      alive = false;
    };
  }, [supabase]);

  // Gate gracieux : rien tant qu'on vérifie, rien si le backend token est absent.
  if (backend !== 'present') return null;

  async function onGenerate() {
    setBusy(true);
    setError(false);
    setCopied(false);
    const { data, error: e } = await supabase.rpc('generate_share_token');
    setBusy(false);
    if (e || !data) {
      setError(true);
      return;
    }
    const token = (data as { share_token: string }).share_token;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    setLink(`${origin}/verify/${token}`); // affiché UNE fois
    setState({ active: true, createdAt: new Date().toISOString() });
  }

  async function onRevoke() {
    setBusy(true);
    setError(false);
    const { error: e } = await supabase.rpc('revoke_share_token');
    setBusy(false);
    if (e) {
      setError(true);
      return;
    }
    setLink(null);
    setState({ active: false, createdAt: null });
  }

  async function onCopy() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch {
      /* le champ reste sélectionnable manuellement */
    }
  }

  return (
    <section className="mt-8 rounded-object border border-navy-700 bg-navy-900/60 p-6" aria-labelledby="share-title">
      <h2 id="share-title" className="font-institutional text-body-lg font-semibold text-navy-100">
        {t.title}
      </h2>
      <p className="mt-2 text-body-sm text-navy-300">{t.body}</p>

      {/* Le lien en clair — affiché UNE seule fois, avec avertissement. */}
      {link && (
        <div className="mt-5 rounded-control border border-gold-500/30 bg-gold-500/5 p-4">
          <p className="text-body-sm font-medium text-gold-400">{t.shownOnceTitle}</p>
          <input
            readOnly
            value={link}
            aria-label={t.shownOnceTitle}
            onFocus={(e) => e.currentTarget.select()}
            className="mt-2 w-full rounded-control border border-navy-700 bg-navy-950 px-3 py-2 font-interface text-body-sm text-navy-100"
          />
          <p className="mt-2 text-micro text-navy-400">{t.shownOnceWarning}</p>
          <button
            type="button"
            onClick={onCopy}
            className="mt-3 rounded-control border border-navy-600 bg-navy-800 px-4 py-2 text-body-sm font-medium text-navy-100 transition-colors duration-micro hover:bg-navy-700"
          >
            {copied ? t.copied : t.copy}
          </button>
        </div>
      )}

      {/* État + actions. */}
      <div className="mt-5">
        <p className="text-body-sm text-navy-300">
          {state.active
            ? state.createdAt
              ? t.activeSince.replace('{date}', new Date(state.createdAt).toLocaleDateString('fr'))
              : t.activeTitle
            : t.none}
        </p>
        {state.active && !link && <p className="mt-1 text-micro text-navy-400">{t.activeNote}</p>}

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onGenerate}
            disabled={busy}
            className="rounded-control bg-navy-100 px-4 py-2 text-body-sm font-semibold text-navy-950 transition-colors duration-micro hover:bg-white disabled:opacity-50"
          >
            {busy ? t.generating : state.active ? t.regenerate : t.generate}
          </button>
          {state.active && (
            <button
              type="button"
              onClick={onRevoke}
              disabled={busy}
              className="rounded-control border border-navy-600 px-4 py-2 text-body-sm font-medium text-navy-200 transition-colors duration-micro hover:border-critical hover:text-critical disabled:opacity-50"
            >
              {busy ? t.revoking : t.revoke}
            </button>
          )}
        </div>

        {error && (
          <p role="alert" className="mt-3 text-body-sm text-critical">
            {t.error}
          </p>
        )}
      </div>
    </section>
  );
}
