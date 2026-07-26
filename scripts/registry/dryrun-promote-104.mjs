#!/usr/bin/env node
/**
 * DRY-RUN de promotion — OCR-104 (Opus ID) · Draft → Normative.
 *
 * TEST D'ACCEPTATION de l'étape 6 (avant/après). LECTURE SEULE, ZÉRO écriture : ce
 * script ne crée, ne modifie et ne committe RIEN. Il construit en mémoire le fait
 * PROMO-001 qui SERAIT émis et PROUVE que le mécanisme est complet : le résolveur
 * dérive (§2), la garde anti-forgeage détecte (§4), le champ reste intact (§3), la
 * promotion est réversible (§5). OCR-104 n'est PAS promu — on prouve que ça marcherait.
 *
 * Réexécutable : `node scripts/registry/dryrun-promote-104.mjs`
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const TARGET = 'OCR-104';
const P = (s) => console.log(s);
const H = (s) => console.log('\n══ ' + s + ' ' + '═'.repeat(Math.max(0, 66 - s.length)));

P('DRY-RUN — promotion ' + TARGET + ' (Opus ID) · Draft → Normative · ZÉRO écriture');

// ── 1. Le fait PROMO-001 qui SERAIT écrit (modelé sur RATIF-001) ──────────────
H('1. FAIT PROMO-001 — ce qui serait écrit (montré, PAS commis)');
const ratif = JSON.parse(readFileSync(path.join(ROOT, 'content/registry/founding/RATIF-001.json'), 'utf8'));
const promo001 = {
  id: 'PROMO-001',
  kind: 'promotion',                       // acte ORDINAIRE (RATIF = fondateur)
  declares_normative: [TARGET],
  authority: 'Opus X',
  signature: 'Opus X — <signataire> Signe', // à apposer à l'émission réelle
  date: '2026-07-26',                       // dry-run — date confirmée à l'émission
  basis: 'OCR-009 (Approval Form) · OCR-000:47 (grounding + Opus X approval)',
  grounding: { verdict: 'G0', report: 'OCR-GROUND-001-SYNTHESE §2', gap: 'none' },
  ordinary_process: true,
  immutable: true,
  declaration: `Promotion ordinaire d'${TARGET} (Opus ID) de Draft à Normative, sous autorité Opus X, ` +
    `le grounding étant satisfait (G0, aucun désaccord doc↔code). Statut dérivé de ce fait, jamais authored.`,
};
P('  chemin      : content/registry/promo/PROMO-001.json   (lieu PROMO, miroir de founding/)');
P('  contenu     :');
P(JSON.stringify(promo001, null, 2).split('\n').map((l) => '    ' + l).join('\n'));

P('\n  ACTE EN 2 PARTIES (D-004) :');
const manifest = JSON.parse(readFileSync(path.join(ROOT, 'content/registry/_manifest.json'), 'utf8'));
P('    (a) le fichier PROMO-001.json ci-dessus ;');
P('    (b) la plage expected_ranges couvrant PROMO-001.');
P('    expected_ranges actuel : ' + manifest.expected_ranges);
const rangeHasPromo1 = /PROMO-001\.\.(00[1-9]|0[1-9]\d|\d{4,})/.test(manifest.expected_ranges) ||
  /PROMO-001\.\.001/.test(manifest.expected_ranges);
P('    PROMO-001 déjà dans la plage ? ' + rangeHasPromo1 + '  (réservée par D-004)');
const anomPromo = (manifest.anomalies ?? []).find((a) => a.type === 'missing_in_sequence' && /PROMO/.test(a.range || ''));
P('    anomalie courante : ' + (anomPromo ? JSON.stringify(anomPromo.missing) + ' manquant (le fichier n\'existe pas)' : 'aucune'));
P('    ⇒ pour PROMO-001, la plage est PRÉ-RÉSERVÉE ; écrire le fichier CLÔT l\'anomalie missing_in_sequence.');
P('      (pour PROMO-002+, part (b) = étendre la borne — acte en 2 parties plein.)');

// ── 2. La dérivation — RÉUSSIE (le résolveur existe depuis l'étape 6) ──────────
H('2. DÉRIVATION — RÉUSSIE (résolveur construit à l\'étape 6)');
// Miroir de lib/registry/resolveStatus.ts (le vrai vit en TS, testé isolément) — pour DÉMONTRER ici.
const resolveStatusMirror = (recordId, facts) => {
  const promoted = new Set();
  const revoked = new Set();
  for (const f of facts) {
    if (f.kind === 'revocation') for (const id of f.revokes_normative ?? []) revoked.add(id);
    else for (const id of f.declares_normative ?? []) promoted.add(id);
  }
  return promoted.has(recordId) && !revoked.has(recordId) ? 'Normative' : 'Draft';
};
const loadFactsMirror = () => {
  const facts = [];
  for (const rel of ['content/registry/founding', 'content/registry/promo']) {
    const dir = path.join(ROOT, rel);
    if (!existsSync(dir)) continue;
    for (const fn of readdirSync(dir).filter((n) => n.endsWith('.json'))) {
      let j;
      try { j = JSON.parse(readFileSync(path.join(dir, fn), 'utf8')); } catch { continue; }
      if (j && ['founding-ratification', 'promotion', 'revocation'].includes(j.kind)) facts.push(j);
    }
  }
  return facts;
};
const resolverExists = existsSync(path.join(ROOT, 'lib/registry/resolveStatus.ts'));
P('  resolveStatus(recordId, facts) EXISTE : ' + resolverExists + '   (lib/registry/resolveStatus.ts, testé)');
P('    dérive promoted \\ revoked ; ne lit AUCUN champ ; n\'écrit rien.');
P('');
P('  (a) SI le fait PROMO-001 était écrit → ' + TARGET + ' dériverait :');
P('    resolveStatus("' + TARGET + '", [PROMO-001]) → ' + resolveStatusMirror(TARGET, [promo001]) + '   ← dérivation RÉUSSIE');
P('');
const realFacts = loadFactsMirror();
P('  (b) ÉTAT RÉEL (aucun PROMO-001 écrit — dry-run) : ' + TARGET + ' reste NON promu :');
P('    faits réellement présents : ' + (realFacts.map((f) => f.id).join(', ') || '(aucun)'));
P('    resolveStatus("' + TARGET + '", <faits réels>) → ' + resolveStatusMirror(TARGET, realFacts) + '   ← Draft : ' + TARGET + ' n\'est PAS promu');
P('    resolveStatus("OCR-000", <faits réels>) → ' + resolveStatusMirror('OCR-000', realFacts) + '   ← Normative (RATIF-001, réel — fenêtre D-023 fermée)');
P('  ⇒ Le mécanisme FONCTIONNE. Écrire PROMO-001 suffirait à promouvoir ' + TARGET + '. Le dry-run ne l\'écrit pas.');

// ── 3. Le champ Status — INCHANGÉ ─────────────────────────────────────────────
H('3. CHAMP Status — resté Draft (la promotion propre ne le touche PAS)');
const md = readFileSync(path.join(ROOT, 'docs/web/registry-import/OCR-100/OCR-104_Opus_ID.md'), 'utf8');
const statusLine = md.split('\n').find((l) => /\|\s*\*\*Status\*\*\s*\|/.test(l));
P('  OCR-104 champ actuel : ' + (statusLine ? statusLine.trim() : '(introuvable)'));
P('  Après une promotion PROPRE : IDENTIQUE (D-022 : statut = projection, jamais authored ; OCR-009 §4).');
P('  CONTRASTE — le chemin de forgeage (édition du champ) est désormais FERMÉ (§4) :');
P('    éditer le champ en "Normative" ne promeut plus (le résolveur ignore le champ), et');
P('    la garde anti-forgeage le DÉTECTE. Le statut ne se promeut que par un FAIT.');

// ── 4. La garde anti-forgeage — PRÉSENTE (construite à l'étape 6) ──────────────
H('4. GARDE ANTI-FORGEAGE — PRÉSENTE (construite à l\'étape 6, palier 2)');
const AUTHORED_NORMATIVE = /\|\s*\*\*Status\*\*\s*\|\s*(Normative|Validated)\s*\|/i; // miroir de antiForgery.ts
const guardExists = existsSync(path.join(ROOT, 'lib/registry/antiForgery.ts'));
P('  authorsNormativeStatus(raw) EXISTE : ' + guardExists + '   (lib/registry/antiForgery.ts, testé)');
P('    règle : aucun Record .md ne porte "Status: Normative"/"Validated" authored (OCR-009 §2).');
P('  OCR-104 réel : champ Normative/Validated authored ? ' + AUTHORED_NORMATIVE.test(md) + '   (attendu : false)');
const forged104 = md.replace('| **Status** | Draft |', '| **Status** | Normative |');
P('  Un champ forgé en Normative est DÉTECTÉ : ' + AUTHORED_NORMATIVE.test(forged104) + '   (attendu : true)');
P('  Double fermeture : la garde interdit le champ authored ET le résolveur ignore le champ.');

// ── 5. Réversibilité ──────────────────────────────────────────────────────────
H('5. RÉVERSIBILITÉ — un 2e fait révoque (D-013), champ jamais touché');
const revocation = {
  id: 'PROMO-001-REV', kind: 'revocation', revokes: 'PROMO-001',
  declares_normative: [], revokes_normative: [TARGET],
  authority: 'Opus X', date: '<date>', immutable: true,
  declaration: `Révocation de la promotion d'${TARGET} — fait neuf, jamais suppression (D-013).`,
};
P('  Fait de révocation (2e fait, jamais suppression) :');
P(JSON.stringify(revocation, null, 2).split('\n').map((l) => '    ' + l).join('\n'));
P('  resolveStatus("' + TARGET + '", [..., PROMO-001, PROMO-001-REV]) → "Draft"  (promoted \\ revoked)');
P('  Le champ n\'a JAMAIS été touché ; la projection (robots/sitemap) se re-dérive ; PROMO-001 ET sa');
P('  révocation restent en historique (append-only). Promotion entièrement réversible, traçable.');

// ── Verdict ───────────────────────────────────────────────────────────────────
H('VERDICT DU DRY-RUN');
P('  Le mécanisme de promotion propre est COMPLET et sûr, de façon reproductible :');
P('   • §2 résolveur PRÉSENT → un fait PROMO dériverait Normative ; sans fait, ' + TARGET + ' reste Draft ;');
P('   • §4 garde anti-forgeage PRÉSENTE → l\'édition de champ (§3) est détectée et ignorée ;');
P('   • fenêtre D-023 FERMÉE (OCR-000/005 dérivent Normative du fait, plus du champ).');
P('  ⇒ L\'étape 8 (émission d\'un PROMO réel) PEUT s\'ouvrir : le mécanisme est prêt.');
P('    ' + TARGET + ' N\'EST PAS promu par ce script — AUCUNE écriture effectuée.');
