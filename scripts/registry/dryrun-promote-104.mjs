#!/usr/bin/env node
/**
 * DRY-RUN de promotion — OCR-104 (Opus ID) · Draft → Normative.
 *
 * PREUVE, pas répétition. LECTURE SEULE, ZÉRO écriture : ce script ne crée, ne
 * modifie et ne committe RIEN. Il construit en mémoire le fait PROMO-001 qui SERAIT
 * émis, tente la dérivation de statut, et MONTRE le point précis où elle échoue faute
 * de résolveur. Sa sortie est le cahier des charges de l'étape 6.
 *
 * Réexécutable : `node scripts/registry/dryrun-promote-104.mjs`
 */
import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
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

// ── 2. La dérivation qui SUIVRAIT — et où elle échoue ─────────────────────────
H('2. DÉRIVATION — ce qui suivrait, et le point EXACT d\'échec (spec du résolveur)');
P('  Fonction qui DEVRAIT exister (n\'existe pas) :');
P('    resolveStatus(recordId: string, facts: ApprovalFact[]): "Draft" | "Normative"');
P('      LIT    : tous les faits RATIF-* (content/registry/founding/) + PROMO-* (content/registry/promo/)');
P('               + les faits de RÉVOCATION (D-013)');
P('      DÉRIVE : promoted = ∪ declares_normative(faits d\'approbation non révoqués)');
P('               revoked  = ∪ declares_normative(faits de révocation)');
P('               effective = promoted \\ revoked');
P('      REND   : recordId ∈ effective ? "Normative" : "Draft"');
P('      ÉCRIT  : RIEN (dérivation pure — le champ n\'est jamais touché)');
P('');
P('  Ce que la dérivation donnerait pour ' + TARGET + ', SI le résolveur existait :');
P('    facts = [ RATIF-001 (declares {OCR-000,OCR-005}), PROMO-001 (declares {' + TARGET + '}) ]');
P('    resolveStatus("' + TARGET + '", facts) → "Normative"');
P('');
// Le point d'échec : aucune fonction ne dérive ; les lecteurs lisent le champ.
// git grep sort en code ≠ 0 quand il ne trouve rien → on capture proprement (pas de bruit shell).
let resolverHits = '';
try {
  resolverHits = execSync('git grep -l -E "resolveStatus|deriveStatus" -- lib scripts',
    { encoding: 'utf8', cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).trim();
} catch { resolverHits = ''; } // exit ≠ 0 = aucune occurrence
P('  POINT D\'ÉCHEC MESURÉ : aucune implémentation de résolveur.');
P('    git grep resolveStatus|deriveStatus dans lib/,scripts/ → ' + (resolverHits ? resolverHits : '(aucune)'));
P('    Les lecteurs lisent le CHAMP, pas un fait :');
P('      lib/registry/recordPage.ts:115  const status = fields[\'Status\'];');
P('      lib/registry/recordPage.ts:143  const status = fields[\'Status\'] ?? \'\';');
P('      lib/content/geo.ts:294          metadata[\'Status\']');
P('      manifeste lifecycle_status (manifest.mjs → api.ts)');
P('    ⇒ SANS résolveur, PROMO-001 est INERTE : ' + TARGET + ' resterait lu "Draft" partout,');
P('      exactement comme RATIF-001 pour {OCR-000,OCR-005} aujourd\'hui (fenêtre D-023).');

// ── 3. Le champ Status — INCHANGÉ ─────────────────────────────────────────────
H('3. CHAMP Status — resté Draft (la promotion propre ne le touche PAS)');
const md = readFileSync(path.join(ROOT, 'docs/web/registry-import/OCR-100/OCR-104_Opus_ID.md'), 'utf8');
const statusLine = md.split('\n').find((l) => /\|\s*\*\*Status\*\*\s*\|/.test(l));
P('  OCR-104 champ actuel : ' + (statusLine ? statusLine.trim() : '(introuvable)'));
P('  Après une promotion PROPRE : IDENTIQUE (D-022 : statut = projection, jamais authored ; OCR-009 §4).');
P('  CONTRASTE — le chemin INTERDIT encore ouvert (forgeage) :');
P('    lib/registry/recordPage.test.ts:163-164');
P('      raw.replace(\'| **Status** | Draft |\', \'| **Status** | Normative |\')');
P('      → buildRecordPage(promoted).meta.robots === \'index,follow\'');
P('    ⇒ éditer le champ = promotion de facto, sans fait, sans garde. OCR-009 §2 l\'interdit ; rien ne l\'empêche.');

// ── 4. La garde absente (spec de la garde anti-forgeage) ──────────────────────
H('4. GARDE PROMO absente — ce qu\'elle refuserait (spec anti-forgeage)');
P('  Garde qui DEVRAIT exister (n\'existe pas) :');
P('    Pour CHAQUE Record .md : le champ Status authored NE DOIT JAMAIS valoir "Normative"/"Validated".');
P('    Le statut est DÉRIVÉ (résolveur), jamais authored. Un "Normative" authored = FORGEAGE = échec.');
P('    Prouvé par mutation : éditer un champ en "Normative" → la garde échoue en nommant le Record.');
const forge = md.includes('| **Status** | Normative |') || md.includes('| **Status** | Validated |');
P('  État courant OCR-104 : champ Normative/Validated authored ? ' + forge + '  (attendu : false)');
P('  Cette garde FERME recordPage.test:163-164 : le champ ne peut plus porter Normative,');
P('  et le résolveur ignore le champ de toute façon — double fermeture du forgeage.');

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
P('  Le chemin de promotion propre est INCOMPLET, de façon reproductible :');
P('   • §2 résolveur ABSENT → un fait PROMO est inerte (rien ne dérive) ;');
P('   • §4 garde anti-forgeage ABSENTE → l\'édition de champ (§3) promeut sans fait ;');
P('   • fenêtre D-023 = la même cause (statut lu au champ, pas dérivé du fait).');
P('  ⇒ L\'étape 8 NE PEUT PAS s\'ouvrir sans l\'étape 6 (résolveur + garde + fermeture D-023).');
P('  AUCUNE écriture effectuée par ce script.');
