/**
 * =====================================================================
 * Opus X — Chargement des faits d'approbation (étape 6, interface de projection)
 * =====================================================================
 * `loadFacts()` lit les faits d'approbation/révocation des deux lieux :
 *   • `content/registry/founding/` — l'acte fondateur `RATIF-*` ;
 *   • `content/registry/promo/`    — les promotions ordinaires `PROMO-*` (aucune à ce jour).
 * Il alimente `resolveStatus` (D-016, voie 2). I/O borné, mémoïsé une fois par process.
 * Ne lit AUCUN champ `Status` : le statut se dérive du seul jeu de faits.
 * =====================================================================
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import type { ApprovalFact } from './resolveStatus';

const FACT_KINDS = new Set(['founding-ratification', 'promotion', 'revocation']);
const DIRS = ['content/registry/founding', 'content/registry/promo'];

let _facts: ApprovalFact[] | null = null;

/** Tous les faits d'approbation/révocation, des deux lieux. Mémoïsé. */
export function loadFacts(): ApprovalFact[] {
  if (_facts) return _facts;
  const out: ApprovalFact[] = [];
  for (const rel of DIRS) {
    const dir = path.join(process.cwd(), rel);
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir).filter((n) => n.endsWith('.json'))) {
      let parsed: unknown;
      try {
        parsed = JSON.parse(readFileSync(path.join(dir, f), 'utf8'));
      } catch {
        continue; // un JSON illisible n'est pas un fait — ignoré
      }
      const fact = parsed as ApprovalFact;
      // Seuls les FAITS (kind reconnu) comptent ; les manifestes/schémas du lieu sont ignorés.
      if (fact && typeof fact.kind === 'string' && FACT_KINDS.has(fact.kind)) out.push(fact);
    }
  }
  _facts = out;
  return out;
}
