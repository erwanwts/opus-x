/**
 * =====================================================================
 * Opus X — CHAÎNES VERROUILLÉES  (module UNIQUE — source de vérité)
 * =====================================================================
 *
 * Source d'autorité : opus-x-sprint-1.md (Révision Finale, figée).
 *
 * ⚠️ CES CHAÎNES SONT VERBATIM. Elles ne sont ni traduites, ni reformulées,
 *    ni "améliorées". Un test d'égalité stricte les protège (voir le test
 *    passport.strings.test.ts). Toute modification est un changement de
 *    décision produit — donc soumise à l'architecte.
 *
 * RÈGLE DE LOCALISATION (verrouillée — Décision 1)
 * ------------------------------------------------
 * Le Passport est un DOCUMENT UNIVERSEL, indépendant de la langue de l'UI.
 *
 *   • EN ANGLAIS (voix institutionnelle, intemporelle) — tout ce qui relève
 *     de l'OBJET Passport : séquence d'émission, phrase de vision, libellés
 *     des statuts, étapes du cycle de vie, Opus ID, futurs certificats.
 *     → Identiques quelle que soit la langue de l'utilisateur.
 *
 *   • LOCALISÉ (langue de l'utilisateur) — toute l'INTERFACE FONCTIONNELLE :
 *     navigation, boutons, aide, paramètres, messages système, formulaires.
 *     → Ces chaînes-là vivent dans lib/i18n/, PAS ici.
 *
 *   • CAS FRONTIÈRE — l'écran d'entrée : le TITRE reste en anglais
 *     (headline narratif de l'identité) ; les champs, le CTA et l'aide
 *     autour sont localisés.
 *
 * LEXIQUE VERROUILLÉ
 * ------------------
 *   ✅ ÉMETTRE / ÉMIS un Passport      ❌ « créer un Passport / un compte »
 *   ✅ ÉTABLIR / FORGER son identité   ❌ « s'inscrire », « créer un profil »
 *   ✅ GÉNÉRER l'Opus ID
 *   ✅ un ACTIF officiel, un OBJET     ❌ « une card », « une fiche »
 *   ✅ Trust / Skills / Evidence STATUS ❌ « Trust Index » (interne uniquement)
 * =====================================================================
 */

// ---------------------------------------------------------------------
// LA SÉQUENCE D'ÉMISSION — la forge (Écran 5)
// Jouée automatiquement, ligne par ligne. Le Passport est FORGÉ sous les
// yeux de l'utilisateur — jamais un objet qui apparaît brutalement.
//
// ⚠️ V3 : la ligne 4 (`Identity Successfully Established`) n'apparaît
//    QU'APRÈS confirmation serveur d'une émission atomique et complète
//    (finalize_emission() → complete: true).
// ---------------------------------------------------------------------
export const EMISSION_SEQUENCE = [
  'Establishing Professional Identity…',
  'Generating Opus ID…',
  'Issuing Professional Passport…',
  'Identity Successfully Established',
] as const;

/** L'index de la ligne finale — celle qui est gardée par le signal serveur (V3). */
export const EMISSION_FINAL_LINE_INDEX = 3;

/** La ligne finale, isolée : elle ne s'affiche JAMAIS sans complete: true. */
export const EMISSION_FINAL_LINE = EMISSION_SEQUENCE[EMISSION_FINAL_LINE_INDEX];

// ---------------------------------------------------------------------
// LA PHRASE DE VISION (Décision 5)
// Délivrée juste après le scellement. Elle raconte POURQUOI cet objet
// existe et qu'il accompagnera toute la carrière.
// ---------------------------------------------------------------------
export const VISION_STATEMENT =
  'From this moment on, every verified achievement you earn can become part of your professional identity.';

// ---------------------------------------------------------------------
// LE TITRE DE L'ÉCRAN D'ENTRÉE (cas frontière : titre EN, reste localisé)
// ---------------------------------------------------------------------
export const ESTABLISH_IDENTITY_TITLE = 'Establish Your Professional Identity';

// ---------------------------------------------------------------------
// LES LIBELLÉS DE STATUTS (registre OBJET — jamais traduits)
// « Trust Index » / « Skills Index » sont des termes INTERNES : ils ne
// paraissent jamais dans l'UI.
// ---------------------------------------------------------------------
export const STATUS_LABELS = {
  trust: 'Trust Status',
  skills: 'Skills Status',
  evidence: 'Evidence Status',
} as const;

/** État qualitatif du Trust Status sur un Passport neuf — JAMAIS un 0/100. */
export const TRUST_STATE_LABELS = {
  establishing: 'Establishing',
  emerging: 'Emerging',
  established: 'Established',
} as const;

// ---------------------------------------------------------------------
// LE PASSPORT PUBLIC — libellés de la page publique /p/{handle}
//
// Registre OBJET (EN institutionnel, jamais localisé — Décision 1) : la voix
// du Passport public vit ICI, en UN SEUL endroit. Aucun de ces libellés n'est
// codé en dur dans le composant de rendu (règle transverse WEB-003 Lot 1).
//
// ⚠️ trust : le moteur Trust n'existe pas encore (capacité protocolaire
//    PLANIFIÉE — doctrine G1). On ne montre JAMAIS de valeur simulée ni de
//    statut calculé ; on énonce sobrement que la vérification Trust est
//    planifiée. Jamais une faiblesse du professionnel, jamais un score.
// ---------------------------------------------------------------------
export const PUBLIC_PASSPORT_STRINGS = {
  /** L'objet lui-même (vocabulaire canonique verrouillé). */
  object: 'Professional Passport',
  /** Bloc 3 — vérification (sobre ; l'OR n'apparaît QUE si verified===true). */
  verified: 'Verified',
  notVerified: 'Not yet verified',
  /** Bloc 4 — Skills Status vide : sobre, « yet », jamais un échec. */
  skillsEmpty: 'No skills recorded yet',
  /** Bloc 5 — Evidence publique vide. */
  evidenceEmpty: 'No public evidence recorded yet',
  /** Bloc 6 — Trust Status : moteur absent → capacité planifiée, NON calculée. */
  trustNotComputed: 'Not yet computed',
  trustPlannedNote: 'Trust verification is a planned protocol capability.',
  /** Bloc 8 — propriété & garde (le professionnel possède ; Opus X garde & vérifie). */
  ownershipCustody:
    'This Professional Passport belongs to the professional. Opus X holds it in custody and verifies it according to the rules of the World Skills Protocol.',
} as const;

// ---------------------------------------------------------------------
// LE CYCLE DE VIE DU PASSPORT — les 7 étapes canoniques (Décision 3)
//
// Le Passport n'est jamais statique : il porte une timeline de progression
// qui raconte une carrière. Les étapes futures sont présentées comme une
// TRAJECTOIRE DÉSIRABLE, jamais comme des cases vides.
//
// ⚠️ Terminologie officielle : l'étape 1 est « Identity Established »
//    (et NON « Identity Created »). Le vocabulaire « Create » est
//    définitivement abandonné dans tout Opus X.
// ---------------------------------------------------------------------
export const LIFECYCLE_STAGES = [
  { key: 'identity_established', label: 'Identity Established', order: 1 },
  { key: 'receiving_evidence', label: 'Receiving Evidence', order: 2 },
  { key: 'skills_emerging', label: 'Skills Emerging', order: 3 },
  { key: 'trust_established', label: 'Trust Established', order: 4 },
  { key: 'passport_verified', label: 'Professional Passport Verified', order: 5 },
  { key: 'trusted_professional', label: 'Trusted Professional', order: 6 },
  { key: 'authority', label: 'Authority', order: 7 },
] as const;

export type LifecycleStageKey = (typeof LIFECYCLE_STAGES)[number]['key'];

/** L'étape atteinte à l'émission — la seule active en Sprint 1. */
export const INITIAL_LIFECYCLE_STAGE: LifecycleStageKey = 'identity_established';

/** Le libellé institutionnel d'une étape (EN, jamais localisé). */
export function lifecycleLabel(key: LifecycleStageKey): string {
  const stage = LIFECYCLE_STAGES.find((s) => s.key === key);
  if (!stage) {
    throw new Error(`Étape de cycle de vie inconnue : ${key}`);
  }
  return stage.label;
}

// ---------------------------------------------------------------------
// L'OPUS ID — l'identité canonique permanente
// ---------------------------------------------------------------------
/** Format : opx_ + ULID (26 car., base32 Crockford). */
export const OPUS_ID_PATTERN = /^opx_[0-9A-HJKMNP-TV-Z]{26}$/;

export function isValidOpusId(value: string): boolean {
  return OPUS_ID_PATTERN.test(value);
}

// ---------------------------------------------------------------------
// LES CONSENTEMENTS — version documentaire ET date d'entrée en vigueur
//
// Décision architecte : les DEUX informations sont conservées.
//   • version        → référence documentaire précise (jamais réutilisée)
//   • effectiveDate  → traçabilité juridique / RGPD
//
// ⚠️ Toute modification d'un texte juridique entraîne une NOUVELLE version
//    ET une NOUVELLE date d'entrée en vigueur. Ces valeurs doivent rester
//    synchronisées avec consent_default_version() /
//    consent_default_effective_date() en base.
// ---------------------------------------------------------------------
export const LEGAL_DOCUMENTS = {
  version: 'v1.0.0',
  effectiveDate: '2026-07-11',
} as const;

export type ConsentType = 'terms' | 'privacy' | 'partner_ingestion' | 'public_share';

export interface ConsentRecord {
  type: ConsentType;
  granted: boolean;
  version: string;
  effective_date: string;
}

/**
 * Les consentements recueillis à l'établissement de l'identité (Sprint 1).
 * Cases NON pré-cochées : l'acceptation est explicite (§5.4).
 *
 * V2 — Ces consentements sont transportés dans les métadonnées de signup
 * (options.data) pour être journalisés par l'émission côté serveur.
 */
export function buildEstablishmentConsents(accepted: {
  terms: boolean;
  privacy: boolean;
}): ConsentRecord[] {
  return [
    {
      type: 'terms',
      granted: accepted.terms,
      version: LEGAL_DOCUMENTS.version,
      effective_date: LEGAL_DOCUMENTS.effectiveDate,
    },
    {
      type: 'privacy',
      granted: accepted.privacy,
      version: LEGAL_DOCUMENTS.version,
      effective_date: LEGAL_DOCUMENTS.effectiveDate,
    },
  ];
}
