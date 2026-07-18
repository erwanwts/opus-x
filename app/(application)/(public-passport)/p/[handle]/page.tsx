import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchPublicPassport } from '@/lib/api/readPublicPassport';
import { PUBLIC_PASSPORT_STRINGS as S } from '@/lib/constants/passport.strings';
import { PassportView } from './PassportView';

/**
 * =====================================================================
 * Page publique du Passport — /p/{handle}  (registre OBJET §10)
 * =====================================================================
 * REND l'objet Passport à partir du lecteur UNIQUE `fetchPublicPassport()` —
 * la MÊME source que la route JSON /passports/{handle}. Aucun accès table
 * direct, aucune construction parallèle du payload, aucun champ hors whitelist.
 *
 * RÈGLE 404 NON-ÉNUMÉRANTE (non négociable) :
 *   • handle public (anon + RLS) → la page REND le Passport ;
 *   • handle privé / unlisted / inexistant / inaccessible → EXACTEMENT le même
 *     notFound() / 404. Aucune différence de réponse, de branche NI DE TIMING
 *     (le lecteur renvoie `null` sans requête supplémentaire dans tous ces cas).
 *     `generateMetadata` suit la MÊME règle : `{}` pour tout cas non public —
 *     un titre ne doit jamais trahir l'existence d'un Passport privé.
 *
 * VITRINE (Lot 5) : un Passport `is_demo` est NOINDEX. Sans ça, une démo
 * publique — sceau « Verified » compris — serait indexable (/p/ n'est pas dans
 * app/robots.ts), et un tiers l'atteindrait par un moteur, hors contexte. Le
 * bandeau protège le lecteur présent ; le noindex protège le lecteur futur.
 * =====================================================================
 */
export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ handle: string }> };

/**
 * `cache()` dédoublonne la lecture entre generateMetadata et la page dans le
 * MÊME rendu : une requête, pas deux. Le lecteur reste inchangé (source unique).
 */
const getPassport = cache(fetchPublicPassport);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const passport = await getPassport(handle);

  // Non public → aucune metadata. Même silence que le 404 (non-énumération).
  if (!passport) return {};

  const name = passport.display_name ?? S.object;

  // Le marqueur vit AUSSI dans le titre : le noindex écarte les moteurs, pas les
  // aperçus de lien (messageries, réseaux) où seul le titre est lu.
  return passport.is_demo
    ? { title: `Demonstration — ${name} · ${S.object}`, robots: { index: false, follow: false } }
    : { title: `${name} · ${S.object}` };
}

export default async function PublicPassportPage({ params }: Props) {
  const { handle } = await params;

  const passport = await getPassport(handle);
  if (!passport) notFound(); // privé / unlisted / inexistant / inaccessible → identique.

  return <PassportView passport={passport} />;
}
