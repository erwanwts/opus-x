/**
 * =====================================================================
 * Opus X — AuthService  (LOT 5)
 * =====================================================================
 * Source d'autorité : opus-x-sprint-1.md §3.2, §3.7 — package Lot 5.
 *
 * VOCABULAIRE VERROUILLÉ : on ÉTABLIT une identité. On n'« inscrit » ni ne
 * « crée un compte ». Les noms de méthodes le reflètent.
 *
 * VIGILANCES CÂBLÉES ICI :
 *   V1 — La vérification email est RÉELLE. Aucune émission tant que
 *        email_confirmed_at est nul : la garde est en base (trigger), et
 *        rien ici ne peut la contourner.
 *   V2 — Les consentements recueillis AVANT l'existence du profil sont
 *        transportés dans options.data (métadonnées de signup) : ils
 *        voyagent avec l'enregistrement auth et sont journalisés par
 *        l'émission côté serveur, idempotemment.
 * =====================================================================
 */

import type { SupabaseClient, Session, User } from '@supabase/supabase-js';
import {
  buildEstablishmentConsents,
  type ConsentRecord,
} from '@/lib/constants/passport.strings';

// ---------------------------------------------------------------------
// Contrat d'établissement d'identité
// ---------------------------------------------------------------------
export interface EstablishIdentityInput {
  email: string;
  fullName: string;
  locale?: string;
  /** Cases NON pré-cochées — l'acceptation est explicite (§5.4). */
  consents: {
    terms: boolean;
    privacy: boolean;
  };
}

/**
 * Les métadonnées transportées au signup (V2).
 * Elles sont lues côté serveur par issue_passport() lors de l'émission.
 */
export interface SignupMetadata {
  full_name: string;
  locale: string;
  consents: ConsentRecord[];
}

export type EmissionStatus = {
  complete: boolean;
  reason?: 'email_not_verified' | 'not_issued';
  opus_id?: string;
  handle?: string;
  lifecycle_stage?: string;
  issued_at?: string;
  trust_state?: string;
  checks?: {
    profile: boolean;
    passport: boolean;
    trust_index: boolean;
    consents: boolean;
  };
};

/** Cooldown anti-spam entre deux envois de lien (secondes). */
export const RESEND_COOLDOWN_SECONDS = 60;

export class AuthService {
  constructor(private readonly supabase: SupabaseClient) {}

  // -------------------------------------------------------------------
  // ÉTABLIR L'IDENTITÉ — magic link par défaut (V2)
  //
  // Les consentements sont transportés dans options.data : ils EXISTENT
  // avant le profil, et doivent survivre au trajet jusqu'à l'émission.
  // -------------------------------------------------------------------
  async establishIdentity(input: EstablishIdentityInput): Promise<{ error?: string }> {
    // Garde produit : les consentements requis sont explicites.
    if (!input.consents.terms || !input.consents.privacy) {
      return { error: 'consents_required' };
    }

    const metadata: SignupMetadata = {
      full_name: input.fullName.trim(),
      locale: input.locale ?? 'fr',
      // V2 — version documentaire ET date d'entrée en vigueur, toutes deux.
      consents: buildEstablishmentConsents(input.consents),
    };

    const { error } = await this.supabase.auth.signInWithOtp({
      email: input.email.trim().toLowerCase(),
      options: {
        // Le magic link établit l'identité ET la vérifie en un geste.
        shouldCreateUser: true,
        data: metadata as unknown as Record<string, unknown>,
        emailRedirectTo: `${this.appOrigin()}/emission`,
      },
    });

    if (error) {
      // Aucune énumération d'email : on ne révèle jamais si l'adresse existe.
      return { error: 'establishment_failed' };
    }

    return {};
  }

  // -------------------------------------------------------------------
  // RENVOYER LE LIEN — avec cooldown anti-spam
  // -------------------------------------------------------------------
  async resendLink(email: string, metadata?: SignupMetadata): Promise<{ error?: string }> {
    const { error } = await this.supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        shouldCreateUser: true,
        // Les consentements re-voyagent : un renvoi ne doit pas les perdre (V2).
        data: metadata as unknown as Record<string, unknown> | undefined,
        emailRedirectTo: `${this.appOrigin()}/emission`,
      },
    });

    return error ? { error: 'resend_failed' } : {};
  }

  // -------------------------------------------------------------------
  // CONNEXION par mot de passe (option secondaire)
  // -------------------------------------------------------------------
  async signInWithPassword(email: string, password: string): Promise<{ error?: string }> {
    const { error } = await this.supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      // Message UNIQUE quelle que soit la cause : aucune énumération d'email.
      // (Un « email inconnu » distinct d'un « mot de passe erroné » fuiterait
      //  l'existence des comptes.)
      return { error: 'invalid_credentials' };
    }

    return {};
  }

  // -------------------------------------------------------------------
  // V1 — La vérification est-elle RÉELLE ?
  //
  // On lit email_confirmed_at, jamais un drapeau local. C'est la même
  // condition que la garde du trigger d'émission en base.
  // -------------------------------------------------------------------
  async isEmailVerified(): Promise<boolean> {
    const { data } = await this.supabase.auth.getUser();
    return Boolean(data.user?.email_confirmed_at);
  }

  async getSession(): Promise<Session | null> {
    const { data } = await this.supabase.auth.getSession();
    return data.session;
  }

  async getUser(): Promise<User | null> {
    const { data } = await this.supabase.auth.getUser();
    return data.user;
  }

  async signOut(): Promise<void> {
    await this.supabase.auth.signOut();
  }

  // -------------------------------------------------------------------
  // REPRISE MULTI-APPAREILS
  //
  // Si le lien est cliqué sur un AUTRE appareil, l'onglet d'origine doit
  // détecter la confirmation et AVANCER SEUL vers la cérémonie.
  //
  // Deux mécanismes, en ceinture et bretelles :
  //   1. onAuthStateChange — instantané si la session arrive dans cet onglet.
  //   2. polling doux — filet si l'événement n'atteint pas cet onglet.
  // -------------------------------------------------------------------
  watchForVerification(
    onVerified: () => void,
    options: { pollIntervalMs?: number } = {}
  ): () => void {
    const pollIntervalMs = options.pollIntervalMs ?? 3000;
    let stopped = false;

    const finish = () => {
      if (stopped) return;
      stopped = true;
      cleanup();
      onVerified();
    };

    const { data: sub } = this.supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user?.email_confirmed_at) {
        finish();
      }
    });

    const timer = setInterval(async () => {
      if (stopped) return;
      if (await this.isEmailVerified()) {
        finish();
      }
    }, pollIntervalMs);

    const cleanup = () => {
      sub.subscription.unsubscribe();
      clearInterval(timer);
    };

    return () => {
      stopped = true;
      cleanup();
    };
  }

  // -------------------------------------------------------------------
  // V3 — LE SIGNAL SERVEUR D'ÉMISSION COMPLÈTE
  //
  // Appelé par la cérémonie (écran 5). La ligne finale
  // « Identity Successfully Established » n'apparaît QUE si complete=true.
  //
  // La RPC est idempotente : elle rattrape une émission incomplète et
  // vérifie les 4 écritures. Un double-clic ou un retry n'émet jamais
  // deux Passports.
  // -------------------------------------------------------------------
  async finalizeEmission(): Promise<EmissionStatus> {
    const { data, error } = await this.supabase.rpc('finalize_emission');

    if (error) {
      return { complete: false, reason: 'not_issued' };
    }

    return data as EmissionStatus;
  }

  /**
   * Attend le signal serveur, avec retry automatique en tâche de fond.
   * La forge TIENT jusqu'à résolution : on ne montre jamais un Passport
   * « à moitié émis », et on ne casse jamais le moment par une erreur brutale.
   */
  async awaitEmission(
    options: { maxAttempts?: number; intervalMs?: number } = {}
  ): Promise<EmissionStatus> {
    const maxAttempts = options.maxAttempts ?? 20;
    const intervalMs = options.intervalMs ?? 1500;

    let last: EmissionStatus = { complete: false, reason: 'not_issued' };

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      last = await this.finalizeEmission();
      if (last.complete) return last;
      await new Promise((r) => setTimeout(r, intervalMs));
    }

    return last;
  }

  private appOrigin(): string {
    return (
      process.env.NEXT_PUBLIC_APP_URL ??
      (typeof window !== 'undefined' ? window.location.origin : '')
    );
  }
}
