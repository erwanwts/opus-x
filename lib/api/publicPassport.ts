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

/** Les seules clés qu'un Passport public peut exposer. */
export const PUBLIC_PASSPORT_WHITELIST = [
  'display_name',
  'headline',
  'lifecycle_stage',
  'issued_at',
  'verified',
  'trust_status',
  'skills_status',
  'evidence',
] as const;

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
  trust_status: string; // niveau qualitatif (jamais un score)
  skills_status: string; // niveau qualitatif
  evidence: PublicEvidenceInput[];
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
  trust_status: string;
  skills_status: string;
  evidence: PublicEvidence[];
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
    trust_status: input.trust_status,
    skills_status: input.skills_status,
    evidence: input.evidence.map(buildPublicEvidence),
  };
}
