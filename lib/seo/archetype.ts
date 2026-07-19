/**
 * =====================================================================
 * Opus X — Garde de locale des ARCHÉTYPES ÉDITORIAUX
 * =====================================================================
 * Concerne UNIQUEMENT les archétypes (Homepage, FAQ, API & Developers, Knowledge
 * Graph) — JAMAIS les fiches concept (qui gardent leur 404 sur locale non générée).
 *
 * Règle gravée (architecte) : une langue SANS traduction REDIRIGE vers l'anglais.
 * La redirection est DÉRIVÉE du registre de traductions de l'archétype
 * (`translatedLocales`), même logique qu'entityHref / pillarHrefBySlug : dès qu'une
 * traduction est publiée (ajoutée à `translatedLocales` + generateStaticParams),
 * `/fr` devient une page statique et la redirection DISPARAÎT d'elle-même. Aucun
 * `/fr → /en` codé en dur — donc aucune dette à retirer plus tard.
 *
 * 307 (temporaire) : la ressource traduite existera un jour ; ce n'est pas permanent.
 * Locale hors `routing.locales` → 404 (chemin invalide).
 * =====================================================================
 */
import { routing } from '@/i18n/routing';
import { notFound, redirect } from 'next/navigation';

const DEFAULT_LOCALE = 'en';

/**
 * @param locale locale demandée
 * @param slug   segment de l'archétype sous /{locale}/ ('' pour la Homepage)
 * @param translatedLocales locales réellement traduites de CET archétype
 * Ne retourne rien si la locale est traduite ; sinon 404 (invalide) ou 307 → anglais.
 */
export function guardArchetypeLocale(locale: string, slug: string, translatedLocales: string[]): void {
  if (!(routing.locales as readonly string[]).includes(locale)) notFound();
  if (translatedLocales.includes(locale)) return; // traduit → rendu normal
  redirect(slug ? `/${DEFAULT_LOCALE}/${slug}` : `/${DEFAULT_LOCALE}`); // 307 dérivé
}
