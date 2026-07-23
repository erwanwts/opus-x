/**
 * GARDE D'INVENTAIRE — les décisions candidates D-006 portent UN SEUL motif.
 *
 * Pourquoi ce test existe. La 2e réédition d'ARCHITECTURE-V3 a d'abord inscrit les
 * décisions candidates sous DEUX motifs : le token `[DÉCISION CANDIDATE — D-006,
 * à rendre]` (11 items C) et une clause en prose « → décision candidate D-006 »
 * (5 items B). Un inventaire par un seul grep en trouvait alors un sous-ensemble —
 * exactement l'instrument qui perd des items. Le mécanisme de restitution de D-006
 * (« les affirmations qui méritent d'être gravées reviennent comme décisions à
 * rendre ») ne vaut que si on peut TOUTES les énumérer d'un geste.
 *
 * Ce test est cette garantie. Il n'assère pas un compte de tête : il vérifie que
 * toute mention de « candidate » dans le document passe par le token unique. Le
 * jour où quelqu'un ajoute une décision candidate sans connaître la convention —
 * en prose, ou avec un autre libellé contenant « candidate » — le test échoue.
 *
 * Portée honnête : il attrape toute variante utilisant le mot « candidate ». Une
 * décision candidate marquée avec un mot entièrement différent lui échapperait —
 * mais elle échapperait aussi à l'intention de l'auteur, et rien dans un document
 * Markdown ne dit quelle affirmation DEVRAIT être candidate. Ce reliquat n'est pas
 * testable simplement ; il n'est pas forcé ici.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const F = path.join(process.cwd(), 'docs/architecture/OPUS-X-ARCHITECTURE-V3.md');
const TOKEN = '[DÉCISION CANDIDATE — D-006, à rendre]';

describe('Inventaire des décisions candidates — motif unique (D-006)', () => {
  it('toute mention de « candidate » passe par le token — un seul grep les inventorie tous', () => {
    const lines = readFileSync(F, 'utf8').split(/\r?\n/);
    const offenders = lines
      .map((l, i) => ({ l, line: i + 1 }))
      .filter(({ l }) => /candidate/i.test(l) && !l.includes(TOKEN))
      .map((o) => o.line);
    // Un item portant « candidate » sans le token échappe à l'inventaire d'un seul
    // grep. Le test le nomme par sa ligne au lieu de dire seulement « faux ».
    expect(offenders).toEqual([]);
  });

  it('le token inventorie 17 candidates + 1 exemple de la règle = 18 (compte figé)', () => {
    const doc = readFileSync(F, 'utf8');
    // Compte gelé : toute addition/retrait de candidate doit le mettre à jour —
    // c'est le tripwire qui force la revue de l'inventaire. Passé de 17 à 18 le
    // 2026-07-22 : L230 (empreinte) reclassé de retrait simple en candidate.
    expect(doc.split(TOKEN).length - 1).toBe(18);
  });
});
