/**
 * =====================================================================
 * Opus X — DashboardService  (LOT 9 · agrégat de l'écran 6)
 * =====================================================================
 * Sources d'autorité : spec figée §3.7 (DashboardService), §4.4 (forme de
 * l'agrégat /me/dashboard), §5.5 (états zéro véridiques).
 *
 * Un seul appel côté serveur, sous RLS (le client ne lit que SES lignes,
 * §3.6). L'agrégat suit la forme EXACTE de §4.4 :
 *   { passport, trust_status, skills_status, evidence_status }
 * — AUCUN Frameworks (Décision 2). État vide VÉRIDIQUE : données réelles,
 * valeurs nulles/0 réelles, jamais de fausses données.
 *
 * `passport.opus_id` provient du profil (l'opus_id vit sur `profiles`, §3.3),
 * découplé du `handle` (adresse publique).
 *
 * Chaque « status » est nullable : si sa lecture échoue, le module concerné
 * affiche un état de reprise ISOLÉ (§12.4) sans casser le reste de la surface.
 * =====================================================================
 */
import type { SupabaseClient } from '@supabase/supabase-js';

export interface DashboardProfile {
  opus_id: string;
  full_name: string | null;
}

export interface DashboardPassport {
  opus_id: string;
  handle: string;
  visibility: string;
  lifecycle_stage: string;
  issued_at: string;
}

export interface TrustStatus {
  state: string;
  score: number | null;
}

export interface SkillsStatus {
  state: 'empty' | 'active';
  count: number;
  verified_count: number;
}

export interface EvidenceStatus {
  state: 'empty' | 'active';
  count: number;
}

export interface DashboardData {
  profile: DashboardProfile;
  passport: DashboardPassport;
  /** null → le module Trust Status affiche un état de reprise isolé (§12.4). */
  trust_status: TrustStatus | null;
  skills_status: SkillsStatus | null;
  evidence_status: EvidenceStatus | null;
}

export class DashboardService {
  constructor(private readonly supabase: SupabaseClient) {}

  /**
   * Retourne l'agrégat du Dashboard, ou `null` si l'identité n'est pas
   * (encore) complètement émise — auquel cas l'appelant renvoie l'utilisateur
   * vers la cérémonie pour finaliser (V3), plutôt que d'afficher un Dashboard
   * incohérent.
   */
  async getDashboard(): Promise<DashboardData | null> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    if (!user) return null;

    // Profil + Passport : essentiels. Absents → émission incomplète.
    const [{ data: profile }, { data: passport }] = await Promise.all([
      this.supabase
        .from('profiles')
        .select('opus_id, full_name')
        .eq('id', user.id)
        .maybeSingle(),
      this.supabase
        .from('passports')
        .select('id, handle, visibility, lifecycle_stage, issued_at')
        .eq('profile_id', user.id)
        .maybeSingle(),
    ]);

    if (!profile || !passport) return null;

    // Les 3 status, indépendamment : un échec isolé n'invalide pas les autres.
    const [trust_status, skills_status, evidence_status] = await Promise.all([
      this.readTrustStatus(passport.id as string),
      this.readSkillsStatus(passport.id as string),
      this.readEvidenceStatus(passport.id as string),
    ]);

    return {
      profile: {
        opus_id: profile.opus_id as string,
        full_name: (profile.full_name as string | null) ?? null,
      },
      passport: {
        // §4.4 — l'opus_id de l'agrégat vient du profil (identité canonique).
        opus_id: profile.opus_id as string,
        handle: passport.handle as string,
        visibility: passport.visibility as string,
        lifecycle_stage: passport.lifecycle_stage as string,
        issued_at: passport.issued_at as string,
      },
      trust_status,
      skills_status,
      evidence_status,
    };
  }

  private async readTrustStatus(passportId: string): Promise<TrustStatus | null> {
    const { data, error } = await this.supabase
      .from('trust_index')
      .select('state, score')
      .eq('passport_id', passportId)
      .maybeSingle();

    if (error) return null;
    // §5.5 — état qualitatif « Establishing », score NULL. Jamais un 0/100.
    return {
      state: (data?.state as string | undefined) ?? 'establishing',
      score: (data?.score as number | null | undefined) ?? null,
    };
  }

  private async readSkillsStatus(passportId: string): Promise<SkillsStatus | null> {
    const [all, verified] = await Promise.all([
      this.supabase
        .from('skills')
        .select('id', { count: 'exact', head: true })
        .eq('passport_id', passportId),
      this.supabase
        .from('skills')
        .select('id', { count: 'exact', head: true })
        .eq('passport_id', passportId)
        .eq('verified', true),
    ]);

    if (all.error || verified.error) return null;

    const count = all.count ?? 0;
    return {
      state: count === 0 ? 'empty' : 'active',
      count,
      verified_count: verified.count ?? 0,
    };
  }

  private async readEvidenceStatus(passportId: string): Promise<EvidenceStatus | null> {
    const { count, error } = await this.supabase
      .from('evidence')
      .select('id', { count: 'exact', head: true })
      .eq('passport_id', passportId);

    if (error) return null;

    const c = count ?? 0;
    return { state: c === 0 ? 'empty' : 'active', count: c };
  }
}
