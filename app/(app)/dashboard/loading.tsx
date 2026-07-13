/**
 * Chargement du Dashboard (§12.4) : des skeletons PAR MODULE en graphite-100,
 * jamais un spinner global. « Un spinner dit que le système réfléchit ; un
 * skeleton dit que votre contenu arrive. » Statiques (§16.4 : aucun shimmer
 * qui court).
 */
function Bar({ className = '' }: { className?: string }) {
  return <div className={`rounded bg-graphite-100 ${className}`} />;
}

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-paper-warm">
      <header className="h-16 border-b border-graphite-300 bg-paper">
        <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-6">
          <Bar className="h-4 w-24" />
          <Bar className="h-8 w-40" />
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-6 py-breathe-lg">
        <Bar className="h-8 w-80 max-w-full" />

        {/* Skeleton du module Passport (dominant). */}
        <div className="mt-breathe max-w-[640px]">
          <Bar className="h-72 w-full rounded-object" />
        </div>

        {/* Skeletons des 3 modules Status, isolés. */}
        <div className="mt-breathe-lg grid grid-cols-1 gap-6 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-surface border border-graphite-300 bg-paper p-6">
              <Bar className="h-5 w-32" />
              <Bar className="mt-4 h-3 w-24" />
              <Bar className="mt-3 h-3 w-full" />
              <Bar className="mt-2 h-3 w-3/4" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
