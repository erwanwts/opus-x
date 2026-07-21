/**
 * =====================================================================
 * Opus X — RegistryEntityPage : prédicats, familles, types, index
 * =====================================================================
 * Composant présentiel PUR. Il ne dérive rien, ne décide rien, n'invente aucun
 * libellé : tout ce qu'il affiche vient d'un artefact déjà publié (OCR-007 ou la
 * projection du graphe).
 *
 * RD-009 — cette page organise, relie et présente. Elle n'établit rien, et le dit
 * dans son pied de page.
 * =====================================================================
 */
import { Fragment } from 'react';
import Link from 'next/link';
import type { RegistryEntityContent } from '@/lib/registry/registryEntityPage';
import { RECORDS_ROOT } from '@/lib/registry/registryEntityPage';

export function RegistryEntityPage({ content }: { content: RegistryEntityContent }) {
  const c = content;
  const isIndex = c.kind === 'index';
  return (
    <main className="min-h-screen bg-navy-950 px-6 py-breathe-xl text-navy-100">
      <article className="mx-auto max-w-[820px]">
        <nav aria-label="Breadcrumb" className="font-interface text-body-sm text-navy-400">
          <Link href="/en" className="hover:text-navy-200">Opus X</Link>
          {!isIndex ? (
            <>
              <span className="mx-2">/</span>
              <Link href={RECORDS_ROOT} className="hover:text-navy-200">Records</Link>
            </>
          ) : null}
          <span className="mx-2">/</span>
          <span className="text-navy-300">{isIndex ? 'Records' : c.id}</span>
        </nav>

        <h1 className="mt-8 font-institutional text-h1 font-semibold leading-tight text-navy-50 md:text-display">
          {c.heading}
        </h1>
        <p className="mt-4 font-institutional text-body-lg leading-relaxed text-navy-200">{c.subtitle}</p>

        <section className="mt-10 border-t border-navy-800 pt-6">
          <h2 className="font-interface text-micro uppercase tracking-[0.14em] text-navy-400">
            {isIndex ? 'Corpus at a glance' : 'Registry entry'}
          </h2>
          <dl className="mt-3 grid gap-x-6 gap-y-2 font-interface text-body-sm md:grid-cols-[280px_1fr]">
            {c.fields.map((f) => (
              <Fragment key={f.label}>
                <dt className="text-navy-400">{f.label}</dt>
                <dd className="text-navy-200">{f.value}</dd>
              </Fragment>
            ))}
          </dl>
        </section>

        {c.tables.map((t) => (
          <section key={t.caption} className="mt-10 border-t border-navy-800 pt-6">
            <h2 className="font-interface text-micro uppercase tracking-[0.14em] text-navy-400">
              {t.caption}
            </h2>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full border-collapse font-interface text-body-sm">
                <thead>
                  <tr className="border-b border-navy-700">
                    {t.head.map((h) => (
                      <th key={h} className="py-2 pr-4 text-left font-normal text-navy-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {t.rows.map((row, i) => (
                    <tr key={i} className="border-b border-navy-800">
                      {row.map((cell, j) => (
                        <td key={j} className="py-2 pr-4 align-top text-navy-200">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}

        {c.links.length ? (
          <section className="mt-10 border-t border-navy-800 pt-6">
            <h2 className="font-interface text-micro uppercase tracking-[0.14em] text-navy-400">
              {isIndex ? 'Browse the corpus' : 'Related entries'}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {c.links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-control border border-navy-700 px-3 py-1 font-engraved text-body-sm text-navy-300 hover:border-navy-400 hover:text-navy-100"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <footer className="mt-12 border-t border-navy-800 pt-6 font-engraved text-body-sm text-navy-500">
          This page is a documentary projection derived from the Canonical Corpus. It is not an
          independent normative publication and does not constitute an authoritative representation.
          The Records themselves remain the source.
        </footer>
      </article>
    </main>
  );
}
