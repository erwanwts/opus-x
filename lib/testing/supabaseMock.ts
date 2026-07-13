/**
 * Mock minimal du client Supabase pour les tests unitaires des route handlers
 * (LOT 8). On teste le CONTRAT des handlers — statuts, formes, validation,
 * whitelist de champs — de façon déterministe, sans base live ni service_role.
 *
 * L'enforcement RLS (accès croisé) est un test de policy de base, couvert par
 * l'audit RLS du Lot 11 — pas ici.
 */
type Result = { data: unknown; error: unknown; count?: number };

export interface SupabaseMockOptions {
  user?: { id: string } | null;
  /** Résultat d'un `.maybeSingle()` de lecture, par table. */
  single?: (table: string) => Result;
  /** Résultat d'un `.maybeSingle()` après `.update()`, par table. */
  updateSingle?: (table: string) => Result;
  /** Résultat d'un `.order()` (liste), par table. */
  list?: (table: string) => Result;
  /** Résultat d'un `.upsert()`. */
  upsertResult?: Result;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function makeSupabaseMock(opts: SupabaseMockOptions): any {
  const single = opts.single ?? (() => ({ data: null, error: null }));
  const updateSingle = opts.updateSingle ?? single;
  const list = opts.list ?? (() => ({ data: [], error: null }));

  function builder(table: string) {
    let isUpdate = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const b: any = {
      select: () => b,
      eq: () => b,
      order: () => Promise.resolve(list(table)),
      maybeSingle: () => Promise.resolve(isUpdate ? updateSingle(table) : single(table)),
      update: () => {
        isUpdate = true;
        return b;
      },
      upsert: () => Promise.resolve(opts.upsertResult ?? { data: null, error: null }),
    };
    return b;
  }

  return {
    from: (table: string) => builder(table),
    auth: {
      getUser: async () => ({ data: { user: opts.user ?? null } }),
    },
  };
}

/** Fabrique une requête minimale exposant `.json()` pour PATCH/POST. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function jsonRequest(body: unknown): any {
  return {
    json: async () => body,
  };
}
