/**
 * =====================================================================
 * ÉCRAN 2 — « Establish Your Professional Identity »  (LOT 6 · V2)
 * =====================================================================
 * Source d'autorité : spec figée §2 Écran 2, §5.4, Règle de localisation.
 *
 * Cas frontière : le TITRE reste en anglais (headline narratif de l'identité) ;
 * les champs, le CTA et l'aide sont localisés.
 *
 * Registre : colonne étroite, centrée, beaucoup d'air. Un acte fondateur,
 * jamais un « formulaire d'inscription ». Vocabulaire d'ÉTABLISSEMENT.
 *
 * V2 — Les consentements (cases NON pré-cochées) sont transportés dans les
 * métadonnées de signup et conservés localement pour un renvoi fidèle.
 * =====================================================================
 */
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ESTABLISH_IDENTITY_TITLE,
  buildEstablishmentConsents,
} from '@/lib/constants/passport.strings';
import { fr } from '@/lib/i18n/fr';
import { AuthService } from '@/lib/auth/AuthService';
import { createClient } from '@/lib/supabase/client';
import { savePendingEstablishment } from '@/lib/auth/pendingEstablishment';

const t = fr.establish;

// Validation email volontairement simple et permissive (le lien magique
// est la vraie preuve de possession de l'adresse).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EstablishPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [terms, setTerms] = useState(false); // NON pré-coché (§5.4)
  const [privacy, setPrivacy] = useState(false); // NON pré-coché (§5.4)

  const [touched, setTouched] = useState<{ name?: boolean; email?: boolean }>({});
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const nameValid = fullName.trim().length >= 2;
  const emailValid = EMAIL_RE.test(email.trim());
  const canSubmit = nameValid && emailValid && terms && privacy && !submitting;

  const nameError = useMemo(
    () => (touched.name && !nameValid ? t.nameRequired : null),
    [touched.name, nameValid]
  );
  const emailError = useMemo(
    () => (touched.email && !emailValid ? t.emailInvalid : null),
    [touched.email, emailValid]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ name: true, email: true });
    if (!canSubmit) return;

    setSubmitting(true);
    setBanner(null);

    const consents = { terms, privacy };
    const auth = new AuthService(createClient());
    const res = await auth.establishIdentity({
      email: email.trim().toLowerCase(),
      fullName: fullName.trim(),
      locale: 'fr',
      consents,
    });

    if (res.error) {
      // Aucune énumération d'email : message générique, saisie conservée.
      setBanner(t.error);
      setSubmitting(false);
      return;
    }

    // V2 — on conserve email + consentements versionnés pour un renvoi fidèle.
    savePendingEstablishment({
      email: email.trim().toLowerCase(),
      metadata: {
        full_name: fullName.trim(),
        locale: 'fr',
        consents: buildEstablishmentConsents(consents),
      },
    });

    router.push('/verify-email');
  }

  const inputClass = (invalid: boolean) =>
    [
      'mt-2 w-full rounded-control bg-paper px-3.5 py-2.5 text-body text-graphite-900',
      'min-h-[44px] outline-none transition-colors duration-micro ease-institutional',
      'border',
      invalid
        ? 'border-critical focus:border-critical'
        : 'border-graphite-300 focus:border-navy-500 focus:ring-2 focus:ring-navy-500/15',
    ].join(' ');

  return (
    // Registre OUTIL (§10) : fond paper-warm, voix Interface, graphite.
    <main className="min-h-screen bg-paper-warm text-graphite-900 flex items-center justify-center px-6 py-breathe-lg">
      <div className="w-full max-w-md">
        {/* Titre EN — voix INSTITUTIONNELLE (§6.1, serif), cas frontière de localisation. */}
        <h1 className="text-center font-institutional text-h1 font-semibold text-graphite-900">
          {ESTABLISH_IDENTITY_TITLE}
        </h1>
        <p className="mt-3 text-center text-body-sm text-graphite-500">{t.subtitle}</p>

        {/* Alerte quiet (§11.5) : 1px de bordure gauche fonctionnelle, fond paper, body-sm. */}
        {banner && (
          <div
            role="alert"
            className="mt-6 border-l-2 border-attention bg-paper px-4 py-3 text-body-sm text-graphite-700"
          >
            {banner}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
          {/* Nom complet */}
          <div>
            <label htmlFor="fullName" className="block text-body-sm font-medium text-graphite-900">
              {t.fullName}
            </label>
            <input
              id="fullName"
              ref={nameRef}
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onBlur={() => setTouched((s) => ({ ...s, name: true }))}
              aria-invalid={Boolean(nameError)}
              className={inputClass(Boolean(nameError))}
            />
            {nameError && <p className="mt-2 text-body-sm text-critical">{nameError}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-body-sm font-medium text-graphite-900">
              {t.email}
            </label>
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((s) => ({ ...s, email: true }))}
              aria-invalid={Boolean(emailError)}
              className={inputClass(Boolean(emailError))}
            />
            {emailError && <p className="mt-2 text-body-sm text-critical">{emailError}</p>}
          </div>

          <p className="text-body-sm text-graphite-500">{t.privacyNote}</p>

          {/* Consentements — cases NON pré-cochées (§5.4) */}
          <fieldset className="space-y-3 pt-1">
            <label className="flex items-start gap-3 text-body-sm text-graphite-700">
              <input
                type="checkbox"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-graphite-300 text-navy-600 focus:ring-navy-500/20"
              />
              <span>{t.acceptTerms}</span>
            </label>
            <label className="flex items-start gap-3 text-body-sm text-graphite-700">
              <input
                type="checkbox"
                checked={privacy}
                onChange={(e) => setPrivacy(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-graphite-300 text-navy-600 focus:ring-navy-500/20"
              />
              <span>{t.acceptPrivacy}</span>
            </label>
          </fieldset>

          {/* CTA primaire (§11.2) : navy-600, texte paper, rayon 6px, disabled 35%. */}
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full rounded-control bg-navy-600 px-4 py-3 text-body font-semibold text-paper transition-colors duration-micro ease-institutional hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-35"
          >
            {submitting ? t.submitting : t.cta}
          </button>
        </form>
      </div>
    </main>
  );
}
