/**
 * OUTIL PONCTUEL (non committé) — crée un Passport de démo PUBLIC PERSISTANT sur
 * STAGING pour visualisation navigateur. NE SUPPRIME RIEN (pas de rollback).
 * Nettoyage manuel ultérieur. Garde staging obligatoire.
 */
import { describe, it, expect } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import { admin, createUser, waitForPassport, projectRef, TEST_URL } from './_harness';

const STAGING_REF = 'bnzahwzuwoxjrxpqsjhp';
const DEMO_NAME = 'Erwan Signe';

describe('Démo persistante (staging)', () => {
  it('crée un Passport public PERSISTANT et rend le handle', async () => {
    // Garde : STAGING confirmé AVANT toute écriture.
    const ref = projectRef(TEST_URL);
    expect(ref).toBe(STAGING_REF);

    const user = await createUser({ tag: 'demo-persist', confirmed: true, fullName: DEMO_NAME, locale: 'en' });
    const passport = await waitForPassport(user.id);
    expect(passport).not.toBeNull();
    const handle = passport!.handle;

    const up = await admin.from('passports').update({ visibility: 'public' }).eq('handle', handle);
    expect(up.error).toBeNull();

    // PAS de cleanup : la démo PERSISTE.
    mkdirSync('build/demo', { recursive: true });
    writeFileSync(
      'build/demo/DEMO.json',
      JSON.stringify({ staging_ref: ref, handle, display_name: DEMO_NAME, user_id: user.id, persisted: true }, null, 2) + '\n',
      'utf8'
    );
    // eslint-disable-next-line no-console
    console.error(`\n>>> DEMO HANDLE = ${handle}  (display_name="${DEMO_NAME}", visibility=public, PERSISTE)\n`);
  }, 30_000);
});
