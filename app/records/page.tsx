/**
 * INDEX du Canonical Corpus — `/records`, sans préfixe de locale.
 *
 * ⚠️ Ce n'est PAS une page pilier. `/en/registry` est la fiche du CONCEPT de
 * registre canonique (OCR-124), avec sa prose gravée ; `/records` est l'INDEX du
 * corpus lui-même, projeté. Deux objets distincts, deux adresses distinctes.
 */
import type { Metadata } from 'next';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { RegistryEntityPage } from '@/components/geo/RegistryEntityPage';
import { buildRecordsIndex } from '@/lib/registry/registryEntityPage';
import { buildRecordPage } from '@/lib/registry/recordPage';
import { JsonLd, organizationLd, breadcrumbLd, webPageLd } from '@/lib/seo/jsonld';

export const dynamic = 'force-static';

const DIR = path.join(process.cwd(), 'docs/web/registry-import/OCR-100');

function records() {
  return readdirSync(DIR)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((f) => buildRecordPage(readFileSync(path.join(DIR, f), 'utf8'))!)
    .map((p) => ({ id: p.id, label: p.label, status: p.status }));
}

export function generateMetadata(): Metadata {
  const c = buildRecordsIndex(records());
  return {
    title: { absolute: c.meta.title },
    description: c.meta.description,
    alternates: { canonical: c.meta.canonical },
    robots: c.meta.robots,
  };
}

export default function Page() {
  const c = buildRecordsIndex(records());
  return (
    <>
      <JsonLd
        blocks={[
          organizationLd(),
          breadcrumbLd([
            { name: 'Opus X', url: 'https://opusx.world/en' },
            { name: 'Records', url: c.meta.canonical },
          ]),
          webPageLd({ name: c.meta.title, description: c.meta.description, url: c.meta.canonical }),
        ]}
      />
      <RegistryEntityPage content={c} />
    </>
  );
}
