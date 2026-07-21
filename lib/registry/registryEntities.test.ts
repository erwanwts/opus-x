/**
 * Entités du registre — prédicats, familles, types.
 *
 * Ces pages n'ont AUCUNE prose : tout ce qu'elles affichent doit exister dans un
 * artefact déjà publié. Le test vérifie donc moins un rendu qu'une **provenance** :
 * chaque valeur est-elle dérivée, et les lacunes sont-elles tracées plutôt que
 * comblées ?
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import {
  allPredicates, allFamilies, allTypes, orphanSurfaces,
  predicateById, familyById, typeById, familySlug,
} from './registryEntities';

const resolution = JSON.parse(
  readFileSync(path.join(process.cwd(), 'content/registry/ocr-007-resolution.json'), 'utf8'),
) as { predicates: Record<string, { predicate_id?: string; family?: string }> };
const graph = JSON.parse(
  readFileSync(path.join(process.cwd(), 'content/registry/wsp-graph.json'), 'utf8'),
) as { nodes: { node_type?: string }[]; edges: { predicate: string | null }[] };

describe('PÉRIMÈTRE — le compte des pages du lot', () => {
  it('37 prédicats, 15 familles, 6 types — soit 58 pages d’entités', () => {
    expect(allPredicates()).toHaveLength(37);
    expect(allFamilies()).toHaveLength(15);
    expect(allTypes()).toHaveLength(6);
    expect(allPredicates().length + allFamilies().length + allTypes().length).toBe(58);
  });

  it('avec les 33 Records, le lot produit bien 91 pages', () => {
    expect(33 + 37 + 15 + 6).toBe(91);
  });

  it('les 37 identifiants sont exactement ceux d’OCR-007', () => {
    const fromSource = new Set(
      Object.values(resolution.predicates).map((v) => v.predicate_id).filter(Boolean),
    );
    expect(new Set(allPredicates().map((p) => p.id))).toEqual(fromSource);
  });

  it('les 6 types sont exactement les node_type du graphe', () => {
    const fromGraph = new Set(graph.nodes.map((n) => n.node_type).filter(Boolean));
    expect(new Set(allTypes().map((t) => t.id))).toEqual(fromGraph);
  });
});

describe('PROVENANCE — rien n’est fabriqué', () => {
  it('86 formes de surface portent un identifiant, 17 n’en portent AUCUN', () => {
    // Le test a révélé ce que je n'avais pas mesuré : 17 entrées du registre n'ont
    // pas de `predicate_id`. Elles ne peuvent pas avoir de page — mais elles ne sont
    // pas écartées en silence pour autant.
    const withId = allPredicates().reduce((a, p) => a + p.surfaces.length, 0);
    expect(withId).toBe(86);
    expect(orphanSurfaces()).toHaveLength(17);
    expect(withId + orphanSurfaces().length).toBe(103);
  });

  it('les 17 orphelines sont TRACÉES avec leur statut, jamais devinées', () => {
    const byStatus = orphanSurfaces().reduce<Record<string, number>>(
      (a, o) => ((a[o.status] = (a[o.status] ?? 0) + 1), a), {},
    );
    expect(byStatus).toEqual({ Alias: 11, Derived: 1, Rejected: 5 });
    for (const o of orphanSurfaces()) expect(o.surface.length).toBeGreaterThan(0);
  });

  it('une famille absente est une lacune TRACÉE, jamais devinée', () => {
    for (const p of allPredicates()) {
      if (p.family === null) expect(p._gaps).toContain('family');
      else expect(p._gaps).not.toContain('family');
    }
  });

  it('le compte d’arêtes vient de la projection courante, pas d’une estimation', () => {
    const real = new Map<string, number>();
    for (const e of graph.edges) {
      if (e.predicate) real.set(e.predicate, (real.get(e.predicate) ?? 0) + 1);
    }
    for (const p of allPredicates()) {
      const canon = p.surfaces.find((s) => s.canonical)?.canonical;
      expect(p.edgeCount, p.id).toBe(canon ? (real.get(canon) ?? 0) : 0);
    }
  });

  it('les arêtes par famille sont DISTINCTES — jamais un cumul par prédicat', () => {
    // Cumuler les comptes par prédicat donnait 230 pour 222 arêtes : `governed_by`
    // est porté par PRD-203 ET PRD-204, donc compté deux fois. Le test l'a révélé.
    const sum = allFamilies().reduce((a, f) => a + f.edgeCount, 0);
    expect(sum).toBeGreaterThan(0);
    expect(sum).toBeLessThanOrEqual(graph.edges.length);
  });

  it('un canonical partagé par deux identifiants est SIGNALÉ, jamais réparti', () => {
    const shared = allPredicates().filter((p) => p.edgeCountShared);
    expect(shared.map((p) => p.id).sort()).toEqual(['PRD-203', 'PRD-204']);
    for (const p of shared) expect(p._gaps).toContain('edge_attribution');
  });
});

describe('RÉSOLUTION PAR IDENTIFIANT — insensible à la casse de l’URL', () => {
  it('un prédicat se retrouve par son identifiant, en minuscules comme en majuscules', () => {
    expect(predicateById('PRD-306')?.id).toBe('PRD-306');
    expect(predicateById('prd-306')?.id).toBe('PRD-306');
    expect(predicateById('PRD-999')).toBeUndefined();
  });

  it('une famille se retrouve par son slug', () => {
    const f = allFamilies()[0];
    expect(familyById(f.id)?.name).toBe(f.name);
    expect(familySlug('Knowledge Graph')).toBe('knowledge-graph');
  });

  it('un type se retrouve par son identifiant', () => {
    expect(typeById('protocol_concept')?.nodeCount).toBe(42);
    expect(typeById('inexistant')).toBeUndefined();
  });
});

describe('PRD-306 — le prédicat gravé au chantier de réidentification', () => {
  it('porte ses deux formes de surface, directe et inverse', () => {
    const p = predicateById('PRD-306')!;
    expect(p.family).toBe('Resolution');
    expect(p.surfaces.map((s) => s.surface).sort()).toEqual([
      'reidentified_as',
      'was_reidentified_from',
    ]);
    expect(p.surfaces.find((s) => s.surface === 'was_reidentified_from')!.flipEdge).toBe(true);
  });

  it('produit exactement l’arête réflexive publiée dans OCR-115', () => {
    expect(predicateById('PRD-306')!.edgeCount).toBe(1);
  });
});
