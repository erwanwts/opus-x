/**
 * =====================================================================
 * ÉCRAN 4 — Email Verification  (LOT 5 · V1 + V2)
 * =====================================================================
 * Source d'autorité : spec figée §2 Écran 4, §1.4, package Lot 5.
 *
 * Objectif : confirmer l'email SANS perdre l'utilisateur. La contrainte
 * devient un gage de sérieux, jamais un cul-de-sac.
 *
 * Attente ACTIVE (l'écran « écoute »), aucun spinner nu :
 *   • V1 — on n'avance vers la cérémonie qu'après vérification RÉELLE
 *          (email_confirmed_at) — lue en base, jamais un drapeau local.
 *   • Reprise multi-appareils — si le lien est cliqué ailleurs, cet onglet
 *          détecte la confirmation (onAuthStateChange + polling) et avance
 *          SEUL vers l'écran 5.
 *   • V2 — un renvoi re-transporte les consentements à l'identique.
 * =====================================================================
 */
'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { fr } from '@/lib/i18n/fr';
import { AuthService, RESEND_COOLDOWN_SECONDS } from '@/lib/auth/AuthService';
import { createClient } from '@/lib/supabase/client';
import { loadPendingEstablishment } from '@/lib/auth/pendingEstablishment';

const t = fr.verifyEmail;

function VerifyEmailInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const authRef = useRef<AuthService | null>(null);
  if (authRef.current === null) authRef.current = new AuthService(createClient());
  const auth = authRef.current;

  const [email, setEmail] = useState<string>('');
  const [cooldown, setCooldown] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);

  // Un lien expiré redirige ici avec ?expired / ?error (posé par l'écran 5).
  const expired =
    searchParams.get('expired') === '1' || Boolean(searchParams.get('error'));

  // ── Source de l'email : établissement en cours, sinon session courante ──
  useEffect(() => {
    const pending = loadPendingEstablishment();
    if (pending?.email) {
      setEmail(pending.email);
      return;
    }
    auth.getUser().then((u) => {
      if (u?.email) setEmail(u.email);
    });
  }, [auth]);

  // ── Attente active : dès que l'email est réellement vérifié, on avance ──
  useEffect(() => {
    const stop = auth.watchForVerification(() => {
      router.replace('/emission');
    });
    return stop;
  }, [auth, router]);

  // ── Cooldown anti-spam du renvoi ──
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  // Un lien expiré : on prépare immédiatement un nouveau lien.
  const autoResentRef = useRef(false);
  useEffect(() => {
    if (expired && email && !autoResentRef.current) {
      autoResentRef.current = true;
      void doResend();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expired, email]);

  async function doResend() {
    if (cooldown > 0 || !email) return;
    setCooldown(RESEND_COOLDOWN_SECONDS);
    setNotice(null);

    const pending = loadPendingEstablishment();
    // V2 — les consentements re-voyagent : un renvoi ne les perd jamais.
    const { error } = await auth.resendLink(email, pending?.metadata);
    setNotice(error ? t.expired : t.resent);
  }

  return (
    // Registre OUTIL (§10) : fond paper-warm, voix Interface, graphite.
    <main className="min-h-screen bg-paper-warm text-graphite-900 flex items-center justify-center px-6 py-breathe-lg">
      <div className="w-full max-w-md text-center">
        {/* Icône sobre : une enveloppe, aucun spinner nu. */}
        <div
          aria-hidden
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-surface border border-graphite-300 bg-paper"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--navy-500)"
            strokeWidth="1.6"
          >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
          </svg>
        </div>

        <h1 className="mt-6 font-institutional text-h2 font-semibold text-graphite-900">
          {t.title}
        </h1>

        <p className="mt-3 text-body-sm text-graphite-500">
          {t.body.replace('{email}', email || '…')}
        </p>

        {/* Alerte quiet (§11.5) : lien expiré → attention, jamais alarmant. */}
        {expired && (
          <div
            role="alert"
            className="mt-5 border-l-2 border-attention bg-paper px-4 py-3 text-left text-body-sm text-graphite-700"
          >
            {t.expired}
          </div>
        )}

        {/* Attente active — l'écran écoute. Pouls lent (§16 : rien ne « race »). */}
        <div className="mt-6 flex items-center justify-center gap-2 text-body-sm text-graphite-500">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-navy-500" />
          {t.waiting}
        </div>

        {notice && <p className="mt-4 text-body-sm text-graphite-700">{notice}</p>}

        <div className="mt-8 space-y-3">
          {/* Bouton secondaire (§11.2) : paper, 1px graphite-300, texte graphite-900. */}
          <button
            type="button"
            onClick={doResend}
            disabled={cooldown > 0 || !email}
            className="w-full rounded-control border border-graphite-300 bg-paper px-4 py-2.5 text-body font-medium text-graphite-900 transition-colors duration-micro ease-institutional hover:border-navy-500 disabled:cursor-not-allowed disabled:opacity-35"
          >
            {cooldown > 0
              ? t.resendIn.replace('{seconds}', String(cooldown))
              : t.resend}
          </button>

          <Link
            href="/establish"
            className="block text-body-sm text-navy-500 transition-colors duration-micro hover:underline"
          >
            {t.changeEmail}
          </Link>
        </div>

        <p className="mt-8 text-body-sm text-graphite-500">{t.protect}</p>
        <p className="mt-2 text-body-sm text-graphite-500">{t.spamHint}</p>
      </div>
    </main>
  );
}

// useSearchParams() exige une frontière Suspense en build de production
// (bailout CSR). Le fallback reste dans le registre OUTIL, calme.
export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={<main className="min-h-screen bg-paper-warm" aria-hidden />}
    >
      <VerifyEmailInner />
    </Suspense>
  );
}
