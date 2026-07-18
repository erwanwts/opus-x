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
  STATUS_LABELS,
  LIFECYCLE_STAGES,
  PUBLIC_PASSPORT_STRINGS as S,
} from '@/lib/constants/passport.strings';

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

/**
 * Le bandeau DÉMO — rendu DANS la carte, en tête, quand `is_demo === true`.
 *
 * DANS la carte à dessein : un bandeau posé au-dessus de l'objet se perdrait au
 * recadrage d'une capture d'écran. Ici il fait partie de l'objet.
 *
 * Navy/neutre — JAMAIS or : l'or est la confiance MÉRITÉE, or cette carte n'en
 * a mérité aucune. `role="note"` : le message est annoncé, pas décoratif (le
 * sceau, lui, est aria-hidden). `pr-20` dégage le sceau (positionné sur la
 * carte, non modifié — le rendu d'un VRAI Passport reste identique au Lot 4).
 */
function DemoBanner({ label }: { label: string }) {
  return (
    <div role="note" className="relative border-b border-navy-600 bg-navy-800 px-8 py-4 pr-20 md:px-12 md:pr-24">
      <p className="font-interface text-body-sm leading-relaxed text-navy-100">{label}</p>
    </div>
  );
}

export function PassportView({ passport }: { passport: PublicPassport }) {
  const {
    display_name,
    headline,
    lifecycle_stage,
    issued_at,
    verified,
    is_demo,
    skills,
    evidence,
  } = passport;
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

        {/* ── Bloc 0 — VITRINE : annule le sceau avant même que l'œil l'atteigne ── */}
        {is_demo ? <DemoBanner label={S.demoBanner} /> : null}

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

          {/* ── Bloc 4 — Skills publiques (Lot 5) ──
               `skills_status` n'est PLUS rendu : c'était la valeur BRUTE de la
               base, affichée telle quelle, sans libellé. La liste la remplace.
               Le scalaire reste au contrat (whitelist / API JSON).
               NOM SEUL — jamais de `level` : le niveau interprété du Passport
               relève d'une couche protocolaire qui n'existe pas (D6, O3/O4).
               Aucun compteur, aucun score, aucun classement (PRODUCT-001). */}
          <section className="mt-10 border-t border-navy-700 pt-8">
            <h2 className="font-interface text-micro uppercase tracking-[0.12em] text-navy-400">
              {STATUS_LABELS.skills}
            </h2>
            {skills.length === 0 ? (
              <p className="mt-3 font-interface text-body text-navy-300">{S.skillsEmpty}</p>
            ) : (
              <ul className="mt-4 flex flex-wrap gap-2">
                {skills.map((s, i) => (
                  <li
                    key={`${s.name}-${i}`}
                    className="rounded-control border border-navy-700 bg-navy-900/60 px-3 py-1 font-institutional text-body-sm text-navy-100"
                  >
                    {s.name}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* ── Bloc 5 — Evidence publique (uniquement ce que le helper autorise) ── */}
          <section className="mt-10 border-t border-navy-700 pt-8">
            <h2 className="font-interface text-micro uppercase tracking-[0.12em] text-navy-400">
              {STATUS_LABELS.evidence}
            </h2>
            {evidence.length === 0 ? (
              <p className="mt-3 font-interface text-body text-navy-300">{S.evidenceEmpty}</p>
            ) : (
              <ul className="mt-4 space-y-4">
                {evidence.map((e, i) => (
                  <li
                    key={`${e.type}-${e.title}-${i}`}
                    className="rounded-object border border-navy-700 bg-navy-900/60 p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-institutional text-body-lg text-navy-100">{e.title}</p>
                        <p className="mt-1 font-interface text-body-sm text-navy-400">{e.type}</p>
                      </div>
                      {/* OR uniquement sur une Evidence vérifiée. */}
                      {e.verified ? <VerifiedSeal label={S.verified} /> : null}
                    </div>
                    {e.issuer ? (
                      <p className="mt-3 font-interface text-body-sm text-navy-300">{e.issuer}</p>
                    ) : null}
                    {e.issued_at ? (
                      <p className="mt-1 opus-id text-body-sm text-navy-400">{e.issued_at}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* ── Bloc 6 — Trust Status : moteur absent → capacité PLANIFIÉE ──
               Jamais une valeur simulée, jamais le stub interne, jamais un score. */}
          <section className="mt-10 border-t border-navy-700 pt-8">
            <h2 className="font-interface text-micro uppercase tracking-[0.12em] text-navy-400">
              {STATUS_LABELS.trust}
            </h2>
            <p className="mt-3 font-institutional text-body-lg text-navy-200">{S.trustNotComputed}</p>
            <p className="mt-1 font-interface text-body-sm text-navy-400">{S.trustPlannedNote}</p>
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
