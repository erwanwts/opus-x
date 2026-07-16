/**
 * Carte de statut — registre OUTIL (§11.1) : surface paper, 1px graphite-300,
 * rayon 8px, 24px de padding interne, AUCUNE ombre, aucun bandeau coloré,
 * aucune illustration. Titre en h3.
 *
 * Le titre est un libellé de statut EN institutionnel (Trust/Skills/Evidence
 * Status), rendu dans la voix Interface (une carte outil, pas l'objet).
 *
 * Si la donnée du module a échoué (§12.4), la carte montre un état de reprise
 * ISOLÉ — quiet, jamais alarmant — sans casser le reste de la surface.
 */
import Link from 'next/link';
import { fr } from '@/lib/i18n/fr';

export function StatusCard({
  title,
  errored = false,
  children,
}: {
  title: string;
  errored?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-label={title}
      className="rounded-surface border border-graphite-300 bg-paper p-6"
    >
      <h3 className="font-interface text-h3 font-medium text-graphite-900">{title}</h3>

      <div className="mt-4">
        {errored ? (
          <div>
            <p className="font-interface text-body-sm text-graphite-500">
              {fr.dashboard.moduleError}
            </p>
            <Link
              href="/dashboard"
              className="mt-2 inline-block font-interface text-body-sm font-medium text-navy-500 hover:underline"
            >
              {fr.dashboard.retry}
            </Link>
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}

/** Statut = un point + un libellé micro tracké majuscule (§11.4). */
export function StatusDot({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: color }}
      />
      <span className="font-interface text-micro uppercase text-graphite-700">{label}</span>
    </div>
  );
}
