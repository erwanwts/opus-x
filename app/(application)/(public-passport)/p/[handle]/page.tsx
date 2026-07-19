import { notFound } from 'next/navigation';
import { fetchPublicPassport } from '@/lib/api/readPublicPassport';
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

export default async function PublicPassportPage({ params }: Props) {
  const { handle } = await params;

  const passport = await fetchPublicPassport(handle);
  if (!passport) notFound(); // privé / unlisted / inexistant / inaccessible → identique.

  return <PassportView passport={passport} />;
}
