/**
 * =====================================================================
 * Opus X — GeoPage : gabarit canonique des pages GEO (WEB-001B §11 complété)
 * =====================================================================
 * Rend les 15 sections DANS L'ORDRE CANONIQUE, chaque section omise si vide.
 * Tout est VISIBLE dans le DOM (jamais de cloaking, §13/§14). Les blocs LLM (§14)
 * sont matérialisés par ces sections + le JSON-LD Schema.org émis par la page.
 *
 * Composant présentiel pur : reçoit un GeoPageContent déjà projeté (lib/content),
 * n'invente rien. La MISE EN FORME (emphase inline, listes composed-of, état du
 * CTA) est une propriété du COMPOSANT, appliquée par règle déterministe — jamais
 * une décision manuelle page par page. Registre OBJET : navy dominant, or réservé.
 * =====================================================================
 */
import { Fragment } from 'react';
import Link from 'next/link';
import type { GeoPageContent, Span, Block } from '@/lib/content/geo';

/** Rend des segments inline : texte échappé, italique de la source → <em>. */
function Inline({ spans }: { spans: Span[] }) {
  return (
    <>
      {spans.map((s, i) => (s.em ? <em key={i}>{s.text}</em> : <Fragment key={i}>{s.text}</Fragment>))}
    </>
  );
}

/** Rend de la prose : paragraphes + éventuelles listes (règle composed-of). */
function Prose({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) =>
        b.kind === 'ul' ? (
          <div key={i} className={i ? 'mt-4' : undefined}>
            <p className="leading-relaxed"><Inline spans={b.lead} /></p>
            <ul className="mt-3 space-y-2">
              {b.items.map((it, j) => (
                <li key={j} className="flex gap-2">
                  <span className="text-navy-500">—</span>
                  <span><Inline spans={it} /></span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p key={i} className={`leading-relaxed${i ? ' mt-4' : ''}`}><Inline spans={b.spans} /></p>
        ),
      )}
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12 border-t border-navy-800 pt-8">
      <h2 className="font-interface text-micro uppercase tracking-[0.14em] text-navy-400">{title}</h2>
      <div className="mt-3 font-interface text-body text-navy-200">{children}</div>
    </section>
  );
}

export function GeoPage({ content }: { content: GeoPageContent }) {
  const c = content;
  return (
    <main className="min-h-screen bg-navy-950 px-6 py-breathe-xl text-navy-100">
      <article className="mx-auto max-w-[820px]">
        {/* Fil d'ariane (le JSON-LD BreadcrumbList est émis par la page). */}
        <nav aria-label="Breadcrumb" className="font-interface text-body-sm text-navy-400">
          <Link href="/en" className="hover:text-navy-200">Opus X</Link>
          <span className="mx-2">/</span>
          <span className="text-navy-300">{c.title}</span>
        </nav>

        {/* H1 */}
        <h1 className="mt-6 font-institutional text-h1 font-semibold leading-tight text-navy-50 md:text-display">
          {c.title}
        </h1>

        {/* Réponse directe (40-80 mots) */}
        {c.directAnswer.length ? (
          <p className="mt-6 font-institutional text-body-lg leading-relaxed text-navy-100"><Inline spans={c.directAnswer} /></p>
        ) : null}

        {/* Définition canonique */}
        {c.definition.length ? (
          <Section title="Canonical Definition">
            <p className="font-institutional text-body-lg text-navy-100"><Inline spans={c.definition} /></p>
          </Section>
        ) : null}

        {/* Key Facts (bloc LLM) */}
        {c.keyFacts.length ? (
          <Section title="Key Facts">
            <ul className="space-y-2">
              {c.keyFacts.map((f, i) => (
                <li key={i} className="flex gap-2"><span className="text-navy-500">—</span><span><Inline spans={f} /></span></li>
              ))}
            </ul>
          </Section>
        ) : null}

        {/* Pourquoi cela existe */}
        {c.whyExists.length ? (
          <Section title="Why It Exists"><Prose blocks={c.whyExists} /></Section>
        ) : null}

        {/* Comment cela fonctionne */}
        {c.howItWorks.length ? (
          <Section title="How It Works"><Prose blocks={c.howItWorks} /></Section>
        ) : null}

        {/* Acteurs */}
        {c.actors.length ? (
          <Section title="Actors"><Prose blocks={c.actors} /></Section>
        ) : null}

        {/* Cycle de vie */}
        {c.lifecycle.length ? (
          <Section title="Lifecycle">
            <ol className="space-y-2">
              {c.lifecycle.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-engraved text-body-sm text-navy-500">{String(i + 1).padStart(2, '0')}</span>
                  <span><Inline spans={step} /></span>
                </li>
              ))}
            </ol>
          </Section>
        ) : null}

        {/* Exemple */}
        {c.examples.length ? (
          <Section title="Examples">
            <ul className="space-y-2">{c.examples.map((e, i) => <li key={i} className="flex gap-2"><span className="text-navy-500">·</span><span><Inline spans={e} /></span></li>)}</ul>
          </Section>
        ) : null}

        {/* Non-exemple */}
        {c.nonExamples.length ? (
          <Section title="Counter Examples">
            <ul className="space-y-2">{c.nonExamples.map((e, i) => <li key={i} className="flex gap-2"><span className="text-navy-500">×</span><span><Inline spans={e} /></span></li>)}</ul>
          </Section>
        ) : null}

        {/* Distinctions */}
        {c.distinctions.length ? (
          <Section title="Distinctions"><Prose blocks={c.distinctions} /></Section>
        ) : null}

        {/* FAQ (le JSON-LD FAQPage est émis par la page) */}
        {c.faq.length ? (
          <Section title="FAQ">
            <dl className="space-y-4">
              {c.faq.map((qa, i) => (
                <div key={i}>
                  <dt className="font-institutional text-body font-semibold text-navy-100"><Inline spans={qa.q} /></dt>
                  <dd className="mt-1 text-navy-300"><Inline spans={qa.a} /></dd>
                </div>
              ))}
            </dl>
          </Section>
        ) : null}

        {/* Liens entités — href résolu par entityHref (source unique). Une entité
             sans page pilier publiée reste du TEXTE BRUT, jamais un lien /api/. */}
        {c.entityLinks.length ? (
          <Section title="Related Entities">
            <ul className="flex flex-wrap gap-2">
              {c.entityLinks.map((e) => (
                <li key={e.id}>
                  {e.href ? (
                    // LIÉ : pastille pleine, cliquable, hover affordant.
                    <a href={e.href} className="rounded-control border border-navy-700 bg-navy-900/60 px-3 py-1 font-engraved text-body-sm text-navy-200 transition-colors hover:border-navy-500 hover:text-navy-100">{e.label}</a>
                  ) : (
                    // NON LIÉ : pastille fantôme atténuée — sans fond, sans hover,
                    // cursor par défaut (aucune page pilier publiée pour cette entité).
                    <span className="cursor-default rounded-control border border-navy-800/60 px-3 py-1 font-engraved text-body-sm text-navy-500">{e.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {/* Sources normatives */}
        {c.sources.length ? (
          <Section title="Normative Sources">
            <p className="font-engraved text-body-sm leading-relaxed text-navy-300">{c.sources.join(' · ')}</p>
          </Section>
        ) : null}

        {/* CTA (éditorial/UI) — libellé GRAVÉ par pilier (pillars.ctaLabel). Absent →
             bloc NON rendu (aucun libellé inventé), trou tracé dans _gaps.
             `enabled` (flag lib/seo/flags) bascule lien actif / libellé inerte. */}
        {c.cta.label ? (
          <div className="mt-12 border-t border-navy-800 pt-8">
            {c.cta.enabled ? (
              <a href={c.cta.href} className="inline-flex items-center gap-2 rounded-control border border-navy-600 bg-navy-800 px-4 py-2 font-interface text-body text-navy-100 hover:border-navy-400">
                {c.cta.label} →
              </a>
            ) : (
              <span aria-disabled="true" className="inline-flex cursor-default items-center gap-2 rounded-control border border-navy-800 bg-navy-900/40 px-4 py-2 font-interface text-body text-navy-500">
                {c.cta.label}
              </span>
            )}
          </div>
        ) : null}

        {/* Date / Auteur / Version (Source of Truth, bloc LLM) */}
        <footer className="mt-10 font-engraved text-body-sm text-navy-500">
          {c.recordId} · v{c.meta.version} · {c.meta.status} · {c.meta.author} · {c.meta.date}
        </footer>
      </article>
    </main>
  );
}
