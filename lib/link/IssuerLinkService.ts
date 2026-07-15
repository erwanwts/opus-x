/**
 * =====================================================================
 * Opus X — Sprint 2 — LOT O2a : service de LIAISON D'IDENTITÉ (côté Opus X).
 * =====================================================================
 * Orchestre l'octroi et la révocation du consentement d'émission. Le sujet
 * n'est JAMAIS passé ici : les RPC le dérivent de la session (current_opus_id).
 * Le jeton est généré et hashé côté serveur ; seul le hash part en base ; le
 * clair est renvoyé UNE fois (destiné à l'Issuer, jamais persisté).
 * =====================================================================
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  generateExchangeCode,
  hashLinkToken,
  LINK_CONSENT_VERSION,
  LINK_CODE_TTL_SECONDS,
} from './issuerAuthToken';

export interface AuthorizeResult {
  // AUCUN jeton ici. Jamais. Un CODE d'échange, sans pouvoir propre, à échanger
  // par l'Issuer (canal arrière HMAC) contre le jeton.
  code: string;
  expires_in: number;
}

export class IssuerLinkService {
  constructor(private readonly supabase: SupabaseClient) {}

  /**
   * Octroi : valide le redirect_uri enregistré (en base), enregistre le
   * consentement 'grant', émet un CODE d'échange. Renvoie le code — que le
   * endpoint place dans une REDIRECTION 302, jamais dans un JSON.
   */
  async authorize(issuerId: string, redirectUri: string): Promise<AuthorizeResult> {
    const code = generateExchangeCode();
    const codeHash = hashLinkToken(code);

    const { error } = await this.supabase.rpc('wsp_authorize_issuer', {
      p_issuer_id: issuerId,
      p_consent_text_version: LINK_CONSENT_VERSION,
      p_code_hash: codeHash,
      p_redirect_uri: redirectUri,
      p_ttl_seconds: LINK_CODE_TTL_SECONDS,
    });
    if (error) throw error;

    return { code, expires_in: LINK_CODE_TTL_SECONDS };
  }

  /** Révocation : insère un fait 'revoke'. Le jeton devient inerte automatiquement. */
  async revoke(issuerId: string): Promise<{ state: 'revoked' }> {
    const { error } = await this.supabase.rpc('wsp_revoke_issuer', {
      p_issuer_id: issuerId,
      p_consent_text_version: LINK_CONSENT_VERSION,
    });
    if (error) throw error;
    return { state: 'revoked' };
  }
}
