/**
 * =====================================================================
 * ÉCRAN 1 — LANDING LOCALISÉE  (WEB-002 Lot C3 — portage depuis (marketing))
 * =====================================================================
 * Sources d'autorité : spec figée §2 Écran 1, §1.2/§1.3 ; PRODUCT-001 §3.4
 * (« The product never persuades. It states. »), §4 (navy dominant, or réservé),
 * §17 (photographie — interdits Annexe B), §19 (les six notes ; le test).
 *
 * ELLE NE VEND PAS. Registre institutionnel : marine dominant, OR ABSENT (rien
 * n'est encore mérité sur une landing), espace généreux, typographie
 * institutionnelle. AUCUN cliché SaaS : pas de social proof, pas de logos
 * clients, pas de « get started free », pas de témoignage, pas de compteur.
 *
 * PORTAGE STRICT (pas de redesign) : même structure/classes que l'ancienne
 * (marketing)/page.tsx ; les textes viennent désormais des messages next-intl
 * (fr/en/es), rendus en STATIQUE (setRequestLocale). Un SEUL CTA → /establish
 * via next/link NON localisé (route app hors [locale] ; jamais /fr/establish).
 * =====================================================================
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const BASE = 'https://opusx.world';

/**
 * Canonical + hreflang de la home (WEB-002 Lot D · WEB-D5).
 * Fallback strict : n'émet QUE les 3 locales réellement traduites, plus
 * x-default → /en (langue canonique). Aucun chemin fantôme.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);

  return {
    alternates: {
      canonical: `${BASE}/${locale}`,
      languages: {
        en: `${BASE}/en`,
        fr: `${BASE}/fr`,
        es: `${BASE}/es`,
        'x-default': `${BASE}/en`,
      },
    },
  };
}

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LandingContent />;
}

function LandingContent() {
  const t = useTranslations('landing');
  return (
    // Registre institutionnel — marine dominant, texte clair. Or absent.
    <div className="min-h-screen bg-navy-950 text-navy-100">
      {/* En-tête : wordmark discret, aucun lien (un seul CTA sur la page). */}
      <header className="mx-auto max-w-[1200px] px-6 py-8">
        <span className="font-institutional text-body font-semibold tracking-[0.30em] text-navy-100">
          OPUS X
        </span>
      </header>

      <main className="mx-auto max-w-[1200px] px-6">
        {/* ── Hero ── espace généreux (l'espace est de la confiance, §4). ── */}
        <section className="grid grid-cols-1 items-center gap-breathe-lg py-breathe-xl md:grid-cols-2">
          <div className="max-w-[560px]">
            <h1 className="font-institutional text-h1 font-semibold leading-tight text-navy-100 md:text-display">
              {t('headline')}
            </h1>

            <p className="mt-8 font-interface text-body-lg text-navy-300">{t('subhead')}</p>

            {/* Le message central — voix institutionnelle, énoncée, non vendue. */}
            <p className="mt-8 font-institutional text-body-lg text-navy-100">{t('message')}</p>

            {/* Le CTA UNIQUE — commande d'interface, localisée. next/link NON
                localisé : /establish est une route app hors [locale]. */}
            <div className="mt-12">
              <Link
                href="/establish"
                className="inline-block rounded-control bg-navy-50 px-7 py-3.5 font-institutional text-body font-semibold text-navy-900 transition-colors duration-micro ease-institutional hover:bg-navy-100"
              >
                {t('cta')}
              </Link>
            </div>
          </div>

          {/* ── Représentation de l'OBJET Passport — à désirer. SANS OR :
               rien n'est encore mérité sur une landing. Le sceau s'obtient à
               l'émission ; ici, sa place est une empreinte marine. ── */}
          <div className="flex justify-center md:justify-end">
            <div
              aria-hidden
              className="relative aspect-[3/4] w-full max-w-[320px] overflow-hidden rounded-object border border-navy-700 shadow-object"
              style={{
                background:
                  'linear-gradient(160deg, var(--navy-800) 0%, var(--navy-900) 60%, var(--navy-950) 100%)',
              }}
            >
              <div
                className="absolute inset-0 opacity-[0.10]"
                style={{
                  backgroundImage:
                    'repeating-radial-gradient(circle at 22% 0%, var(--navy-700) 0 1px, transparent 1px 16px)',
                }}
              />
              {/* Empreinte du sceau — marine, non or (rien n'est mérité ici). */}
              <div className="absolute right-6 top-6">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <circle cx="18" cy="18" r="16" stroke="var(--navy-700)" strokeWidth="1.25" />
                  <circle cx="18" cy="18" r="3.5" fill="var(--navy-700)" />
                </svg>
              </div>
              <div className="relative flex h-full flex-col justify-between p-8">
                <div>
                  <p className="font-institutional text-body font-semibold tracking-[0.30em] text-navy-200">
                    OPUS X
                  </p>
                  {/* Vocabulaire canonique verrouillé — reste EN dans les 3 langues. */}
                  <p className="mt-2 font-interface text-micro uppercase text-navy-300">
                    Professional Passport
                  </p>
                </div>
                <p className="font-interface text-body-sm text-navy-300">{t('passportCaption')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Signaux de confiance — sobres, une ligne chacun. Pas de social
             proof, pas de logos, pas de témoignages. ── */}
        <section className="grid grid-cols-1 gap-8 border-t border-navy-800 py-breathe-lg md:grid-cols-3">
          {[
            { title: t('signals.ownershipTitle'), body: t('signals.ownershipBody') },
            { title: t('signals.permanenceTitle'), body: t('signals.permanenceBody') },
            { title: t('signals.securityTitle'), body: t('signals.securityBody') },
          ].map((s) => (
            <div key={s.title}>
              <h2 className="font-institutional text-h3 font-medium text-navy-100">{s.title}</h2>
              <p className="mt-2 font-interface text-body-sm text-navy-300">{s.body}</p>
            </div>
          ))}
        </section>
      </main>

      {/* ── Footer sobre. ── */}
      <footer className="mx-auto max-w-[1200px] border-t border-navy-800 px-6 py-8">
        <p className="font-interface text-body-sm text-navy-400">{t('footer')}</p>
      </footer>
    </div>
  );
}
