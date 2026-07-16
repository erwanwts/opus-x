/**
 * =====================================================================
 * ÉCRAN 6 — DASHBOARD V1  (LOT 9)
 * =====================================================================
 * Sources d'autorité : spec figée §2 Écran 6, §4.4 ; PRODUCT-001 §10 (registres),
 * §11.1/11.6 (cards, navigation), §12 (principes dashboard), §9.1 (respiration).
 *
 * 4 MODULES, ET RIEN DE PLUS (Décision 2 — Frameworks retirés) :
 *   Professional Passport (dominant) · Trust Status · Skills Status · Evidence Status.
 *
 * Descente canonique (§12.1) : Overview → Detail → Evidence, jamais l'inverse.
 * Registre OUTIL : sobre, plat, bordures 1px graphite-300, aucune ombre (l'ombre
 * est réservée à l'objet). Le Dashboard RESPIRE (§9.1 : ≥48px entre blocs,
 * ≥64px entre surfaces primaires). États zéro « prêts, jamais ratés » (§12.5).
 * =====================================================================
 */
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardService } from '@/lib/dashboard/DashboardService';
import { STATUS_LABELS, TRUST_STATE_LABELS } from '@/lib/constants/passport.strings';
import { fr } from '@/lib/i18n/fr';
import { AccountMenu } from './AccountMenu';
import { PassportModule } from './PassportModule';
import { StatusCard, StatusDot } from './StatusCard';

const t = fr.dashboard;

export default async function DashboardPage() {
  const supabase = await createClient();
  const data = await new DashboardService(supabase).getDashboard();

  // Émission incomplète (V3) : on ne montre jamais un Dashboard incohérent —
  // on renvoie finaliser à la cérémonie (idempotente).
  if (!data) redirect('/emission');

  const firstName = data.profile.full_name?.trim().split(/\s+/)[0] ?? '';

  const evidenceCount = data.evidence_status?.count ?? 0;
  const evidenceLine = (evidenceCount === 1 ? t.evidenceCount : t.evidenceCountPlural).replace(
    '{count}',
    String(evidenceCount)
  );

  return (
    <div className="min-h-screen bg-paper-warm text-graphite-900">
      {/* ── Barre supérieure (§11.6) : 64px, paper, 1px bordure basse. Pas de sidebar. ── */}
      <header className="h-16 border-b border-graphite-300 bg-paper">
        <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-6">
          <span className="font-institutional text-body font-semibold tracking-[0.30em] text-graphite-900">
            OPUS X
          </span>
          <AccountMenu fullName={data.profile.full_name} opusId={data.profile.opus_id} />
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-6 py-breathe-lg">
        {/* En-tête d'accueil (§12) — voix institutionnelle, chaleureuse. */}
        <h1 className="font-institutional text-h2 font-semibold text-graphite-900">
          {t.welcome.replace('{firstName}', firstName)}
        </h1>

        {/* ── OVERVIEW — le Passport dominant (§12.1, §12.2). ≥48px sous le titre. ── */}
        <div className="mt-breathe max-w-[640px]">
          <PassportModule passport={data.passport} />
        </div>

        {/* ── DETAIL → EVIDENCE — les 3 status, subordonnés et égaux (§12.2).
             ≥64px sous la surface primaire (§9.1). Espacement généreux. ── */}
        <div className="mt-breathe-lg grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Trust Status — qualitatif « Establishing », JAMAIS un 0/100 (§5.5, §14.3). */}
          <StatusCard title={STATUS_LABELS.trust} errored={!data.trust_status}>
            <StatusDot color="var(--graphite-500)" label={TRUST_STATE_LABELS.establishing} />
            <p className="mt-3 font-interface text-body-sm text-graphite-500">{t.trustHint}</p>
          </StatusCard>

          {/* Skills Status — état vide pédagogique : « prêt », jamais « raté » (§12.5). */}
          <StatusCard title={STATUS_LABELS.skills} errored={!data.skills_status}>
            <p className="font-interface text-body text-graphite-700">{t.skillsEmpty}</p>
            <p className="mt-2 font-interface text-body-sm text-graphite-500">{t.skillsCaption}</p>
          </StatusCard>

          {/* Evidence Status — compteur 0 assumé & pédagogique (§5.5). */}
          <StatusCard title={STATUS_LABELS.evidence} errored={!data.evidence_status}>
            <p className="font-interface text-body-lg tabular-nums text-graphite-900">
              {evidenceLine}
            </p>
            <p className="mt-2 font-interface text-body-sm text-graphite-500">{t.evidenceEmpty}</p>
          </StatusCard>
        </div>
      </main>
    </div>
  );
}
