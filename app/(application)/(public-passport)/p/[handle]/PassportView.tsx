/**
 * =====================================================================
 * Rendu de l'OBJET Passport public — /p/{handle}  (registre OBJET §10, §13)
 * =====================================================================
 * Composant PRÉSENTIEL PUR : ne lit rien, ne requête rien. Il reçoit une vue
 * DÉJÀ whitelistée (`PublicPassport`, produite par le lecteur unique) et n'en
 * rend QUE les champs autorisés. Aucun accès table, aucun champ inventé.
 *
 * ESTHÉTIQUE DE L'OBJET (Lot 4) : carte navy (gradient + bordure + ombre) +
 * sceau or + guilloché + timeline 7 étapes + date d'émission gravée. Le STYLE
 * est EMPRUNTÉ à PassportDocument (registre OBJET) mais RÉ-IMPLÉMENTÉ ici :
 * AUCUN import de PassportDocument (pas de couplage privé/public). PassportView
 * reste la SEULE surface publique, nourrie par la whitelist.
 *
 * VOIX : navy profond, serif institutionnelle. L'OR est réservé à la confiance
 * MÉRITÉE — sceau de l'objet + Evidence vérifiée + étape de cycle de vie
 * courante. Jamais décoratif au sens gadget, jamais en navigation/CTA.
 *
 * INTERDITS (PRODUCT-001) : aucun score, aucun 0/100, aucune gamification. Les
 * états vides sont sobres — une trajectoire, jamais un échec. L'OPUS ID N'EST
 * JAMAIS AFFICHÉ (hors whitelist). Trust reste « Not yet computed ».
 *
 * TOUS les libellés proviennent de lib/constants/passport.strings.
 * =====================================================================
 */
import type { PublicPassport } from '@/lib/api/publicPassport';
import {
  LIFECYCLE_STAGES,
  TRUST_STATE_LABELS,
  PUBLIC_PASSPORT_STRINGS as S,
} from '@/lib/constants/passport.strings';

/** Libellé qualitatif d'un état de Trust — jamais un score (OCR-105). */
function trustStateLabel(state: string): string {
  return (TRUST_STATE_LABELS as Record<string, string>)[state] ?? state;
}

/** Libellé institutionnel d'une étape — sans jamais lever si la clé est inconnue. */
function lifecycleLabelSafe(stage: string): string | null {
  return LIFECYCLE_STAGES.find((s) => s.key === stage)?.label ?? null;
}

/** Formatage déterministe de la date d'émission — locale FIXE en-US, UTC (tests stables). */
function formatIssued(iso: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/** Le sceau OR — n'est rendu QUE pour un élément vérifié (confiance méritée). */
function VerifiedSeal({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-control border border-gold-600/40 bg-gold-500/10 px-3 py-1 font-interface text-body-sm text-gold-400">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.25" />
        <circle cx="8" cy="8" r="1.75" fill="currentColor" />
      </svg>
      {label}
    </span>
  );
}

export function PassportView({ passport, handle }: { passport: PublicPassport; handle: string }) {
  const { display_name, headline, lifecycle_stage, issued_at, verified, competencies } = passport;
  const stageLabel = lifecycleLabelSafe(lifecycle_stage);
  const currentIndex = Math.max(0, LIFECYCLE_STAGES.findIndex((s) => s.key === lifecycle_stage));

  return (
    // Registre OBJET — fond navy profond ; l'objet, centré, en carte.
    <div className="min-h-screen bg-navy-950 px-6 py-breathe-xl text-navy-100">
      <article
        className="relative mx-auto max-w-[760px] overflow-hidden rounded-object border border-navy-700 shadow-object"
        style={{
          background:
            'linear-gradient(160deg, var(--navy-800) 0%, var(--navy-900) 60%, var(--navy-950) 100%)',
        }}
      >
        {/* Guilloché discret — matière, tracé structurel navy-700 (décoratif). */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage:
              'repeating-radial-gradient(circle at 22% 0%, var(--navy-700) 0 1px, transparent 1px 16px)',
          }}
        />

        {/* Le SCEAU (§13.2) — cercle enclosant un point, en haut à droite (or). */}
        <div aria-hidden className="absolute right-6 top-6">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="16" stroke="var(--gold-500)" strokeWidth="1.25" />
            <circle cx="18" cy="18" r="3.5" fill="var(--gold-500)" />
          </svg>
        </div>

        <div className="relative p-8 md:p-12">
          {/* ── Bloc 1 — En-tête institutionnel + Bloc 2 — l'objet ── */}
          <p className="font-institutional text-body font-semibold tracking-[0.30em] text-navy-200">
            OPUS X
          </p>
          <p className="mt-2 font-interface text-micro uppercase text-navy-300">{S.object}</p>

          {/* ── Bloc 3 — Identité publique ── */}
          {display_name ? (
            <h1 className="mt-8 font-institutional text-h1 font-semibold leading-tight text-navy-100 md:text-display">
              {display_name}
            </h1>
          ) : null}
          {headline ? (
            <p className="mt-3 font-interface text-body-lg text-navy-300">{headline}</p>
          ) : null}

          {/* Handle public — l'identifiant de la page (déjà dans l'URL). Discret,
               gravé en mono, sous l'identité. Jamais l'Opus ID (hors whitelist). */}
          <p className="mt-2 opus-id text-body-sm text-navy-400">@{handle}</p>

          {/* Date d'émission — gravée (.opus-id = mono/tracké), mais c'est la DATE. */}
          {issued_at ? (
            <p className="mt-4 opus-id text-body-sm text-navy-300">
              {S.issuedOn} · {formatIssued(issued_at)}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-4">
            {verified ? (
              <VerifiedSeal label={S.verified} />
            ) : (
              <span className="font-interface text-body-sm text-navy-400">{S.notVerified}</span>
            )}
          </div>

          {/* ── Timeline 7 étapes (§13.4) — constante LIFECYCLE_STAGES ; courante
               gold-500, futures navy-700. Zéro nouvelle divulgation (l'étape
               courante = lifecycle_stage, déjà public). ── */}
          <div className="mt-10">
            <ol aria-hidden className="flex items-center gap-2">
              {LIFECYCLE_STAGES.map((stage, i) => (
                <li key={stage.key} className="flex flex-1 items-center gap-2">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: i === currentIndex ? 'var(--gold-500)' : 'var(--navy-700)' }}
                  />
                  {i < LIFECYCLE_STAGES.length - 1 && (
                    <span className="h-px flex-1" style={{ background: 'var(--navy-700)' }} />
                  )}
                </li>
              ))}
            </ol>
            {stageLabel ? (
              <p className="mt-4 font-institutional text-body font-semibold text-gold-400">
                {stageLabel}
              </p>
            ) : null}
            <p className="mt-1 font-interface text-body-sm text-navy-300">
              {S.stageProgress
                .replace('{current}', String(currentIndex + 1))
                .replace('{total}', String(LIFECYCLE_STAGES.length))}
            </p>
          </div>

          {/* ── COMPÉTENCES VÉRIFIÉES (Palier 5, D-044) — le cœur de la page ──
               Par compétence PUBLIÉE : nom, état de Trust (qualitatif, jamais un
               score — OCR-105) et la PROVENANCE VISIBLE « vérifié par X · date ».
               C'est ce qui distingue d'un profil déclaratif — donc central, pas
               en petit. L'OR n'apparaît QUE pour une compétence `established`.
               La liste vient de la vue à DOUBLE FILTRE : rien ici n'est publié
               qui ne soit un passeport public ET une compétence publiée. */}
          <section className="mt-10 border-t border-navy-700 pt-8">
            <h2 className="font-interface text-micro uppercase tracking-[0.12em] text-navy-400">
              {S.competencies}
            </h2>
            {competencies.length === 0 ? (
              <p className="mt-3 font-interface text-body text-navy-300">{S.competenciesEmpty}</p>
            ) : (
              <ul className="mt-5 space-y-5">
                {competencies.map((c) => {
                  const isEstablished = c.state === 'established';
                  return (
                    <li
                      key={c.skill_id}
                      className="rounded-object border border-navy-700 bg-navy-900/60 p-6"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <p className="font-institutional text-body-lg text-navy-100">
                          {c.skill_name ?? c.skill_id}
                        </p>
                        {/* État de Trust — OR mérité seulement pour `established`. */}
                        {isEstablished ? (
                          <VerifiedSeal label={trustStateLabel(c.state)} />
                        ) : (
                          <span className="inline-flex items-center rounded-control border border-navy-600 px-3 py-1 font-interface text-body-sm text-navy-300">
                            {trustStateLabel(c.state)}
                          </span>
                        )}
                      </div>

                      {/* PROVENANCE VISIBLE — l'atout central : « vérifié par X · date ». */}
                      {c.provenance.length > 0 ? (
                        <div className="mt-4 space-y-1.5">
                          {c.provenance.map((p, i) => (
                            <p
                              key={i}
                              className="font-interface text-body-sm text-navy-300"
                            >
                              {S.verifiedBy}{' '}
                              <span className="text-navy-100">{p.issuer_name ?? '—'}</span>
                              {p.occurred_at ? (
                                <span className="opus-id text-navy-400">
                                  {' · '}
                                  {formatIssued(p.occurred_at)}
                                </span>
                              ) : null}
                            </p>
                          ))}
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* ── Bloc 8 — Contrôle & propriété (le pro possède ; Opus X garde & vérifie) ── */}
          <footer className="mt-10 border-t border-navy-700 pt-8">
            <p className="font-interface text-body-sm leading-relaxed text-navy-400">
              {S.ownershipCustody}
            </p>
          </footer>
        </div>
      </article>
    </div>
  );
}
