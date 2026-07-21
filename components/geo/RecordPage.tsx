/**
 * =====================================================================
 * Opus X — RecordPage : rendu d'une PROJECTION DOCUMENTAIRE
 * =====================================================================
 * Rend un RecordPageContent déjà projeté. Composant présentiel PUR : il ne
 * parse rien, ne dérive rien, ne décide rien.
 *
 * ⚠️ JAMAIS `dangerouslySetInnerHTML`. Chaque bloc devient un élément React
 * construit depuis du TEXTE, que React échappe. C'est ce qui fait survivre les
 * 73 pseudo-balises du corpus — `<opus_id>`, `<level>`, `<jcs-digest>` — qu'un
 * rendu à passthrough HTML ferait disparaître SANS ERREUR.
 *
 * RD-009 — « Une projection peut organiser, relier, présenter et agréger des
 * informations ; elle ne peut jamais établir un fait […]. » D'où le bandeau de
 * statut AVANT le titre : le lecteur doit savoir où il arrive avant de lire.
 * =====================================================================
 */
import { Fragment } from 'react';
import Link from 'next/link';
import type { MdBlock, MdSpan } from '@/lib/registry/markdown';
import type { RecordPageContent } from '@/lib/registry/recordPage';
import { RECORDS_ROOT } from '@/lib/registry/recordPage';

/** Segments inline. Texte échappé par React — aucun HTML n'est interprété. */
function Inline({ spans }: { spans: MdSpan[] }) {
  return (
    <>
      {spans.map((s, i) => {
        if (s.code) return <code key={i} className="rounded bg-navy-900 px-1 font-engraved text-body-sm text-navy-200">{s.text}</code>;
        if (s.strong && s.em) return <strong key={i}><em>{s.text}</em></strong>;
        if (s.strong) return <strong key={i} className="font-semibold text-navy-100">{s.text}</strong>;
        if (s.em) return <em key={i}>{s.text}</em>;
        return <Fragment key={i}>{s.text}</Fragment>;
      })}
    </>
  );
}

/** Un bloc du corps canonique. L'ordre et le contenu viennent du Record, jamais d'ici. */
function Block({ block }: { block: MdBlock }) {
  switch (block.kind) {
    case 'heading': {
      const cls =
        block.level <= 2
          ? 'mt-10 font-institutional text-h3 font-semibold text-navy-50'
          : 'mt-6 font-institutional text-body font-semibold text-navy-100';
      return block.level <= 2 ? <h2 className={cls}><Inline spans={block.spans} /></h2> : <h3 className={cls}><Inline spans={block.spans} /></h3>;
    }
    case 'p':
      return <p className="mt-4 leading-relaxed"><Inline spans={block.spans} /></p>;
    case 'quote':
      return (
        <blockquote className="mt-4 border-l-2 border-navy-700 pl-4 text-navy-300">
          <Inline spans={block.spans} />
        </blockquote>
      );
    case 'ul':
      return (
        <ul className="mt-3 space-y-2">
          {block.items.map((it, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-navy-500">—</span>
              <span><Inline spans={it} /></span>
            </li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol className="mt-3 space-y-2">
          {block.items.map((it, i) => (
            <li key={i} className="flex gap-2">
              <span className="font-engraved text-navy-500">{i + 1}.</span>
              <span><Inline spans={it} /></span>
            </li>
          ))}
        </ol>
      );
    case 'table':
      return (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-body-sm">
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="border-b border-navy-800">
                  {row.map((cell, j) => (
                    <td key={j} className="py-2 pr-4 align-top text-navy-200"><Inline spans={cell} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'code':
      // Contenu LITTÉRAL, à l'octet près. `{children}` : React échappe — les
      // pseudo-balises du bloc ressortent telles quelles.
      return (
        <pre className="mt-4 overflow-x-auto rounded-control bg-navy-900 p-4 font-engraved text-body-sm text-navy-200">
          <code>{block.text}</code>
        </pre>
      );
    case 'hr':
      return <hr className="mt-8 border-navy-800" />;
  }
}

/**
 * Bandeau de statut — DÉRIVÉ du statut documentaire, exactement comme `robots`.
 * Le jour d'une promotion, il DISPARAÎT sans intervention : aucune liste de
 * Records à tenir, aucun drapeau à basculer.
 */
export function StatusBanner({ status }: { status: string }) {
  if (status.trim().toLowerCase() !== 'draft') return null;
  return (
    <aside className="rounded-control border border-navy-700 bg-navy-900/60 px-4 py-3">
      <p className="font-interface text-micro uppercase tracking-[0.14em] text-navy-400">
        STATUS — {status}
      </p>
      <p className="mt-2 font-interface text-body-sm leading-relaxed text-navy-300">
        This Record is published as part of the Canonical Corpus but has not yet been formally
        validated.
      </p>
    </aside>
  );
}

export function RecordPage({ content }: { content: RecordPageContent }) {
  const c = content;
  return (
    <main className="min-h-screen bg-navy-950 px-6 py-breathe-xl text-navy-100">
      <article className="mx-auto max-w-[820px]">
        <nav aria-label="Breadcrumb" className="font-interface text-body-sm text-navy-400">
          <Link href="/en" className="hover:text-navy-200">Opus X</Link>
          <span className="mx-2">/</span>
          <Link href={RECORDS_ROOT} className="hover:text-navy-200">Records</Link>
          <span className="mx-2">/</span>
          <span className="text-navy-300">{c.id}</span>
        </nav>

        {/* Le bandeau PRÉCÈDE le titre : le lecteur sait où il arrive avant de lire. */}
        <div className="mt-6">
          <StatusBanner status={c.status} />
        </div>

        <p className="mt-8 font-engraved text-body-sm text-navy-400">{c.id}</p>
        <h1 className="mt-1 font-institutional text-h1 font-semibold leading-tight text-navy-50 md:text-display">
          {c.label}
        </h1>

        {/* Métadonnées documentaires — servies telles quelles, aucune interprétée. */}
        <section className="mt-8 border-t border-navy-800 pt-6">
          <h2 className="font-interface text-micro uppercase tracking-[0.14em] text-navy-400">
            Document metadata
          </h2>
          <dl className="mt-3 grid gap-x-6 gap-y-2 font-interface text-body-sm md:grid-cols-[220px_1fr]">
            {Object.entries(c.fields).map(([k, v]) => (
              <Fragment key={k}>
                <dt className="text-navy-400">{k}</dt>
                <dd className="text-navy-200">{v}</dd>
              </Fragment>
            ))}
          </dl>
        </section>

        {/* Corps canonique — projeté, jamais rédigé. */}
        <section className="mt-10 border-t border-navy-800 pt-6 font-interface text-body text-navy-200">
          {c.blocks.map((b, i) => (
            <Block key={i} block={b} />
          ))}
        </section>

        {/* Nature de la page — une projection ne fait pas autorité (RD-009). */}
        <footer className="mt-12 border-t border-navy-800 pt-6 font-engraved text-body-sm text-navy-500">
          This page is a documentary projection derived from the Canonical Corpus. It is not an
          independent normative publication and does not constitute an authoritative representation.
          The Record itself remains the source.
        </footer>
      </article>
    </main>
  );
}
