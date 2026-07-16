/**
 * Formulaire de consentement — l'ACTE qui compte (LOT O2a-EXT).
 *
 * Form NATIF (pas de fetch, pas de JS) : la soumission est une navigation
 * top-level. /api/link/authorize répond 302 vers le callback de l'Issuer avec
 * le code — le navigateur suit la redirection, le script ne voit jamais le
 * code. issuer_id / redirect_uri / state voyagent en champs cachés ; le code
 * et le jeton, eux, ne passent que par le canal arrière.
 */
import { fr } from '@/lib/i18n/fr';

const t = fr.link;
const fill = (s: string, issuer: string) => s.replaceAll('{issuer}', issuer);

export function ConsentForm({
  issuerId,
  issuerName,
  redirectUri,
  state,
}: {
  issuerId: string;
  issuerName: string;
  redirectUri: string;
  state: string;
}) {
  return (
    <form method="POST" action="/api/link/authorize" className="mt-10 space-y-4">
      <input type="hidden" name="issuer_id" value={issuerId} />
      <input type="hidden" name="redirect_uri" value={redirectUri} />
      <input type="hidden" name="state" value={state} />

      <button
        type="submit"
        className="w-full rounded-control bg-navy-600 px-4 py-3 text-body font-semibold text-paper transition-colors duration-micro ease-institutional hover:bg-navy-700"
      >
        {fill(t.authorize, issuerName)}
      </button>
      <a
        href="/dashboard"
        className="block w-full py-2 text-center text-body-sm text-graphite-500 hover:text-graphite-700"
      >
        {t.decline}
      </a>
    </form>
  );
}
