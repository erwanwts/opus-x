/** Entité du registre — projection dérivée d'un artefact publié. Aucune prose. */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RegistryEntityPage } from '@/components/geo/RegistryEntityPage';
import { buildFamilyPage } from '@/lib/registry/registryEntityPage';
import { allFamilies, familyById } from '@/lib/registry/registryEntities';
import { JsonLd, organizationLd, breadcrumbLd, webPageLd } from '@/lib/seo/jsonld';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return allFamilies().map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const e = familyById(id);
  if (!e) return {};
  const c = buildFamilyPage(e);
  return {
    title: { absolute: c.meta.title },
    description: c.meta.description,
    alternates: { canonical: c.meta.canonical },
    robots: c.meta.robots,
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const e = familyById(id);
  if (!e) notFound();
  const c = buildFamilyPage(e);
  return (
    <>
      <JsonLd
        blocks={[
          organizationLd(),
          breadcrumbLd([
            { name: 'Opus X', url: 'https://opusx.world/en' },
            { name: 'Records', url: 'https://opusx.world/records' },
            { name: c.heading, url: c.meta.canonical },
          ]),
          webPageLd({ name: c.meta.title, description: c.meta.description, url: c.meta.canonical }),
        ]}
      />
      <RegistryEntityPage content={c} />
    </>
  );
}
