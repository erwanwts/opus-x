/**
 * =====================================================================
 * VUE PRIVÉE DU PASSPORT — /passport  (LOT 9 · l'action du Dashboard)
 * =====================================================================
 * Sources d'autorité : spec figée §2 Écran 6 (« Voir mon Passport »), §3.9
 * ((app) → Dashboard + vue Passport privée) ; PRODUCT-001 §10/§13.
 *
 * Le Passport EN GRAND, registre OBJET, plein écran — SANS cérémonie (la forge
 * ne se joue qu'une fois, à l'émission). Ici on CONSULTE l'objet déjà émis.
 * Centré, ≤640px (§9.2 : « un document a une page, pas un viewport »).
 *
 * L'action de retour vit en registre OUTIL, distincte de l'objet (§10).
 * Privé par défaut : accessible au seul propriétaire sous RLS + garde
 * middleware (V1 : identité vérifiée uniquement).
 * =====================================================================
 */
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardService } from '@/lib/dashboard/DashboardService';
import { PassportDocument } from '@/components/PassportDocument';
import { fr } from '@/lib/i18n/fr';

export default async function PassportPage() {
  const supabase = await createClient();
  const data = await new DashboardService(supabase).getDashboard();

  // Émission incomplète (V3) : finaliser à la cérémonie plutôt que de montrer
  // un objet incohérent.
  if (!data) redirect('/emission');

  return (
    // Registre OBJET — fond navy profond, l'objet centré.
    <main className="min-h-screen bg-navy-950 px-6 py-breathe-lg">
      <div className="mx-auto max-w-[640px]">
        {/* Retour — registre OUTIL, quiet, au-dessus de l'objet. */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 font-interface text-body-sm font-medium text-navy-300 transition-colors duration-micro ease-institutional hover:text-navy-100"
        >
          <span aria-hidden>←</span>
          {fr.dashboard.backToDashboard}
        </Link>

        <div className="mt-6">
          <PassportDocument
            opusId={data.passport.opus_id}
            issuedAt={data.passport.issued_at}
            lifecycleStage={data.passport.lifecycle_stage}
            holderName={data.profile.full_name}
            trustState={data.trust_status?.state ?? null}
            padded="lg"
          />
        </div>
      </div>
    </main>
  );
}
