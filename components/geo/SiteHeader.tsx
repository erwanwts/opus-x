/**
 * =====================================================================
 * Opus X — SiteHeader : en-tête partagé du site public
 * =====================================================================
 * Logo seul (pas de navigation — sujet distinct, plus tard). Rendu par le layout
 * partagé sur les 11 pages du site (accueil + 10 piliers).
 *
 * DESIGN (PRODUCT-001 · CLAUDE.md) : chrome NAVY strict — bg-navy-950, bordure
 * navy. L'OR n'apparaît QUE dans l'image du logo (opusx-lockup), qui conserve son
 * or au titre de l'EXCEPTION BORNÉE (« le logo conserve son or »). Aucun or
 * décoratif, aucune navigation, aucun CTA ici.
 *
 * Le lockup est un rendu métallique raster (PNG haute-déf) ; `next/image` le sert
 * dimensionné (hauteur fixe h-12, largeur auto), `priority` (au-dessus de la ligne
 * de flottaison). Lié à l'accueil de la locale courante.
 * =====================================================================
 */
import Image from 'next/image';
import Link from 'next/link';

export function SiteHeader({ locale }: { locale: string }) {
  return (
    <header className="w-full border-b border-navy-700 bg-navy-950">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <Link href={`/${locale}`} aria-label="Opus X — World Skills Protocol" className="inline-flex">
          <Image
            src="/opusx-lockup.png"
            alt="Opus X — World Skills Protocol"
            width={1731}
            height={909}
            priority
            className="h-12 w-auto"
          />
        </Link>
      </div>
    </header>
  );
}
