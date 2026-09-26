import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchSharedPassport } from '@/lib/api/readSharedPassport';
import { PassportView } from '../../p/[handle]/PassportView';

/**
 * =====================================================================
 * Page de consultation PAR TOKEN — /verify/{token}  (T-B, D-058→D-062)
 * =====================================================================
 * La « sortie » : un tiers, muni d'un lien tokenisé, consulte un passeport —
 * même PRIVÉ (le token outrepasse le privé, D-T1) — mais SEULEMENT ses
 * compétences PUBLIÉES (D-042 conservé). Réutilise le lecteur token-scopé
 * (`fetchSharedPassport`, garde en base) + le MÊME rendu que la page publique
 * (`PassportView`) + la MÊME whitelist (`buildPublicPassport`).
 *
 * DIFFÉRENCE avec /p/{handle} : un token révèle un passeport NON public → la
 * page est TOUJOURS `noindex` (jamais découvrable / indexée), et le 404 est
 * NON-ÉNUMÉRANT (token inconnu == révoqué == périmètre vide → même notFound()).
 * =====================================================================
 */
export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ token: string }> };

/**
 * SEO — une page tokenisée n'est JAMAIS indexée (le token est une capability
 * privée, pas un objet public découvrable). `noindex` INCONDITIONNEL : valide,
 * révoqué ou inexistant rendent le même jeu de balises neutre — aucune fuite.
 */
export async function generateMetadata(): Promise<Metadata> {
  return { robots: { index: false, follow: false } };
}

export default async function VerifyTokenPage({ params }: Props) {
  const { token } = await params;

  const result = await fetchSharedPassport(token);
  // Token inconnu / révoqué / passeport sans compétence publiée → identique.
  if (!result) notFound();

  // Le handle vient de la projection whitelistée (identifiant public d'affichage),
  // jamais un champ interne (opus_id/passport_id ne transitent pas).
  return <PassportView passport={result.passport} handle={result.handle} />;
}
