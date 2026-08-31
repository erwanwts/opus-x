/**
 * =====================================================================
 * Garde de parité STAGING ↔ DÉPÔT — la DÉCISION pure (D-037).
 * =====================================================================
 * Une base de test qui diverge du code testé peut faire passer pour verts
 * des tests qui seraient rouges — c'est une faille de confiance dans le
 * harnais lui-même. Cette garde la referme, par la VÉRITÉ-TERRAIN : elle ne
 * lit NI le ledger de migrations (prouvé non fiable dès qu'on applique du SQL
 * à la main), NI le souvenir humain — elle vérifie ce que la base FAIT.
 *
 * Ce module est PUR (aucun effet de bord, aucun client) pour être
 * unit-testable. La collecte des sondes vit dans `../integration/parityGuard.ts`.
 *
 * CONTRAT D'EXTENSION : quand une migration dont dépend la campagne
 * d'intégration atterrit, on ajoute ici UNE sentinelle — l'objet le plus
 * récent qu'elle introduit — et on la sonde dans `parityGuard.ts`. La garde
 * est un ÉCHANTILLON curé (les objets dont les tests dépendent), pas un diff
 * de schéma complet ; c'est le compromis assumé du choix « vérité-terrain ».
 * =====================================================================
 */

/** État observé de chaque invariant de vérité-terrain. */
export interface ParityProbes {
  /** `wsp_resolve_subject_passport` existe (pont, palier 1). */
  bridgeResolveFn: 'present' | 'absent';
  /** `public_passport_view` expose `issued_at` (Lot 4). */
  publicViewIssuedAt: 'present' | 'absent';
  /** L'anon ne peut PAS lire `passports` en brut (durcissement Lot 3). */
  anonPassportsRaw: 'denied' | 'readable';
}

interface Sentinel {
  key: keyof ParityProbes;
  expected: ParityProbes[keyof ParityProbes];
  migration: string;
  what: string;
}

/**
 * Les sentinelles — une par migration dont la campagne d'intégration dépend.
 * Chacune est un fait de VÉRITÉ-TERRAIN, pas une ligne de ledger.
 */
export const SENTINELS: readonly Sentinel[] = [
  {
    key: 'bridgeResolveFn',
    expected: 'present',
    migration: '20260831000001_wsp_passport_bridge',
    what: 'fonction wsp_resolve_subject_passport (le pont)',
  },
  {
    key: 'publicViewIssuedAt',
    expected: 'present',
    migration: '20260717000002_public_passport_view_issued_at',
    what: 'colonne public_passport_view.issued_at',
  },
  {
    key: 'anonPassportsRaw',
    expected: 'denied',
    migration: '20260717000001_public_passport_view',
    what: 'lecture brute anon de passports REFUSÉE (durcissement Point B)',
  },
];

/**
 * Décision pure : renvoie un message de dérive si le staging ne reflète pas
 * le dépôt, sinon `null`. Aucune E/S — pour prouver le REFUS par mutation.
 */
export function parityViolation(probes: ParityProbes): string | null {
  const missing = SENTINELS.filter((s) => probes[s.key] !== s.expected);
  if (missing.length === 0) return null;

  const lines = missing.map(
    (s) => `  • ${s.what} (migration ${s.migration}) — attendu « ${s.expected} », vu « ${probes[s.key]} »`,
  );
  return [
    'DÉRIVE STAGING ↔ DÉPÔT — la base de staging ne reflète PAS le dépôt.',
    "Des objets dont dépend la campagne d'intégration sont absents ou incohérents :",
    ...lines,
    'Un test vert ne prouverait rien dans cet état.',
    'CORRIGE AVANT de lancer la campagne — staging UNIQUEMENT, jamais la prod :',
    '  supabase db push --linked',
    '(si une migration a été appliquée à la main, réconcilie le ledger : supabase migration repair).',
  ].join('\n');
}
