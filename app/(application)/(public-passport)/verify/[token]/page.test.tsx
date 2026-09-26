/**
 * T-B — /verify/{token} : la page tokenisée n'est JAMAIS indexée (noindex
 * inconditionnel). Falsifiable : un index:true casserait.
 */
import { describe, it, expect } from 'vitest';
import { generateMetadata } from './page';

describe('/verify/{token} — SEO', () => {
  it('noindex INCONDITIONNEL (capability privée, jamais découvrable)', async () => {
    const meta = await generateMetadata();
    expect(meta.robots).toEqual({ index: false, follow: false });
  });
});
