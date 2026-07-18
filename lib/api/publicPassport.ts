/**
 * =====================================================================
 * Opus X — Whitelist du Passport PUBLIC  (LOT 8 · §5.3)
 * =====================================================================
 * Divulgation progressive, opt-in. Le Passport est PRIVÉ PAR DÉFAUT ; ceci
 * décrit le socle montré QUAND il devient public.
 *
 * En Sprint 1, AUCUNE donnée n'est publique (l'endpoint renvoie 404). Cette
 * whitelist est posée et testée pour SÉCURISER l'endpoint public dès sa
 * conception — le jour où le partage s'ouvrira, seuls ces champs sortiront.
 *
 * SOCLE PUBLIC MINIMAL (§5.3) : nom d'affichage, headline, étape de cycle de
 * vie, statut de vérification, niveaux qualitatifs Trust/Skills, et les
 * Evidence que le pro choisit d'exposer.
 *
 * JAMAIS PUBLIC : email, contacts, payload brut des Evidence, tout champ non
 * whitelisté. La construction est EXPLICITE (aucun spread de l'objet interne)
 * pour rendre toute fuite structurellement impossible.
 * =====================================================================
 */

/**
 * Les seules clés qu'un Passport public peut exposer.
 *
 * ⚠️ ÉCART ASSUMÉ AVEC LE SOCLE §5.3 — `skills` (WEB-003 Lot 5, 2026-07-17)
 * ------------------------------------------------------------------------
 * §5.3 énumère « niveaux qualitatifs Trust/Skills, et les Evidence » : Skills y
 * est un SCALAIRE (`skills_status`), pas une liste. Publier `skills[]` ÉTEND le
 * socle. Décision prise par le SUPERVISEUR (arbitrage A) ; `docs/` (WEB-001B
 * §5.3) n'a PAS été modifié — un document gelé ne se corrige pas depuis le code.
 * L'AMENDEMENT NORMATIF DE §5.3 RESTE DÛ : tant qu'il n'est pas écrit, ce
 * tableau et le socle documentaire divergent SCIEMMENT.
 *
 * Atténuation (arbitrage de forme) : une Skill publique ne porte QUE `name`.
 * Ni `level` (texte libre côté display ; côté WSP il n'existe que
 * `claimed_level` — le claim de l'Issuer, jamais le niveau interprété du
 * Passport (D6) — et la zone d'interprétation O3/O4 n'existe pas), ni
 * `verified` (aucun équivalent WSP — W3). Publier un niveau autoritaire
 * pré-engagerait une couche non construite : ce serait le cul-de-sac de GAP-3.
 */
export const PUBLIC_PASSPORT_WHITELIST = [
  'display_name',
  'headline',
  'lifecycle_stage',
  'issued_at',
  'verified',
  'is_demo',
  'trust_status',
  'skills_status',
  'skills',
  'evidence',
] as const;

/**
 * Les seules clés qu'une Skill publique peut exposer.
 * `level`, `verified`, `evidence_count`, `framework_id` restent INTERNES.
 */
export const PUBLIC_SKILL_WHITELIST = ['name'] as const;

/** Les seules clés qu'une Evidence publique peut exposer (jamais le payload). */
export const PUBLIC_EVIDENCE_WHITELIST = [
  'type',
  'title',
  'verified',
  'issued_at',
  'issuer',
] as const;

/** Champs internes qui ne doivent JAMAIS apparaître dans une réponse publique. */
export const NEVER_PUBLIC = [
  'email',
  'opus_id',
  'profile_id',
  'payload',
  'description',
  'ip',
  'user_agent',
  'avatar_url',
  'locale',
] as const;

export interface PublicSkillInput {
  name: string;
  // Champs internes potentiellement présents — volontairement ignorés :
  level?: string | null;
  verified?: boolean;
  evidence_count?: number;
  framework_id?: string | null;
}

export interface PublicEvidenceInput {
  type: string;
  title: string;
  verified: boolean;
  issued_at: string | null;
  issuer?: string | null;
  // Champs internes potentiellement présents — volontairement ignorés :
  payload?: unknown;
  description?: string | null;
}

export interface PublicPassportInput {
  display_name: string | null;
  headline: string | null;
  lifecycle_stage: string;
  issued_at: string | null; // date d'ÉMISSION (divulguée publiquement — Lot 4)
  verified: boolean;
  is_demo: boolean; // VITRINE de démonstration — contenu FICTIF (Lot 5)
  trust_status: string; // niveau qualitatif (jamais un score)
  skills_status: string; // niveau qualitatif
  skills: PublicSkillInput[];
  evidence: PublicEvidenceInput[];
}

export interface PublicSkill {
  name: string;
}

export interface PublicEvidence {
  type: string;
  title: string;
  verified: boolean;
  issued_at: string | null;
  issuer: string | null;
}

export interface PublicPassport {
  display_name: string | null;
  headline: string | null;
  lifecycle_stage: string;
  issued_at: string | null;
  verified: boolean;
  /**
   * `true` ⇒ VITRINE DE DÉMONSTRATION : nom, date, Skills, Evidence et
   * vérification sont FICTIFS. Non-optionnel À DESSEIN — le compilateur force
   * toute surface publique à recevoir le marqueur, plutôt que de le laisser
   * s'oublier par omission.
   */
  is_demo: boolean;
  trust_status: string;
  skills_status: string;
  skills: PublicSkill[];
  evidence: PublicEvidence[];
}

/** N'émet QUE `name` — ni level, ni verified, ni evidence_count. */
export function buildPublicSkill(s: PublicSkillInput): PublicSkill {
  return { name: s.name };
}

/** N'émet QUE les champs whitelistés — construction explicite, jamais un spread. */
export function buildPublicEvidence(e: PublicEvidenceInput): PublicEvidence {
  return {
    type: e.type,
    title: e.title,
    verified: e.verified,
    issued_at: e.issued_at ?? null,
    issuer: e.issuer ?? null,
  };
}

/** Construit la vue publique d'un Passport à partir des seuls champs autorisés. */
export function buildPublicPassport(input: PublicPassportInput): PublicPassport {
  return {
    display_name: input.display_name,
    headline: input.headline,
    lifecycle_stage: input.lifecycle_stage,
    issued_at: input.issued_at ?? null,
    verified: input.verified,
    is_demo: input.is_demo,
    trust_status: input.trust_status,
    skills_status: input.skills_status,
    skills: input.skills.map(buildPublicSkill),
    evidence: input.evidence.map(buildPublicEvidence),
  };
}
