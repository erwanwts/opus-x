/**
 * =====================================================================
 * ÉCRAN DE CONSENTEMENT — « le second moment émotionnel »  (LOT O2a)
 * =====================================================================
 * Source d'autorité : SPRINT-002 Lot C0 · PRODUCT-001 §10 (registre OBJET) · P4.
 *
 * Le professionnel, authentifié sur Opus X, comprend à cet instant que son
 * travail chez cet Issuer va désormais nourrir son identité professionnelle.
 * Institutionnel, jamais festif. Aucune gamification, aucun confetti.
 *
 * L'Issuer est identifié par `issuer_id` (query). Le sujet est la SESSION —
 * jamais fourni. Un Issuer inconnu/inactif → écran « indisponible » uniforme.
 * =====================================================================
 */
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { fr } from '@/lib/i18n/fr';
import { ConsentForm } from './ConsentForm';

const t = fr.link;
const fill = (s: string, issuer: string) => s.replaceAll('{issuer}', issuer);

export default async function LinkPage({
  searchParams,
}: {
  searchParams: Promise<{ issuer_id?: string; redirect_uri?: string; state?: string; error?: string }>;
}) {
  const { issuer_id, redirect_uri, state, error } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/establish'); // l'identité doit être établie d'abord

  // Identité de l'Issuer (jamais le secret HMAC — colonnes d'identité publique).
  const { data: issuer } = issuer_id
    ? await supabase
        .from('wsp_issuers')
        .select('id, display_name, status')
        .eq('id', issuer_id)
        .eq('status', 'active')
        .maybeSingle()
    : { data: null };

  return (
    <main className="min-h-screen bg-paper-warm text-graphite-900 flex items-center justify-center px-6 py-breathe-lg">
      <div className="w-full max-w-md">
        {/* Filet d'or : le registre OBJET (§10) — quelque chose de mérité. */}
        <div className="mb-8 h-px w-16 bg-gold-500" aria-hidden />

        {!issuer || !redirect_uri ? (
          <p className="text-body text-graphite-700">{t.unavailable}</p>
        ) : (
          <>
            <p className="text-micro uppercase text-graphite-500">{t.eyebrow}</p>
            <h1 className="mt-3 font-institutional text-h1 font-semibold text-graphite-900">
              {fill(t.title, issuer.display_name)}
            </h1>

            {error && (
              <p role="alert" className="mt-6 border-l-2 border-attention bg-paper px-4 py-3 text-body-sm text-graphite-700">
                {t.error}
              </p>
            )}

            <p className="mt-6 text-body text-graphite-700">{fill(t.body, issuer.display_name)}</p>
            <p className="mt-4 text-body-sm text-graphite-500">{t.revocable}</p>
            <p className="mt-3 text-body-sm text-graphite-500">
              {fill(t.perPlatform, issuer.display_name)}
            </p>

            <ConsentForm
              issuerId={issuer.id}
              issuerName={issuer.display_name}
              redirectUri={redirect_uri}
              state={state ?? ''}
            />
          </>
        )}
      </div>
    </main>
  );
}
