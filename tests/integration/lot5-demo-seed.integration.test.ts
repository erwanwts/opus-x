/**
 * =====================================================================
 * WEB-003 Lot 5 — SEED de la vitrine de démonstration (STAGING uniquement)
 * =====================================================================
 * Peuple le Passport de démo avec des Skills + Evidence d'EXEMPLE, et prouve
 * que l'opération est RÉVERSIBLE. La démo PERSISTE à la fin (c'est une vitrine).
 *
 * IDEMPOTENT (arbitrage E) — la clé d'idempotence est la COLONNE `is_demo`, pas
 * un handle. Le handle historique `erwan-signe-15w8` n'est PAS reproductible :
 * il vient du suffixe aléatoire de generate_unique_handle(). L'ancien outil
 * (zz-create-persistent-demo) créait un utilisateur neuf à chaque exécution et
 * ACCUMULAIT des Passports publics. Ici : on adopte la ligne de démo existante,
 * on ne la duplique jamais.
 *
 * GARDE D'ÉCRITURE (l'invariant qui compte) — `seedShowcase()` REFUSE d'écrire
 * sur un Passport dont `is_demo` n'est pas `true`. De fausses preuves ne peuvent
 * donc pas atteindre un vrai profil : c'est l'outil qui l'interdit, pas la
 * discipline de celui qui l'exécute.
 *
 * PORTÉE : staging `bnzahwzuwoxjrxpqsjhp` uniquement (garde d'import du harnais
 * + assertion de ref explicite avant toute écriture). JAMAIS la production.
 * =====================================================================
 */
import { describe, it, expect } from 'vitest';
import { admin, createUser, waitForPassport, projectRef, TEST_URL } from './_harness';
import { fetchPublicPassport } from '@/lib/api/readPublicPassport';

const STAGING_REF = 'bnzahwzuwoxjrxpqsjhp';
const DEMO_NAME = 'Erwan Signe';

/**
 * Ligne de démo héritée du Lot 2 (suffixe aléatoire, non reproductible). On
 * l'ADOPTE au premier passage — sinon elle resterait PUBLIQUE et NON MARQUÉE,
 * c'est-à-dire indistinguable d'un vrai Passport. Après adoption, `is_demo`
 * seul fait foi et cette constante ne sert plus.
 */
const LEGACY_DEMO_HANDLE = 'erwan-signe-15w8';

/** Données d'EXEMPLE — fictives, assumées comme telles (bandeau + noindex). */
const DEMO_SKILLS = [
  'Intention vs Engagement',
  'Risk Sizing Discipline',
  'Trade Journaling',
  'Drawdown Recovery',
];

const DEMO_EVIDENCE = [
  {
    type: 'assessment',
    title: 'World Trader Framework — Level Assessment',
    verified: true,
    issued_at: '2026-05-12T10:00:00Z',
  },
  {
    type: 'live_evaluation',
    title: 'Supervised Trading Session — Q2',
    verified: true,
    issued_at: '2026-06-03T14:30:00Z',
  },
  {
    type: 'course_completion',
    title: 'Risk Management Programme',
    verified: false,
    issued_at: '2026-06-28T09:15:00Z',
  },
];

/** Résout la ligne de démo — adopte l'existante, n'en crée une qu'en dernier recours. */
async function resolveDemoPassport(): Promise<{ id: string; handle: string }> {
  // 1. La clé d'idempotence : une ligne déjà marquée démo.
  const marked = await admin.from('passports').select('id, handle').eq('is_demo', true);
  if (marked.error) throw new Error(`lecture is_demo : ${marked.error.message}`);
  if ((marked.data ?? []).length > 1) {
    const handles = marked.data!.map((r) => r.handle).join(', ');
    throw new Error(`[LOT5 STOP] Plusieurs Passports is_demo=true (${handles}). Ambigu → aucune écriture.`);
  }
  if ((marked.data ?? []).length === 1) return marked.data![0];

  // 2. Adoption de la ligne héritée (une seule fois, au premier passage).
  const legacy = await admin
    .from('passports')
    .select('id, handle')
    .eq('handle', LEGACY_DEMO_HANDLE)
    .maybeSingle();
  if (legacy.data) {
    const up = await admin.from('passports').update({ is_demo: true }).eq('id', legacy.data.id);
    expect(up.error).toBeNull();
    return legacy.data;
  }

  // 3. Dernier recours : émettre une démo neuve. Le handle sera aléatoire — sans
  //    importance, `is_demo` le retrouvera au prochain passage.
  const user = await createUser({ tag: 'lot5-demo', confirmed: true, fullName: DEMO_NAME, locale: 'en' });
  const passport = await waitForPassport(user.id);
  expect(passport).not.toBeNull();
  const up = await admin.from('passports').update({ is_demo: true }).eq('id', passport!.id);
  expect(up.error).toBeNull();
  return { id: passport!.id, handle: passport!.handle };
}

/**
 * Écrit les Skills/Evidence d'exemple. REFUSE toute ligne non marquée démo.
 * Idempotent : purge puis réinsère (ré-exécuter ne duplique rien).
 */
async function seedShowcase(passportId: string): Promise<void> {
  const check = await admin.from('passports').select('is_demo').eq('id', passportId).maybeSingle();
  if (check.data?.is_demo !== true) {
    throw new Error(
      `[LOT5 STOP] Refus d'écrire des Skills/Evidence d'EXEMPLE sur un Passport is_demo=${check.data?.is_demo}. ` +
        `De fausses preuves ne doivent jamais atteindre un vrai profil.`
    );
  }

  await rollbackShowcase(passportId);

  const s = await admin.from('skills').insert(DEMO_SKILLS.map((name) => ({ passport_id: passportId, name })));
  expect(s.error).toBeNull();
  const e = await admin.from('evidence').insert(DEMO_EVIDENCE.map((ev) => ({ passport_id: passportId, ...ev })));
  expect(e.error).toBeNull();
}

/** Retrait des lignes d'exemple. Le Passport lui-même reste intact. */
async function rollbackShowcase(passportId: string): Promise<void> {
  const s = await admin.from('skills').delete().eq('passport_id', passportId);
  expect(s.error).toBeNull();
  const e = await admin.from('evidence').delete().eq('passport_id', passportId);
  expect(e.error).toBeNull();
}

describe('Lot 5 — vitrine de démonstration (staging)', () => {
  it('seed idempotent, marqué démo, réversible — et la démo persiste', async () => {
    // Garde : STAGING confirmé AVANT toute écriture.
    expect(projectRef(TEST_URL)).toBe(STAGING_REF);

    const demo = await resolveDemoPassport();

    // La vitrine est PUBLIQUE, marquée démo, et vérifiée par son ÉTAPE de cycle
    // de vie — `verified` est dérivé, il n'existe aucune colonne à forcer.
    const open = await admin
      .from('passports')
      .update({ visibility: 'public', lifecycle_stage: 'passport_verified' })
      .eq('id', demo.id);
    expect(open.error).toBeNull();

    // ── 1. Seed ───────────────────────────────────────────────────────────
    await seedShowcase(demo.id);

    const full = await fetchPublicPassport(demo.handle);
    expect(full).not.toBeNull();
    expect(full!.is_demo).toBe(true);
    expect(full!.verified).toBe(true); // dérivé de lifecycle_stage='passport_verified'
    expect(full!.lifecycle_stage).toBe('passport_verified');
    expect(full!.skills_status).toBe('emerging');
    expect(full!.skills.map((s) => s.name).sort()).toEqual([...DEMO_SKILLS].sort());
    expect(full!.evidence).toHaveLength(DEMO_EVIDENCE.length);

    // Whitelist tenue par la VUE : ni payload, ni description, ni status interne.
    for (const ev of full!.evidence) {
      expect(Object.keys(ev).sort()).toEqual(['issued_at', 'issuer', 'title', 'type', 'verified']);
      expect(ev.issuer).toBeNull(); // trou assumé (aucune colonne Issuer au schéma)
    }
    for (const sk of full!.skills) {
      expect(Object.keys(sk)).toEqual(['name']); // jamais `level`, jamais `verified`
    }

    // ── 2. Idempotence : re-seeder ne duplique rien ───────────────────────
    await seedShowcase(demo.id);
    const again = await fetchPublicPassport(demo.handle);
    expect(again!.skills).toHaveLength(DEMO_SKILLS.length);
    expect(again!.evidence).toHaveLength(DEMO_EVIDENCE.length);

    // ── 3. Rollback PROUVÉ : la carte redevient vide, le Passport survit ──
    await rollbackShowcase(demo.id);
    const emptied = await fetchPublicPassport(demo.handle);
    expect(emptied).not.toBeNull(); // le Passport n'a pas été touché
    expect(emptied!.skills).toEqual([]);
    expect(emptied!.evidence).toEqual([]);
    expect(emptied!.skills_status).toBe('empty');

    // ── 4. Re-seed : la vitrine PERSISTE (état final = pleine) ────────────
    await seedShowcase(demo.id);
    const final = await fetchPublicPassport(demo.handle);
    expect(final!.skills).toHaveLength(DEMO_SKILLS.length);
    expect(final!.evidence).toHaveLength(DEMO_EVIDENCE.length);

    // eslint-disable-next-line no-console
    console.error(`\n>>> DEMO (Lot 5) = /p/${final ? demo.handle : ''}  is_demo=true, PERSISTE\n`);
  }, 60_000);

  it("refuse d'écrire des Skills/Evidence d'exemple sur un Passport NON démo", async () => {
    expect(projectRef(TEST_URL)).toBe(STAGING_REF);

    // Un Passport réel (is_demo=false par défaut) — jamais ouvert au public.
    const user = await createUser({ tag: 'lot5-real', confirmed: true, fullName: 'Real Professional', locale: 'en' });
    const passport = await waitForPassport(user.id);
    expect(passport).not.toBeNull();

    await expect(seedShowcase(passport!.id)).rejects.toThrow(/Refus d'écrire/);

    // Et rien n'a été écrit.
    const { count } = await admin
      .from('skills')
      .select('*', { count: 'exact', head: true })
      .eq('passport_id', passport!.id);
    expect(count).toBe(0);

    await admin.auth.admin.deleteUser(user.id); // cascade → aucune trace.
  }, 60_000);
});
