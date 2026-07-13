import { notFound } from 'next/navigation';

/**
 * Page publique du Passport — PRÉSENTE, NON OUVERTE en Sprint 1.
 *
 * Le Passport est PRIVÉ PAR DÉFAUT. L'URL est réservée et modélisée,
 * mais aucune ligne n'est publique : la page renvoie 404 (spec §5.2).
 * Le gabarit existe pour que la whitelist des champs exposables (§5.3)
 * soit fixée dès la conception.
 */
export default function PublicPassportPage() {
  notFound();
}
