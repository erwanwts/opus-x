/**
 * =====================================================================
 * ÉCRAN 5 — ÉMISSION DU PROFESSIONAL PASSPORT · LA CÉRÉMONIE DE FORGE
 * (LOT 7 · V3)  —  LE PIC ÉMOTIONNEL
 * =====================================================================
 * Sources d'autorité :
 *   • Spec figée §1.7, §2 Écran 5 (séquence, vision, LOI D'OBJET, un seul CTA).
 *   • PRODUCT-001 Design System : §10 (registre Objet), §13 (le Passport :
 *     navy-900→800, bordure navy-700, rayon 16, ombre objet ; sceau or en
 *     haut à droite ; Opus ID gravé navy-200 ; cycle de vie courant gold-500,
 *     futur navy-700), §16 (motion : l'objet se MATÉRIALISE ~1600ms, ease
 *     institutionnel ; aucune fanfare).
 *
 * L'OR est rare (§5.3, <2%) : réservé au SCEAU, à l'étape de cycle de vie
 * COURANTE et au CTA cérémoniel (§11.2). Jamais sur les coches de forge, le
 * wordmark ou une décoration.
 *
 * V3 — « Identity Successfully Established » n'apparaît QU'APRÈS confirmation
 * serveur d'une émission atomique et complète (finalize_emission → complete).
 * Chaînes EN institutionnelles : VERBATIM depuis passport.strings.ts.
 * =====================================================================
 */
'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  EMISSION_SEQUENCE,
  EMISSION_FINAL_LINE_INDEX,
  VISION_STATEMENT,
  LIFECYCLE_STAGES,
  INITIAL_LIFECYCLE_STAGE,
} from '@/lib/constants/passport.strings';
import { fr } from '@/lib/i18n/fr';
import { AuthService, type EmissionStatus } from '@/lib/auth/AuthService';
import { createClient } from '@/lib/supabase/client';

const c = fr.ceremony;

// Rythme de la forge — les 3 premières lignes se jouent seules (~2,2 s, dans
// la fenêtre « ~2-3 s » de la spec figée §2.1). La 4ᵉ est gardée par le signal
// serveur (V3), jamais par une horloge.
const LINE_ACTIVATE_MS = [200, 900, 1600];
const LINE_SETTLE_MS = 600;

type LineStatus = 'idle' | 'active' | 'done';

export default function EmissionPage() {
  const router = useRouter();

  const authRef = useRef<AuthService | null>(null);
  if (authRef.current === null) authRef.current = new AuthService(createClient());
  const auth = authRef.current;

  const [lineStatus, setLineStatus] = useState<LineStatus[]>([
    'idle',
    'idle',
    'idle',
    'idle',
  ]);
  const [firstThreeDone, setFirstThreeDone] = useState(false);
  const [emission, setEmission] = useState<EmissionStatus | null>(null);
  const [sealed, setSealed] = useState(false);
  const [visionShown, setVisionShown] = useState(false);
  const [ctaShown, setCtaShown] = useState(false);
  const [navigating, setNavigating] = useState(false);

  const setLine = (i: number, s: LineStatus) =>
    setLineStatus((prev) => {
      const next = [...prev];
      next[i] = s;
      return next;
    });

  // ── L'émission serveur (V3), en tâche de fond, idempotente ──────────────
  // finalize_emission rattrape une émission incomplète ET vérifie les 4
  // écritures. Un refresh / double-clic n'émet JAMAIS deux Passports. La forge
  // TIENT jusqu'à complete:true — jamais un Passport « à moitié émis ».
  useEffect(() => {
    let mounted = true;

    (async () => {
      while (mounted) {
        const status = await auth.finalizeEmission();

        // V1 — l'email n'est pas réellement vérifié : retour au seuil.
        if (status.reason === 'email_not_verified') {
          router.replace('/verify-email');
          return;
        }

        if (mounted) setEmission(status);
        if (status.complete) return;

        // Retry automatique, digne, en tâche de fond.
        await new Promise((r) => setTimeout(r, 1500));
      }
    })();

    return () => {
      mounted = false;
    };
  }, [auth, router]);

  // ── La forge des 3 premières lignes, jouée automatiquement ──────────────
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 0; i < EMISSION_FINAL_LINE_INDEX; i++) {
      timers.push(setTimeout(() => setLine(i, 'active'), LINE_ACTIVATE_MS[i]));
      timers.push(
        setTimeout(() => setLine(i, 'done'), LINE_ACTIVATE_MS[i] + LINE_SETTLE_MS)
      );
    }
    timers.push(
      setTimeout(
        () => setFirstThreeDone(true),
        LINE_ACTIVATE_MS[EMISSION_FINAL_LINE_INDEX - 1] + LINE_SETTLE_MS
      )
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  // ── V3 — la ligne finale : seulement quand forge jouée ET serveur confirmé ─
  // ⚠️ Ne dépend QUE des deux booléens de déclenchement — jamais de lineStatus.
  // Cet effet mute lineStatus (ligne finale → 'active') ; si lineStatus était
  // une dépendance, cette mutation relancerait l'effet, dont le cleanup
  // annulerait aussitôt les timers de scellement (ligne figée en 'active',
  // objet jamais scellé, Opus ID/CTA jamais révélés). firstThreeDone et
  // emission?.complete ne basculent qu'une fois : l'effet s'exécute une fois,
  // et ses timers vont au bout.
  useEffect(() => {
    if (!firstThreeDone || !emission?.complete) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    setLine(EMISSION_FINAL_LINE_INDEX, 'active');
    timers.push(setTimeout(() => setLine(EMISSION_FINAL_LINE_INDEX, 'done'), 500));
    // Le scellement : l'Opus ID se grave, le sceau se pose.
    timers.push(setTimeout(() => setSealed(true), 700));
    // La phrase de vision, après le scellement.
    timers.push(setTimeout(() => setVisionShown(true), 1700));
    // Un seul CTA, révélé en dernier — pour ne pas court-circuiter le moment.
    timers.push(setTimeout(() => setCtaShown(true), 2600));

    return () => timers.forEach(clearTimeout);
  }, [firstThreeDone, emission?.complete]);

  // La forge « tient » élégamment tant que le serveur n'a pas confirmé.
  const holding = firstThreeDone && !emission?.complete;

  // Matérialisation de l'objet (§16.3) : il émerge du flou et de la translation
  // vers la netteté sur ~1600ms. Présent dès le départ (il se FORGE), jamais
  // absent puis « pop ».
  const doneCount = lineStatus
    .slice(0, EMISSION_FINAL_LINE_INDEX)
    .filter((s) => s === 'done').length;
  const forge = sealed ? 1 : Math.min(1, 0.25 + doneCount * 0.25);

  const handleDiscover = () => {
    if (navigating) return;
    setNavigating(true);
    router.push('/dashboard');
  };

  return (
    // Registre OBJET (§10) : fond de cérémonie navy-950 (§5.2). Gravité.
    <main className="relative min-h-screen overflow-hidden bg-navy-950 text-navy-200">
      {/* Chute de lumière basse et solennelle — navy, jamais un halo décoratif. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 18%, var(--navy-800) 0%, var(--navy-950) 62%)',
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 py-breathe-lg">
        {/* ─────────────────────────────────────────────────────────────
            L'OBJET PASSPORT — il se FORGE (§13.1 : navy-900→800, bordure
            navy-700, rayon 16, ombre objet). Largeur ≤ 640px.
            ───────────────────────────────────────────────────────────── */}
        <div
          className="w-full max-w-sm transition-all duration-object ease-institutional"
          style={{
            opacity: 0.25 + forge * 0.75,
            filter: `blur(${(1 - forge) * 2.2}px)`,
            transform: `translateY(${(1 - forge) * 10}px)`,
          }}
        >
          <article
            className="relative aspect-[3/4] w-full overflow-hidden rounded-object border border-navy-700 shadow-object"
            style={{
              background:
                'linear-gradient(160deg, var(--navy-800) 0%, var(--navy-900) 55%, var(--navy-950) 100%)',
            }}
          >
            {/* Guilloché discret — matière du document, tracé structurel navy-700. */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.10]"
              style={{
                backgroundImage:
                  'repeating-radial-gradient(circle at 50% 30%, var(--navy-700) 0 1px, transparent 1px 14px)',
              }}
            />

            {/* LE SCEAU (§13.2) — un seul repère or, en haut à droite : un cercle
                enclosant un point. Le seul élément plein. Se pose au scellement. */}
            <div
              className="absolute right-5 top-5 transition-all duration-object ease-institutional"
              style={{ opacity: sealed ? 1 : 0, transform: `scale(${sealed ? 1 : 0.7})` }}
            >
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
                <circle cx="20" cy="20" r="18" stroke="var(--gold-500)" strokeWidth="1.25" />
                <circle cx="20" cy="20" r="4" fill="var(--gold-500)" />
              </svg>
            </div>

            <div className="relative flex h-full flex-col items-center justify-between p-8 text-center">
              {/* En-tête institutionnel — serif, navy-200 (l'or n'est PAS pour un
                  brand header, §5.3). */}
              <div>
                <p className="font-institutional text-body-lg font-semibold tracking-[0.30em] text-navy-200">
                  OPUS X
                </p>
                <p className="mt-2 font-interface text-micro uppercase text-navy-300">
                  Professional Passport
                </p>
              </div>

              {/* L'OPUS ID GRAVÉ (§13.3) — mono, tracké +0.08em, navy-200. En
                  dessous, en body-sm, l'énoncé de permanence. */}
              <div
                className="w-full transition-all duration-object ease-institutional"
                style={{
                  opacity: sealed && emission?.opus_id ? 1 : 0,
                  transform: `translateY(${sealed ? 0 : 6}px)`,
                }}
              >
                <p className="opus-id text-body text-navy-200">{emission?.opus_id ?? ''}</p>
                <p className="mt-2 font-institutional text-body-sm text-navy-300">{c.forLife}</p>
              </div>
            </div>
          </article>

          {/* CYCLE DE VIE (§13.4) — les 7 étapes présentes ; courante en gold-500,
              futures en navy-700, comme une trajectoire désirable (jamais des
              cases vides). */}
          <div
            className="mt-6 transition-opacity duration-object ease-institutional"
            style={{ opacity: sealed ? 1 : 0 }}
          >
            <ol className="flex items-center justify-between gap-1">
              {LIFECYCLE_STAGES.map((stage) => {
                const isCurrent = stage.key === INITIAL_LIFECYCLE_STAGE;
                return (
                  <li key={stage.key} className="flex flex-1 flex-col items-center">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{
                        background: isCurrent ? 'var(--gold-500)' : 'var(--navy-700)',
                      }}
                    />
                    {isCurrent && (
                      // Étiquette gold-400 (or sur fond sombre, §5.6), micro tracké.
                      <span className="mt-2 text-center font-interface text-micro uppercase text-gold-400">
                        {stage.label}
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            LA SÉQUENCE DE FORGE — ligne par ligne (chaînes EN verbatim).
            Coches en navy-200 (l'or reste réservé au sceau/CTA/cycle de vie).
            ───────────────────────────────────────────────────────────── */}
        <div className="mt-breathe w-full max-w-sm space-y-3" aria-live="polite">
          {EMISSION_SEQUENCE.map((line, i) => {
            const status = lineStatus[i];
            const isFinal = i === EMISSION_FINAL_LINE_INDEX;
            if (status === 'idle') return null;
            return (
              <div
                key={line}
                className="flex items-center gap-3 transition-opacity duration-surface ease-institutional"
                style={{ opacity: status === 'active' ? 0.7 : 1 }}
              >
                <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                  {status === 'done' ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path
                        d="M3.5 8.5l3 3 6-7"
                        stroke="var(--navy-200)"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-navy-300" />
                  )}
                </span>
                {isFinal ? (
                  <span className="font-institutional text-body-lg font-semibold text-navy-100">
                    {line}
                  </span>
                ) : (
                  <span className="font-interface text-body text-navy-200">{line}</span>
                )}
              </div>
            );
          })}

          {/* La forge TIENT : attente digne, jamais un anticlimax. */}
          {holding && (
            <div className="flex items-center gap-3 pl-7 font-interface text-body-sm text-navy-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-navy-400" />
              {c.holding}
            </div>
          )}
        </div>

        {/* ─────────────────────────────────────────────────────────────
            LA PHRASE DE VISION (verbatim) — après le scellement. Serif
            institutionnelle (§6.1), body-lg.
            ───────────────────────────────────────────────────────────── */}
        <p
          className="mt-breathe max-w-md text-center font-institutional text-body-lg text-navy-100 transition-all duration-object ease-institutional"
          style={{
            opacity: visionShown ? 1 : 0,
            transform: `translateY(${visionShown ? 0 : 8}px)`,
          }}
        >
          {visionShown ? VISION_STATEMENT : ''}
        </p>

        {/* ─────────────────────────────────────────────────────────────
            UN SEUL CTA — bouton Objet cérémoniel (§11.2) : or à 10%, bordure
            or à 30%, texte gold-400. Révélé en dernier, après la vision.
            ───────────────────────────────────────────────────────────── */}
        <div
          className="mt-breathe transition-all duration-object ease-institutional"
          style={{
            opacity: ctaShown ? 1 : 0,
            transform: `translateY(${ctaShown ? 0 : 8}px)`,
            pointerEvents: ctaShown ? 'auto' : 'none',
          }}
        >
          <button
            type="button"
            onClick={handleDiscover}
            disabled={!ctaShown || navigating}
            className="rounded-control border border-gold-500/30 bg-gold-500/10 px-7 py-3 font-institutional text-body font-semibold tracking-wide text-gold-400 transition-colors duration-micro ease-institutional hover:bg-gold-500/20 disabled:opacity-60"
          >
            {c.discover}
          </button>
        </div>
      </div>
    </main>
  );
}
