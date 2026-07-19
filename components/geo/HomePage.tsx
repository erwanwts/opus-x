/**
 * =====================================================================
 * Opus X — HomePage : archétype institutionnel (PAS le gabarit fiche concept)
 * =====================================================================
 * 7 sections propres à la Homepage (Hero · Why · Four Foundations · Ecosystem ·
 * Reading Paths · Explore the Resources · Final CTA). Prose VERBATIM (lib/content),
 * rien n'est rendu de plus (les notes/arbitrages du doc ne sont pas du contenu).
 * Registre institutionnel : navy dominant, or absent. Reading Paths : liens résolus
 * par pillarHrefBySlug (activation auto par PILLARS) ; page absente = texte brut.
 * =====================================================================
 */
import { Fragment } from 'react';
import type { HomepageContent, ReadingPathLink } from '@/lib/content/homepage';

/** Rend un texte de Reading Path en liant les pages nommées (ordre d'apparition). */
function linkify(text: string, links: ReadingPathLink[]) {
  const out: React.ReactNode[] = [];
  let rest = text;
  let k = 0;
  for (const { name, href } of links) {
    const i = rest.indexOf(name);
    if (i < 0) continue; // introuvable → on laisse le texte tel quel
    if (i > 0) out.push(<Fragment key={k++}>{rest.slice(0, i)}</Fragment>);
    out.push(
      href ? (
        <a key={k++} href={href} className="text-navy-100 underline decoration-navy-600 underline-offset-4 transition-colors hover:decoration-navy-300">{name}</a>
      ) : (
        // Page non publiée → TEXTE BRUT (jamais un lien mort). S'activera dès son
        // entrée dans PILLARS, sans retouche.
        <span key={k++}>{name}</span>
      ),
    );
    rest = rest.slice(i + name.length);
  }
  out.push(<Fragment key={k++}>{rest}</Fragment>);
  return out;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-institutional text-h2 font-semibold text-navy-50">{children}</h2>;
}

export function HomePage({ content: c }: { content: HomepageContent }) {
  return (
    <main className="min-h-screen bg-navy-950 text-navy-100">
      <div className="mx-auto max-w-[900px] px-6">
        {/* ── 1 · HERO ── */}
        <section className="py-breathe-xl">
          <h1 className="font-institutional text-h1 font-semibold leading-tight text-navy-50 md:text-display">
            {c.hero.h1}
          </h1>
          <p className="mt-8 max-w-[720px] font-institutional text-body-lg leading-relaxed text-navy-200">
            {c.hero.valueProp}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href={c.hero.ctaPrimary.href} className="inline-flex items-center rounded-control bg-navy-50 px-6 py-3 font-institutional text-body font-semibold text-navy-900 transition-colors hover:bg-navy-100">
              {c.hero.ctaPrimary.label}
            </a>
            <a href={c.hero.ctaSecondary.href} className="inline-flex items-center rounded-control border border-navy-600 px-6 py-3 font-interface text-body text-navy-100 transition-colors hover:border-navy-400">
              {c.hero.ctaSecondary.label}
            </a>
          </div>
        </section>

        {/* ── 2 · WHY OPUS X EXISTS ── */}
        <section className="border-t border-navy-800 py-breathe-lg">
          <SectionTitle>Why Opus X Exists</SectionTitle>
          <div className="mt-6 space-y-5 font-interface text-body leading-relaxed text-navy-200">
            {c.whyExists.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </section>

        {/* ── 3 · THE FOUR FOUNDATIONS (ancre #platform) ── */}
        <section id="platform" className="scroll-mt-24 border-t border-navy-800 py-breathe-lg">
          <SectionTitle>The Four Foundations of Opus X</SectionTitle>
          <p className="mt-6 font-interface text-body leading-relaxed text-navy-200">{c.foundationsIntro}</p>
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            {c.foundations.map((f) => (
              <div key={f.name} className="rounded-object border border-navy-800 p-6">
                <h3 className="font-institutional text-h3 font-medium text-navy-100">{f.name}</h3>
                <div className="mt-3 space-y-3 font-interface text-body-sm leading-relaxed text-navy-300">
                  {f.body.map((p, i) => <p key={i}>{p}</p>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4 · HOW THE ECOSYSTEM WORKS ── */}
        <section className="border-t border-navy-800 py-breathe-lg">
          <SectionTitle>How the Ecosystem Works</SectionTitle>
          <div className="mt-6 space-y-5 font-interface text-body leading-relaxed text-navy-200">
            {c.ecosystem.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </section>

        {/* ── 5 · READING PATHS ── */}
        <section className="border-t border-navy-800 py-breathe-lg">
          <SectionTitle>Reading Paths</SectionTitle>
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            {c.readingPaths.map((rp) => (
              <div key={rp.audience}>
                <h3 className="font-interface text-micro uppercase tracking-[0.14em] text-navy-400">{rp.audience}</h3>
                <p className="mt-3 font-interface text-body leading-relaxed text-navy-200">
                  {linkify(rp.text, rp.links)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 6 · EXPLORE THE RESOURCES (liens piliers projetés) ── */}
        <section className="border-t border-navy-800 py-breathe-lg">
          <SectionTitle>Explore the Resources</SectionTitle>
          <p className="mt-6 font-interface text-body leading-relaxed text-navy-200">{c.resourcesIntro}</p>
          <ul className="mt-8 flex flex-wrap gap-3">
            {c.resources.map((r) => (
              <li key={r.title}>
                {r.href ? (
                  <a href={r.href} className="inline-flex rounded-control border border-navy-700 bg-navy-900/60 px-4 py-2 font-interface text-body-sm text-navy-100 transition-colors hover:border-navy-500">{r.title}</a>
                ) : (
                  <span className="inline-flex cursor-default rounded-control border border-navy-800/60 px-4 py-2 font-interface text-body-sm text-navy-500">{r.title}</span>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* ── 7 · FINAL CTA ── */}
        <section className="border-t border-navy-800 py-breathe-lg">
          <a href={c.finalCta.href} className="inline-flex items-center gap-2 rounded-control bg-navy-50 px-6 py-3 font-institutional text-body font-semibold text-navy-900 transition-colors hover:bg-navy-100">
            {c.finalCta.label} →
          </a>
        </section>

        {/* ── Signature éditoriale (archétype) — SANS Last Updated tant que Draft. ── */}
        <footer className="border-t border-navy-800 py-10 font-engraved text-body-sm text-navy-500">
          Content Version {c.signature.contentVersion} · Editorial Status {c.signature.editorialStatus} · Publisher {c.signature.publisher} · Language {c.signature.language}
        </footer>
      </div>
    </main>
  );
}
