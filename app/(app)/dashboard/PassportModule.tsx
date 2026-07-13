/**
 * Module PROFESSIONAL PASSPORT — l'élément dominant du Dashboard (§12.2).
 *
 * LOI D'OBJET (§10) : une FENÊTRE sur l'objet, rendue dans le registre OBJET
 * (via PassportDocument), SERTIE dans le registre Outil. Les deux registres ne
 * se mélangent jamais dans un même élément : la carte sombre est purement
 * objet ; l'action « Voir mon Passport » vit EN DESSOUS, en registre Outil.
 */
import Link from 'next/link';
import { fr } from '@/lib/i18n/fr';
import { PassportDocument } from '@/components/PassportDocument';
import type { DashboardPassport } from '@/lib/dashboard/DashboardService';

export function PassportModule({ passport }: { passport: DashboardPassport }) {
  return (
    <section aria-label="Professional Passport">
      {/* La fenêtre objet (compacte : le Trust a sa propre carte à côté). */}
      <PassportDocument
        opusId={passport.opus_id}
        issuedAt={passport.issued_at}
        lifecycleStage={passport.lifecycle_stage}
      />

      {/* L'action, EN DESSOUS, en registre OUTIL (jamais mêlée à l'objet, §10). */}
      <div className="mt-4">
        <Link
          href="/passport"
          className="inline-flex items-center gap-1.5 font-interface text-body font-medium text-navy-500 transition-colors duration-micro ease-institutional hover:underline"
        >
          {fr.dashboard.viewPassport}
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
