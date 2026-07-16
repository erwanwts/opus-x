# OCR-GROUND-001 — Rapport de grounding · PASSE F4 (Verification)

**Records : OCR-107 · OCR-108 · OCR-109 · Sources @`b3aec9e` · 3 couches · lecture seule · aucune connexion DB.**

## Principe fondamental (rappel en tête de chaque rapport)

> Le **World Skills Protocol** (les OCR / Canonical Registry) est la **CIBLE NORMATIVE** du système. Le code en est une implémentation **VERSIONNÉE**. Le grounding **MESURE** l'écart, il ne rabaisse **jamais** le protocole au niveau du code. Un concept peut être **Normative ET non encore implémenté**, à condition que ce soit explicitement indiqué et classé **Backlog Code**.

## Grille de classification G0–G4

| Code | Signification | Action |
|---|---|---|
| **G0** | Conforme | aucune action |
| **G1** | **Implémentation en retard** (protocole = cible, code incomplet) | **BACKLOG CODE** |
| **G2** | Dette technique (code conforme au protocole mais à améliorer) | TECH DEBT |
| **G3** | Dette documentaire (le protocole lui-même est ambigu/incohérent) | OCR-REV *(rare)* |
| **G4** | Décision de gouvernance (le protocole ne tranche pas encore) | ARCH DECISION |

**RÈGLE D'OR** : ne **jamais** transformer un G1 en OCR-REV. On ne corrige un OCR **que** si l'OCR a un défaut (G3).
**CONTRAINTE DE PUBLICATION** : tout Record classé **G1** portera au rendu du site une **mention explicite** de statut d'implémentation (badge « planifié / non encore implémenté »).

---

## Lecture en DEUX temps : garanties (G0) vs chemin (G1)

### A. Garanties de vérifiabilité — RÉELLES dans le modèle (G0)
- **Issuer-independence** : faits **append-only** + **digest stocké** (`wsp_evidence.canonical_hash`) + **attribution** (`issuer_id`) → un fait est **re-vérifiable sans que l'Issuer soit en ligne** (forward-only acté en F3). Propriété **réelle**.
- **Recompute d'intégrité** : `lib/wsp/canonical.ts:canonicalHash` + comparaison temps-constant `wsp_ct_eq` — **prouvés** (chemin d'ingestion, pilote). Briques réutilisables.
- **Scoping consentement** : `wsp_consent_active` (event-sourced, F3) — **codé**.
- **Statut** : `wsp_fact_revocations` (F1) — **codé** (données de révocation présentes).
- **Non-mutation** : garantie par l'append-only. **G0.**

### B. Chemin de vérification tierce — NON CONSTRUIT (G1 BACKLOG CODE)
Aucun **endpoint** ni **objet** : pas de `Verification Request`, pas de `recompute-au-read`, pas de **scoping consentement de vérification**, pas de `Verification Response` point-in-time, pas de **reflet de statut** dans une réponse. Les routes existantes (`passports/[handle]` = divulgation whitelistée 404-par-défaut ; `me/*` = lectures du sujet) **ne sont pas** des vérifications.

## 0 BLOCKER — vérifié et acté

L'absence d'endpoint de vérification **n'est PAS une faille** : les faits sont stockés **avec intégrité** et **attribuables**, la non-mutation est garantie. C'est une **couche à assembler (G1)**, **pas un trou de sécurité**. → **0 BLOCKER**.

## Écart F4 (format §4)

```
GAP-F4-01   (OCR-107 · OCR-108 · OCR-109 — la couche Verification)
  ocr:               OCR-107 Verification / OCR-108 Verification Request / OCR-109 Verification Response
  section:           Procedure / Protocol Rules / Machine Interpretation
  affirmation:       endpoint tiers : Request (subject, scope, version) → recompute-au-read (JCS/constant-time) → scoping consentement → Response point-in-time, disclosure-limited, non-credential, reflétant supersession/révocation
  source_code:       ABSENTE — aucun endpoint/objet de vérification (grep exhaustif : le seul match `verif` = lib/auth/AuthService.ts:watchForVerification = email, sans rapport). Briques présentes mais non assemblées en chemin lecture : canonicalHash + wsp_ct_eq (ingestion, pas read), wsp_consent_active, wsp_fact_revocations. @b3aec9e
  classification:    G1 — Implémentation en retard (chemin de vérification tierce non construit ; garanties + briques = G0)
  action:            BACKLOG CODE — assembler l'endpoint Request→recompute-au-read→scope-consentement→Response(point-in-time, statut reflété), en réutilisant les briques G0 prouvées.
  note:              Les GARANTIES (issuer-independence, intégrité, non-mutation, consentement, révocation) sont RÉELLES (G0) ; seul le CHEMIN tierce manque. 0 BLOCKER. Records 107/108/109 = Normative, non implémentés → badge « planifié ». OCR INCHANGÉS (le protocole décrit correctement la cible).
  décision:          PRISE (G1)
```

## Dépendance Trust (rattachement F5/F6)

La **Response « reports computed Trust under Framework version »** (OCR-109) et OCR-107 « reads Trust » dépendent de la couche **Trust (OCR-105/106)** — **non construite** (établi en F2-03). → **G1 rattaché à F5/F6** : le volet « reflet de Trust » de la Verification ne pourra être G0 qu'après implémentation de Trust. Signalé, non recompté séparément.

## Récurrences (référencées, non recomptées)

- **cohérent avec GAP-1** : exemples JSON 107/108/109 (`framework_version: {id:"wtf", version:"1.0.0"}` vs réel `framework:wtf`/`0.1` ; `wtf:212`). Réexamen au lot OCR-REV. Non recompté.

## Verdicts par OCR

| OCR | Verdict |
|---|---|
| **OCR-107 Verification** | **G1 BACKLOG CODE** (acte/chemin de vérification non construit) · **G0** garanties (issuer-independence réelle, recompute prouvé, non-mutation par append-only). **0 BLOCKER.** Badge « planifié ». |
| **OCR-108 Verification Request** | **G1 BACKLOG CODE** (aucun objet/endpoint Request) · **G0** sur la brique qu'il borne (consentement `wsp_consent_active` codé). **0 BLOCKER.** |
| **OCR-109 Verification Response** | **G1 BACKLOG CODE** (aucun objet Response point-in-time) · **G0** sur les données qu'il rapporterait (faits, intégrité, révocation) · **G1 rattaché F5/F6** pour le Trust rapporté. **0 BLOCKER.** |

## Registre CONFLIT (F4)

**Aucun.** Écart = implémentation en retard (G1), ni conflit couche-vs-couche ni défaut d'OCR (les 3 Records décrivent la cible correctement).

## Répartition sous la grille

### → G0 CONFORME (garanties/briques)
Issuer-independence (append-only+digest+attribution), recompute (`canonicalHash`+`wsp_ct_eq`), consentement (`wsp_consent_active`), révocation (`wsp_fact_revocations`), non-mutation.

### → BACKLOG CODE (G1 ; OCR INCHANGÉS)
- **GAP-F4-01** — assembler le chemin de vérification tierce (Request / recompute-au-read / scope / Response / statut).
- **Dépendance Trust** rattachée **F5/F6** pour le reflet de Trust dans la Response.

### → OCR-REV (G3)
- **Aucun** item F4. *(Exemples réexaminés au lot OCR-REV, comme GAP-1.)*

## Liste consolidée `décision_humaine`

- **GAP-F4-01** : décision **PRISE** (G1 BACKLOG CODE). Aucune question ouverte spécifique à F4. *(Rappels transverses : Trust à construire — F5/F6 ; F1-03 keyed-HMAC = G3 à confirmer ; GAP-2 = G3 net.)*

## Contrainte de publication (gravée)

**OCR-107/108/109** porteront au rendu un badge **« planifié / non encore implémenté »** pour le chemin de vérification tierce. On pourra présenter les **garanties** réelles (faits immuables, intégrité recalculable, attribution) mais **jamais** un endpoint « Verify » comme capacité actuelle.

## Posture

- Aucune modif **code / OCR / Drive** ; **aucune connexion DB** ; les 3 Records **inchangés**.
- **STOP F4** : F5 **non lancée** ; `MANIFEST-OCR.json` **non produit**.
