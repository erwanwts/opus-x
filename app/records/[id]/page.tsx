/** Page Record — `/records/{id}`, projection documentaire du Canonical Corpus. */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { RecordPage } from '@/components/geo/RecordPage';
import { buildRecordPage } from '@/lib/registry/recordPage';
import { JsonLd, organizationLd, breadcrumbLd } from '@/lib/seo/jsonld';

export const dynamic = 'force-static';
export const dynamicParams = false;

const DIR = path.join(process.cwd(), 'docs/web/registry-import/OCR-100');
const files = () => readdirSync(DIR).filter((f) => f.endsWith('.md')).sort();
const byId = (id: string) => {
  const f = files().find((x) => x.toLowerCase().startsWith(id.toLowerCase() + '_'));
  return f ? buildRecordPage(readFileSync(path.join(DIR, f), 'utf8')) : null;
};

export function generateStaticParams() {
  return files().map((f) => ({ id: f.split('_')[0].toLowerCase() }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const c = byId(id);
  if (!c) return {};
  return {
    title: { absolute: c.meta.title },
    ...(c.meta.description ? { description: c.meta.description } : {}),
    alternates: { canonical: c.meta.canonical },
    robots: c.meta.robots,
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = byId(id);
  if (!c) notFound();
  return (
    <>
      <JsonLd
        blocks={[
          organizationLd(),
          breadcrumbLd([
            { name: 'Opus X', url: 'https://opusx.world/en' },
            { name: 'Records', url: 'https://opusx.world/records' },
            { name: c.id, url: c.meta.canonical },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': c.meta.jsonLdType,
            headline: `${c.id} — ${c.label}`,
            ...(c.meta.description ? { description: c.meta.description } : {}),
            url: c.meta.canonical,
            inLanguage: 'en',
            version: c.version,
          },
        ]}
      />
      <RecordPage content={c} />
    </>
  );
}
