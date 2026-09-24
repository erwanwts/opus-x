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
 *
 * Sprint 1 : `fetchPublicPassport` renvoie toujours `null` → 404 systématique
 * (aucun Passport n'est public). Le chemin de rendu est prêt pour l'ouverture.
 * =====================================================================
 */
export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ handle: string }> };

/**
 * SEO — un Passport PUBLIC est indexable (index,follow) : c'est un objet destiné
 * à être vérifié par un tiers, sa découvrabilité est un ATOUT. Un handle privé /
 * inexistant renvoie le MÊME jeu de balises `noindex` neutre — aucune fuite, aucun
 * signal distinguant privé d'inexistant (non-énumération jusque dans les métadonnées).
 *
 * Les balises n'exposent QUE des champs déjà whitelistés (nom, headline) : jamais
 * un champ interne. La description reste sobre, sans score ni promesse.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const passport = await fetchPublicPassport(handle);

  // Privé / unlisted / inexistant / inaccessible → métadonnées neutres, noindex.
  // MÊME sortie dans tous ces cas : rien ne distingue privé d'inexistant.
  if (!passport) {
    return { robots: { index: false, follow: false } };
  }

  const name = passport.display_name?.trim() || S.object;
  const title = `${name} · ${S.object}`;
  const description =
    passport.headline?.trim() ||
    'A Professional Passport issued and verified under the World Skills Protocol.';

  return {
    title,
    description,
    robots: { index: true, follow: true },
    openGraph: { title, description, type: 'profile' },
  };
}

export default async function PublicPassportPage({ params }: Props) {
  const { handle } = await params;

  const passport = await fetchPublicPassport(handle);
  if (!passport) notFound(); // privé / unlisted / inexistant / inaccessible → identique.

  // Le handle est le paramètre d'URL (déjà public) et a résolu une ligne PUBLIQUE :
  // on le passe tel quel à la vue. Il ne transite PAS par la whitelist DB — ce n'est
  // pas une divulgation de la projection, c'est l'identifiant public de la page.
  return <PassportView passport={passport} handle={handle} />;
}
