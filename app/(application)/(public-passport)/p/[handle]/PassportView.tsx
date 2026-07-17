/**
 * =====================================================================
 * Rendu de l'OBJET Passport public — /p/{handle}  (registre OBJET §10)
 * =====================================================================
 * Composant PRÉSENTIEL PUR : ne lit rien, ne requête rien. Il reçoit une vue
 * DÉJÀ whitelistée (`PublicPassport`, produite par le lecteur unique) et n'en
 * rend QUE les champs autorisés. Aucun accès table, aucun champ inventé.
 *
 * VOIX : registre OBJET — navy profond, serif institutionnelle. L'OR est
 * réservé à la confiance MÉRITÉE : il n'apparaît QUE lorsqu'un élément est
 * `verified === true`. Jamais décoratif, jamais en navigation, jamais en CTA.
 *
 * INTERDITS (PRODUCT-001) : aucun score, aucun 0/100, aucune gamification,
 * aucun classement, aucune promesse non prouvée. Les états vides sont sobres —
 * une trajectoire, jamais un échec.
 *
 * TOUS les libellés proviennent de lib/constants/passport.strings (registre
 * verrouillé) : la voix du Passport vit en un seul endroit.
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

export function PassportView({ passport }: { passport: PublicPassport }) {
  const { display_name, headline, lifecycle_stage, verified, skills_status, evidence } = passport;
  const stageLabel = lifecycleLabelSafe(lifecycle_stage);

  return (
    // Registre OBJET — marine profond, voix institutionnelle.
    <div className="min-h-screen bg-navy-950 text-navy-100">
      <div className="mx-auto max-w-[760px] px-6 py-breathe-xl">
        {/* ── Bloc 1 — En-tête institutionnel Opus X ── */}
        <header className="flex items-baseline justify-between border-b border-navy-800 pb-6">
          <span className="font-institutional text-body font-semibold tracking-[0.30em] text-navy-100">
            OPUS X
          </span>
          {/* ── Bloc 2 — l'objet (vocabulaire canonique verrouillé, EN) ── */}
          <span className="font-interface text-micro uppercase text-navy-300">{S.object}</span>
        </header>

        {/* ── Bloc 3 — Identité publique ── */}
        <section className="pt-breathe">
          {display_name ? (
            <h1 className="font-institutional text-h1 font-semibold leading-tight text-navy-100 md:text-display">
              {display_name}
            </h1>
          ) : null}
          {headline ? (
            <p className="mt-3 font-interface text-body-lg text-navy-300">{headline}</p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-4">
            {stageLabel ? (
              <span className="font-interface text-body-sm text-navy-200">{stageLabel}</span>
            ) : null}
            {verified ? (
              <VerifiedSeal label={S.verified} />
            ) : (
              <span className="font-interface text-body-sm text-navy-400">{S.notVerified}</span>
            )}
          </div>
        </section>

        {/* ── Bloc 4 — Skills Status ── */}
        <section className="mt-breathe-lg border-t border-navy-800 pt-8">
          <h2 className="font-interface text-micro uppercase tracking-[0.12em] text-navy-400">
            {STATUS_LABELS.skills}
          </h2>
          {skills_status && skills_status !== 'empty' ? (
            <p className="mt-3 font-institutional text-body-lg text-navy-100">{skills_status}</p>
          ) : (
            <p className="mt-3 font-interface text-body text-navy-300">{S.skillsEmpty}</p>
          )}
        </section>

        {/* ── Bloc 5 — Evidence publique (uniquement ce que le helper autorise) ── */}
        <section className="mt-breathe-lg border-t border-navy-800 pt-8">
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
                  className="rounded-object border border-navy-700 bg-navy-900 p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-institutional text-body-lg text-navy-100">{e.title}</p>
                      <p className="mt-1 font-interface text-body-sm text-navy-400">{e.type}</p>
                    </div>
                    {/* OR uniquement sur une Evidence vérifiée. */}
                    {e.verified ? <VerifiedSeal label={S.verified} /> : null}
                  </div>
                  {/* Provenance visible si disponible — jamais inventée. */}
                  {e.issuer ? (
                    <p className="mt-3 font-interface text-body-sm text-navy-300">{e.issuer}</p>
                  ) : null}
                  {e.issued_at ? (
                    <p className="mt-1 font-engraved text-body-sm tracking-[0.04em] text-navy-400">
                      {e.issued_at}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ── Bloc 6 — Trust Status : moteur absent → capacité PLANIFIÉE ──
             Jamais une valeur simulée, jamais le stub interne, jamais un score.
             Clairement identifiable comme capacité protocolaire à venir. */}
        <section className="mt-breathe-lg border-t border-navy-800 pt-8">
          <h2 className="font-interface text-micro uppercase tracking-[0.12em] text-navy-400">
            {STATUS_LABELS.trust}
          </h2>
          <p className="mt-3 font-institutional text-body-lg text-navy-200">{S.trustNotComputed}</p>
          <p className="mt-1 font-interface text-body-sm text-navy-400">{S.trustPlannedNote}</p>
        </section>

        {/* ── Bloc 8 — Contrôle & propriété (le pro possède ; Opus X garde & vérifie) ──
             Bloc 7 (vérification datée) n'est rendu QUE si une Evidence
             vérifiée le fournit ci-dessus — jamais un contenu inventé ici. */}
        <footer className="mt-breathe-lg border-t border-navy-800 pt-8">
          <p className="font-interface text-body-sm leading-relaxed text-navy-400">
            {S.ownershipCustody}
          </p>
        </footer>
      </div>
    </div>
  );
}
