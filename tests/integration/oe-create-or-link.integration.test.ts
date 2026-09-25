/**
 * =====================================================================
 * O-E (D-056) — CRÉER OU LIER : une ré-activation ne fonde jamais un 2e Passeport.
 * =====================================================================
 * Point d'arrêt FALSIFIABLE, sur STAGING (jamais la prod) :
 *   • un sujet FRAIS fonde son Passeport (émission, decision='create') ;
 *   • le MÊME sujet, déjà passeporté, ré-active → wsp_activate_passport() rend
 *     decision='link', le MÊME passport_id, status='linked' ;
 *   • AUCUN 2e Passeport (passportCount reste 1) — l'invariant est structurel
 *     (passports.profile_id UNIQUE) ; la mutation « forcer une 2e création »
 *     casserait ces assertions ;
 *   • idempotent : re-relier n'ajoute pas un second consentement 'link'.
 *
 * L'audit de décision se lit dans le store dédié O-B : ['create','link'].
 * =====================================================================
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  admin,
  signIn,
  waitForPassport,
  adminProfile,
  adminPassport,
  adminPassportCount,
  adminCreationConsents,
} from './_harness';
import type { SupabaseClient } from '@supabase/supabase-js';

const createdIds: string[] = [];
const V = { version: 'v1.0.0', effective_date: '2026-07-11' };

async function createFreshPassportedSubject(tag: string): Promise<{ id: string; email: string; password: string }> {
  const email = `opusx-qa-${tag}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}@example.com`;
  const password = `Pw!${Math.random().toString(36).slice(2, 10)}Aa9`;
  // NON confirmé + métadonnées portant l'acte de création (comme establishIdentity).
  const { data, error } = await admin.auth.admin.createUser({
    email, password, email_confirm: false,
    user_metadata: {
      full_name: 'QA Activate', locale: 'fr',
      consents: [{ type: 'terms', granted: true, ...V }, { type: 'privacy', granted: true, ...V }],
      passport_creation: { decision: 'create', granted: true, ...V },
    },
  });
  if (error || !data.user) throw new Error(`createUser: ${error?.message}`);
  createdIds.push(data.user.id);
  // Confirmation (transition email_confirmed_at) → émission (fonde le Passeport).
  await admin.auth.admin.updateUserById(data.user.id, { email_confirm: true });
  return { id: data.user.id, email, password };
}

afterAll(async () => {
  for (const id of createdIds) {
    try { await admin.auth.admin.deleteUser(id); } catch { /* best-effort */ }
  }
});

let subjectId: string;
let session: SupabaseClient;
let passportP1: string;

beforeAll(async () => {
  const u = await createFreshPassportedSubject('oe');
  subjectId = u.id;
  await waitForPassport(u.id);
  passportP1 = (await adminPassport(u.id))!.id as string;
  session = await signIn(u.email, u.password);
});

describe('O-E — créer ou lier (staging)', () => {
  it('⭐ sujet FRAIS fonde son Passeport : create + 1 Passeport', async () => {
    expect(await adminPassportCount(subjectId)).toBe(1);
    const consents = (await adminCreationConsents(subjectId)).map((c) => c.decision);
    expect(consents).toContain('create'); // fondé par l'émission
  });

  it('⭐ ré-activation d’un sujet DÉJÀ passeporté → link, MÊME passport_id, AUCUN 2e Passeport', async () => {
    const before = (await adminProfile(subjectId))!.opus_id;

    const act = await session.rpc('wsp_activate_passport');
    expect(act.error).toBeNull();
    const d = act.data as { opus_id: string; passport_id: string; decision: string; status: string };

    expect(d.decision).toBe('link');            // déjà passeporté → relier
    expect(d.status).toBe('linked');
    expect(d.opus_id).toBe(before);
    expect(d.passport_id).toBe(passportP1);      // MÊME passport_id

    // FALSIFIABLE : toujours exactement 1 Passeport, id inchangé.
    expect(await adminPassportCount(subjectId)).toBe(1);
    expect((await adminPassport(subjectId))!.id).toBe(passportP1);

    // Audit de décision : le store dédié porte maintenant create ET link.
    const decisions = (await adminCreationConsents(subjectId)).map((c) => c.decision).sort();
    expect(decisions).toEqual(['create', 'link']);
  });

  it('⭐ idempotent : re-relier n’ajoute pas un 2e consentement link, ni un 2e Passeport', async () => {
    await session.rpc('wsp_activate_passport');
    await session.rpc('wsp_activate_passport');

    const links = (await adminCreationConsents(subjectId)).filter((c) => c.decision === 'link');
    expect(links).toHaveLength(1);
    expect(await adminPassportCount(subjectId)).toBe(1);
  });
});
