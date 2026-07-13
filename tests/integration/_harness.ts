/**
 * =====================================================================
 * Opus X — Sprint 1 — LOT 11 : Harnais QA d'intégration (base LIVE)
 * =====================================================================
 * Ces tests s'exécutent contre le projet Supabase de STAGING dédié
 * (.env.test.local), jamais contre la base principale (.env.local).
 *
 * GARDE DE SÉCURITÉ OBLIGATOIRE (spec du sprint, exigée par l'architecte) :
 *   Le harnais REFUSE DE DÉMARRER si l'URL Supabase de test correspond à
 *   celle de .env.local. Un test qui pourrait s'exécuter contre la base
 *   principale ne doit JAMAIS pouvoir démarrer. On échoue BRUYAMMENT.
 *
 * La garde s'exécute au chargement du module (import), avant la création
 * du moindre client : aucun test d'intégration ne peut être importé sans
 * la franchir. Elle est aussi ré-exécutée en globalSetup (ceinture + bretelles).
 * =====================================================================
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------
// Lecture d'un fichier .env SANS dépendance externe (dotenv non installé).
// ---------------------------------------------------------------------
function parseEnvFile(absPath: string): Record<string, string> {
  let raw: string;
  try {
    raw = readFileSync(absPath, 'utf8');
  } catch {
    return {};
  }
  const out: Record<string, string> = {};
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !line.trimStart().startsWith('#')) out[m[1]] = m[2];
  }
  return out;
}

/** Extrait le "project ref" (sous-domaine) d'une URL Supabase, normalisé. */
function projectRef(url: string | undefined): string | null {
  if (!url) return null;
  const m = url.trim().replace(/\/+$/, '').match(/^https?:\/\/([a-z0-9-]+)\.supabase\.co/i);
  return m ? m[1].toLowerCase() : url.trim().replace(/\/+$/, '').toLowerCase();
}

const ROOT = path.resolve(__dirname, '../../');
const testEnv = parseEnvFile(path.join(ROOT, '.env.test.local'));
const mainEnv = parseEnvFile(path.join(ROOT, '.env.local'));

const TEST_URL = testEnv.NEXT_PUBLIC_SUPABASE_URL;
const TEST_ANON = testEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const TEST_SERVICE = testEnv.SUPABASE_SERVICE_ROLE_KEY;
const MAIN_URL = mainEnv.NEXT_PUBLIC_SUPABASE_URL;

// =====================================================================
// LA GARDE — logique pure (testable) + application bruyante.
// =====================================================================

/**
 * Renvoie le message de violation si la cible n'est PAS sûre, sinon null.
 * Pur : aucune E/S, aucun effet de bord — pour pouvoir tester le REFUS.
 */
export function firstGuardViolation(opts: {
  testUrl?: string;
  mainUrl?: string;
  service?: string;
  anon?: string;
}): string | null {
  const { testUrl, mainUrl, service, anon } = opts;
  if (!testUrl) return 'NEXT_PUBLIC_SUPABASE_URL absente de .env.test.local.';
  if (!service)
    return 'SUPABASE_SERVICE_ROLE_KEY absente de .env.test.local (requise pour le setup QA).';
  if (!anon) return 'NEXT_PUBLIC_SUPABASE_ANON_KEY absente de .env.test.local.';

  const norm = (u: string) => u.trim().replace(/\/+$/, '');
  if (mainUrl && norm(testUrl) === norm(mainUrl)) {
    return `L'URL de test (${testUrl}) est IDENTIQUE à celle de .env.local.`;
  }
  const testRef = projectRef(testUrl);
  const mainRef = projectRef(mainUrl);
  if (mainRef && testRef === mainRef) {
    return `Le projet Supabase de test (${testRef}) est le MÊME que celui de .env.local (${mainRef}).`;
  }
  return null;
}

export function assertSafeStagingTarget(): void {
  const fail = (msg: string): never => {
    // Bruyant : bannière visible + exception non rattrapée.
    const banner =
      '\n' +
      '████████████████████████████████████████████████████████████████████\n' +
      '██  OPUS X — GARDE DE SÉCURITÉ QA : DÉMARRAGE REFUSÉ              ██\n' +
      '████████████████████████████████████████████████████████████████████\n' +
      `  ${msg}\n` +
      '  Aucun test ne s’exécutera. Corrige .env.test.local avant de relancer.\n';
    // eslint-disable-next-line no-console
    console.error(banner);
    throw new Error(`[OPUS X QA GUARD] ${msg}`);
  };

  const violation = firstGuardViolation({
    testUrl: TEST_URL,
    mainUrl: MAIN_URL,
    service: TEST_SERVICE,
    anon: TEST_ANON,
  });
  if (violation) {
    fail(`${violation} Refus de cibler la base principale.`);
  }

  // eslint-disable-next-line no-console
  console.error(
    `[OPUS X QA GUARD] OK — cible de test isolée : ${projectRef(TEST_URL)} ` +
      `(principale : ${projectRef(MAIN_URL) ?? 'inconnue'}).`
  );
}

// La garde s'exécute À L'IMPORT. Impossible d'importer le harnais sans la franchir.
assertSafeStagingTarget();

// =====================================================================
// Clients
// =====================================================================

/** service_role — bypasse la RLS. Réservé au setup/teardown et aux assertions privilégiées. */
export function adminClient(): SupabaseClient {
  return createClient(TEST_URL!, TEST_SERVICE!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/** anon nu — soumis à la RLS, sans session. Simule le public. */
export function anonClient(): SupabaseClient {
  return createClient(TEST_URL!, TEST_ANON!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export const admin = adminClient();

// =====================================================================
// Cycle de vie des utilisateurs de test
// =====================================================================
const createdUserIds = new Set<string>();

export interface ConsentSeed {
  type: 'terms' | 'privacy' | 'partner_ingestion' | 'public_share';
  granted: boolean;
  version: string;
  effective_date: string;
}

export const DEFAULT_CONSENTS: ConsentSeed[] = [
  { type: 'terms', granted: true, version: 'v1.0.0', effective_date: '2026-07-11' },
  { type: 'privacy', granted: true, version: 'v1.0.0', effective_date: '2026-07-11' },
];

let seq = 0;
function uniqueEmail(tag: string): string {
  // Unicité sans collision : compteur + horodatage (scripts node → Date.now() autorisé).
  seq += 1;
  return `opusx-qa-${tag}-${Date.now().toString(36)}-${seq}@example.com`;
}

export interface TestUser {
  id: string;
  email: string;
  password: string;
  meta: Record<string, unknown>;
}

/**
 * Crée un utilisateur. email_confirm pilote la Vigilance V1 :
 *  - true  → identité vérifiée : le trigger ÉMET le Passport.
 *  - false → identité NON vérifiée : aucune émission, aucune session possible.
 */
export async function createUser(opts: {
  tag: string;
  confirmed: boolean;
  fullName?: string;
  locale?: string;
  consents?: ConsentSeed[] | null;
}): Promise<TestUser> {
  const email = uniqueEmail(opts.tag);
  const password = `Pw!${Math.random().toString(36).slice(2, 10)}Aa9`;
  const meta: Record<string, unknown> = {
    full_name: opts.fullName ?? 'QA Professional',
    locale: opts.locale ?? 'fr',
  };
  if (opts.consents !== null) {
    meta.consents = opts.consents ?? DEFAULT_CONSENTS;
  }

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: opts.confirmed,
    user_metadata: meta,
  });
  if (error || !data.user) {
    throw new Error(`createUser a échoué : ${error?.message ?? 'utilisateur nul'}`);
  }
  createdUserIds.add(data.user.id);
  return { id: data.user.id, email, password, meta };
}

/** Ouvre une session authentifiée (rôle authenticated, RLS active). */
export async function signIn(email: string, password: string): Promise<SupabaseClient> {
  const client = anonClient();
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw new Error(`signIn a échoué : ${error.message}`);
  return client;
}

/** Tente une session ; renvoie l'erreur éventuelle sans lever (pour tester le refus). */
export async function trySignIn(
  email: string,
  password: string
): Promise<{ client: SupabaseClient; hasSession: boolean; error: string | null }> {
  const client = anonClient();
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  return { client, hasSession: Boolean(data?.session), error: error?.message ?? null };
}

// --- Lectures privilégiées (service_role, bypass RLS) --------------------
export async function adminProfile(userId: string) {
  const { data } = await admin.from('profiles').select('*').eq('id', userId).maybeSingle();
  return data;
}
export async function adminPassport(userId: string) {
  const { data } = await admin.from('passports').select('*').eq('profile_id', userId).maybeSingle();
  return data;
}
export async function adminPassportCount(userId: string): Promise<number> {
  const { count } = await admin
    .from('passports')
    .select('id', { count: 'exact', head: true })
    .eq('profile_id', userId);
  return count ?? 0;
}
export async function adminConsents(userId: string) {
  const { data } = await admin
    .from('consents')
    .select('*')
    .eq('profile_id', userId)
    .order('type');
  return data ?? [];
}
export async function adminTrustIndex(passportId: string) {
  const { data } = await admin
    .from('trust_index')
    .select('*')
    .eq('passport_id', passportId)
    .maybeSingle();
  return data;
}

/** Efface complètement l'empreinte applicative d'un utilisateur (cascade via profiles). */
export async function wipeApplicationRows(userId: string): Promise<void> {
  // Supprimer le profil cascade vers passport → trust_index → consents (FK on delete cascade).
  await admin.from('profiles').delete().eq('id', userId);
}

/** Attend l'émission déclenchée par le trigger (au cas où le commit n'est pas encore visible). */
export async function waitForPassport(userId: string, tries = 15, delayMs = 200) {
  for (let i = 0; i < tries; i++) {
    const p = await adminPassport(userId);
    if (p) return p;
    await new Promise((r) => setTimeout(r, delayMs));
  }
  return null;
}

/** Teardown global : supprime tous les utilisateurs créés (cascade DB). */
export async function cleanupAllUsers(): Promise<void> {
  for (const id of createdUserIds) {
    try {
      await admin.auth.admin.deleteUser(id);
    } catch {
      /* best-effort */
    }
  }
  createdUserIds.clear();
}

export { TEST_URL, MAIN_URL, projectRef };
