/**
 * =====================================================================
 * PassportDocument — le rendu de l'OBJET (source unique)
 * =====================================================================
 * Registre OBJET (§10, §13) : navy-900→950, bordure navy-700, rayon 16px,
 * ombre objet ; sceau or (cercle enclosant un point, en haut à droite) ;
 * Opus ID gravé navy-200 ; cycle de vie visible (courant gold-500, futurs
 * navy-700, trajectoire désirable §13.4).
 *
 * L'OR est rare (§5.3) : seulement le sceau et l'étape de cycle de vie
 * courante. Le wordmark n'est PAS or (§5.3 : jamais un brand header).
 *
 * Priorité d'information (§13.5) : ce qui est prouvé > où l'on se situe
 * (cycle de vie, statut qualitatif) > ce qui est inféré (Trust, subordonné).
 * Utilisé par la fenêtre du Dashboard (compacte) et la vue privée (plein).
 */
import {
  LIFECYCLE_STAGES,
  lifecycleLabel,
  STATUS_LABELS,
  TRUST_STATE_LABELS,
  type LifecycleStageKey,
} from '@/lib/constants/passport.strings';
import { fr } from '@/lib/i18n/fr';

const t = fr.dashboard;

function formatIssued(iso: string): string {
  try {
    return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function trustLabel(state: string): string {
  return (
    TRUST_STATE_LABELS[state as keyof typeof TRUST_STATE_LABELS] ??
    state.charAt(0).toUpperCase() + state.slice(1)
  );
}

export function PassportDocument({
  opusId,
  issuedAt,
  lifecycleStage,
  holderName,
  trustState,
  padded = 'md',
}: {
  opusId: string;
  issuedAt: string;
  lifecycleStage: string;
  holderName?: string | null;
  trustState?: string | null;
  padded?: 'md' | 'lg';
}) {
  const currentIndex = Math.max(
    0,
    LIFECYCLE_STAGES.findIndex((s) => s.key === lifecycleStage)
  );
  const currentStage = LIFECYCLE_STAGES[currentIndex];
  const nextStage = LIFECYCLE_STAGES[currentIndex + 1];

  return (
    <article
      className="relative overflow-hidden rounded-object border border-navy-700 shadow-object"
      style={{
        background:
          'linear-gradient(160deg, var(--navy-800) 0%, var(--navy-900) 60%, var(--navy-950) 100%)',
      }}
    >
      {/* Guilloché discret — matière, tracé structurel navy-700. */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            'repeating-radial-gradient(circle at 22% 0%, var(--navy-700) 0 1px, transparent 1px 16px)',
        }}
      />

      {/* Le SCEAU (§13.2) — cercle enclosant un point, en haut à droite. */}
      <div aria-hidden className="absolute right-6 top-6">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="16" stroke="var(--gold-500)" strokeWidth="1.25" />
          <circle cx="18" cy="18" r="3.5" fill="var(--gold-500)" />
        </svg>
      </div>

      <div className={`relative ${padded === 'lg' ? 'p-8 md:p-14' : 'p-8 md:p-12'}`}>
        {/* En-tête institutionnel — serif, navy-200. */}
        <p className="font-institutional text-body font-semibold tracking-[0.30em] text-navy-200">
          OPUS X
        </p>
        <p className="mt-2 font-interface text-micro uppercase text-navy-300">
          Professional Passport
        </p>

        {/* Le titulaire (quand fourni) — l'identité que porte le document. */}
        {holderName && (
          <p className="mt-8 font-institutional text-h2 font-semibold text-navy-100">
            {holderName}
          </p>
        )}

        {/* L'Opus ID gravé (§13.3) + l'énoncé d'émission. */}
        <div className={holderName ? 'mt-4' : 'mt-8'}>
          <p className="opus-id text-body-lg text-navy-200">{opusId}</p>
          <p className="mt-2 font-interface text-body-sm text-navy-300">
            {t.issuedOn.replace('{date}', formatIssued(issuedAt))}
          </p>
        </div>

        {/* Cycle de vie (§13.4) — 7 étapes ; courante gold-500, futures navy-700. */}
        <div className="mt-12">
          <ol className="flex items-center gap-2">
            {LIFECYCLE_STAGES.map((stage, i) => {
              const isCurrent = i === currentIndex;
              return (
                <li key={stage.key} className="flex flex-1 items-center gap-2">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: isCurrent ? 'var(--gold-500)' : 'var(--navy-700)' }}
                  />
                  {i < LIFECYCLE_STAGES.length - 1 && (
                    <span className="h-px flex-1" style={{ background: 'var(--navy-700)' }} />
                  )}
                </li>
              );
            })}
          </ol>

          <div className="mt-4">
            {/* Étape courante — institutionnelle, gold-400 (or sur fond sombre §5.6). */}
            <p className="font-institutional text-body font-semibold text-gold-400">
              {lifecycleLabel(currentStage.key as LifecycleStageKey)}
            </p>
            <p className="mt-1 font-interface text-body-sm text-navy-300">
              {t.stageProgress
                .replace('{n}', String(currentIndex + 1))
                .replace('{total}', String(LIFECYCLE_STAGES.length))}
              {nextStage
                ? ' · ' +
                  t.nextStage.replace(
                    '{stage}',
                    lifecycleLabel(nextStage.key as LifecycleStageKey)
                  )
                : ''}
            </p>
            <p className="mt-3 max-w-md font-interface text-body-sm text-navy-300">
              {t.lifecycleHint}
            </p>
          </div>
        </div>

        {/* Statut inféré — Trust, SUBORDONNÉ aux faits (§13.5, §14.6). Qualitatif. */}
        {trustState && (
          <div className="mt-10 border-t border-navy-700 pt-6">
            <p className="font-interface text-micro uppercase text-navy-300">
              {STATUS_LABELS.trust}
            </p>
            <p className="mt-1 font-interface text-body text-navy-200">{trustLabel(trustState)}</p>
          </div>
        )}
      </div>
    </article>
  );
}
