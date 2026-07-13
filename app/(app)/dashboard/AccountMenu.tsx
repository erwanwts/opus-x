/**
 * Barre supérieure — zone compte (§11.6). Minimal : le nom, l'Opus ID gravé
 * (micro mono, discret) et une action de déconnexion. Aucun menu dense, aucune
 * sidebar (la densité n'est pas ce que le produit vend).
 *
 * Le vocabulaire évite le terme « compte » (interdiction charte / lexique) :
 * on offre l'action, pas l'étiquette.
 */
'use client';

import { useRouter } from 'next/navigation';
import { fr } from '@/lib/i18n/fr';
import { AuthService } from '@/lib/auth/AuthService';
import { createClient } from '@/lib/supabase/client';

export function AccountMenu({ fullName, opusId }: { fullName: string | null; opusId: string }) {
  const router = useRouter();

  async function handleSignOut() {
    await new AuthService(createClient()).signOut();
    router.replace('/');
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-right leading-tight">
        {fullName && (
          <p className="font-interface text-body-sm font-medium text-graphite-900">{fullName}</p>
        )}
        {/* Opus ID discret — micro, mono, graphite-500 (§11.6). */}
        <p className="opus-id text-micro text-graphite-500">{opusId}</p>
      </div>
      <button
        type="button"
        onClick={handleSignOut}
        className="rounded-control border border-graphite-300 bg-paper px-3 py-1.5 font-interface text-body-sm font-medium text-graphite-700 transition-colors duration-micro ease-institutional hover:border-navy-500"
      >
        {fr.dashboard.signOut}
      </button>
    </div>
  );
}
