/**
 * =====================================================================
 * Opus X — ArchetypePage : gabarit des ARCHÉTYPES ÉDITORIAUX
 * =====================================================================
 * Rend un ArchetypeContent déjà résolu (lib/content). Composant présentiel PUR :
 * il n'invente rien, ne résout aucun lien, ne décide d'aucun état.
 *
 * Tout est VISIBLE dans le DOM (jamais de cloaking, WEB-001B §13/§14).
 * Registre OBJET : navy dominant, or réservé à la confiance méritée — donc absent
 * d'ici (aucun CTA, aucun titre, aucune navigation en or).
 *
 * ÉTAT D'UN CTA — deux conditions CUMULATIVES, aucune décidée par ce composant :
 *   • `enabled` : le flag global unique (lib/seo/flags) ;
 *   • `href` non nul : la page de destination EXISTE (résolue par ctaHref).
 * À défaut de l'une ou l'autre → LIBELLÉ INERTE. Un CTA dont la destination
 * n'existe pas n'est jamais rendu comme un lien : c'est la garantie « jamais de
 * lien mort », tenue au rendu et pas seulement à la donnée.
 * =====================================================================
 */
import Link from 'next/link';
import type {
  ArchetypeContent,
  ArchetypeBlock,
  ArchetypeCta,
} from '@/lib/content/archetype';

/** Prose : paragraphes, sous-titres et listes. Texte échappé par React. */
function Blocks({ blocks }: { blocks: ArchetypeBlock[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.kind === 'h3') {
          return (
            <h3
              key={i}
              className={`font-institutional text-body font-semibold text-navy-100${i ? ' mt-6' : ''}`}
            >
              {b.text}
            </h3>
          );
        }
        if (b.kind === 'ul') {
          return (
            <ul key={i} className={`space-y-2${i ? ' mt-3' : ''}`}>
              {b.items.map((it, j) => (
                <li key={j} className="flex gap-2">
                  <span className="text-navy-500">—</span>
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className={`leading-relaxed${i ? ' mt-4' : ''}`}>
            {b.text}
          </p>
        );
      })}
    </>
  );
}

/**
 * Un CTA. Actif UNIQUEMENT si le flag l'autorise ET si la destination existe.
 * Sinon : libellé inerte, `aria-disabled`, aucun href émis.
 */
function Cta({ cta, variant = 'secondary' }: { cta: ArchetypeCta; variant?: 'primary' | 'secondary' }) {
  const base = 'inline-flex items-center gap-2 rounded-control px-4 py-2 font-interface text-body';
  const active =
    variant === 'primary'
      ? `${base} border border-navy-600 bg-navy-800 text-navy-100 hover:border-navy-400`
      : `${base} border border-navy-700 text-navy-200 hover:border-navy-400`;
  const inert = `${base} cursor-default border border-navy-800 bg-navy-900/40 text-navy-500`;

  if (cta.enabled && cta.href) {
    return (
      <Link href={cta.href} className={active}>
        {cta.label} →
      </Link>
    );
  }
  return (
    <span aria-disabled="true" className={inert}>
      {cta.label}
    </span>
  );
}

function CtaRow({ ctas }: { ctas: ArchetypeCta[] }) {
  if (!ctas.length) return null;
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      {ctas.map((c, i) => (
        <Cta key={i} cta={c} variant={i === 0 ? 'primary' : 'secondary'} />
      ))}
    </div>
  );
}

export function ArchetypePage({ content }: { content: ArchetypeContent }) {
  const c = content;
  return (
    <main className="min-h-screen bg-navy-950 px-6 py-breathe-xl text-navy-100">
      <article className="mx-auto max-w-[820px]">
        {/* Fil d'ariane (le JSON-LD BreadcrumbList est émis par la page). */}
        <nav aria-label="Breadcrumb" className="font-interface text-body-sm text-navy-400">
          <Link href="/en" className="hover:text-navy-200">
            Opus X
          </Link>
          <span className="mx-2">/</span>
          <span className="text-navy-300">{c.hero.h1}</span>
        </nav>

        {/* Hero */}
        <h1 className="mt-6 font-institutional text-h1 font-semibold leading-tight text-navy-50 md:text-display">
          {c.hero.h1}
        </h1>
        <p className="mt-4 font-institutional text-h3 leading-snug text-navy-200">{c.hero.subtitle}</p>
        <div className="mt-6 font-interface text-body text-navy-200">
          <Blocks blocks={c.hero.blocks} />
        </div>
        <CtaRow ctas={c.hero.ctas} />

        {/* Sections de prose */}
        {c.sections.map((s, i) => (
          <section key={i} className="mt-12 border-t border-navy-800 pt-8">
            <h2 className="font-interface text-micro uppercase tracking-[0.14em] text-navy-400">
              {s.title}
            </h2>
            <div className="mt-3 font-interface text-body text-navy-200">
              <Blocks blocks={s.blocks} />
            </div>
            {s.cta ? (
              <div className="mt-6">
                <Cta cta={s.cta} />
              </div>
            ) : null}
          </section>
        ))}

        {/* Sections de questions — chaque paire est visible dans le DOM, et reprise
            à l'identique par le FAQPage JSON-LD émis par la page. */}
        {c.qaSections.map((s, i) => (
          <section key={i} className="mt-12 border-t border-navy-800 pt-8">
            <h2 className="font-interface text-micro uppercase tracking-[0.14em] text-navy-400">
              {s.title}
            </h2>
            <div className="mt-4 space-y-8">
              {s.qa.map((item, j) => (
                <div key={j}>
                  <h3 className="font-institutional text-body font-semibold text-navy-100">{item.q}</h3>
                  <div className="mt-2 font-interface text-body text-navy-200">
                    <Blocks blocks={item.a} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Conclusion */}
        {c.conclusion.length ? (
          <section className="mt-12 border-t border-navy-800 pt-8">
            <h2 className="font-interface text-micro uppercase tracking-[0.14em] text-navy-400">
              Conclusion
            </h2>
            <div className="mt-3 font-interface text-body text-navy-200">
              <Blocks blocks={c.conclusion} />
            </div>
          </section>
        ) : null}

        {/* CTA final */}
        <section className="mt-12 border-t border-navy-800 pt-8">
          <h2 className="font-institutional text-h3 font-semibold text-navy-50">{c.finalCta.title}</h2>
          <p className="mt-3 font-interface text-body leading-relaxed text-navy-200">{c.finalCta.text}</p>
          <CtaRow ctas={c.finalCta.ctas} />
        </section>

        {/* Signature éditoriale (Source of Truth, bloc LLM) */}
        <footer className="mt-10 font-engraved text-body-sm text-navy-500">
          Document Version {c.signature.documentVersion} · {c.signature.editorialStatus} ·{' '}
          {c.signature.publisher} · {c.signature.language}
        </footer>
      </article>
    </main>
  );
}
