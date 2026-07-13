/**
 * Transport local de l'établissement en cours (Écran 2 → Écran 4).
 *
 * V2 — Les consentements recueillis AVANT l'existence du profil doivent
 * survivre au trajet. Ils voyagent déjà dans les métadonnées de signup ;
 * on les conserve aussi localement pour qu'un RENVOI de lien (Écran 4) les
 * re-transporte à l'identique, sans jamais les perdre.
 *
 * sessionStorage (pas localStorage) : la donnée s'efface à la fermeture de
 * l'onglet — juste le temps de la vérification. Aucune donnée sensible autre
 * que l'email + les consentements déjà transmis à l'auth.
 */
import type { SignupMetadata } from './AuthService';

const KEY = 'opusx.pending_establishment';

export interface PendingEstablishment {
  email: string;
  metadata: SignupMetadata;
}

export function savePendingEstablishment(pending: PendingEstablishment): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(pending));
  } catch {
    // sessionStorage indisponible (mode privé strict) : le flux reste
    // fonctionnel, seul le pré-remplissage/renvoi enrichi est perdu.
  }
}

export function loadPendingEstablishment(): PendingEstablishment | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PendingEstablishment) : null;
  } catch {
    return null;
  }
}

export function clearPendingEstablishment(): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* no-op */
  }
}
