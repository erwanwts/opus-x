# OCR-GROUND-001 — Rapport de grounding · PASSE F6 (Trust & Registry) — clôture des familles

**Records : OCR-105 · OCR-106 · OCR-124 · OCR-000 · OCR-001 · OCR-002 · OCR-003 · OCR-004 · OCR-005 · Sources @`b3aec9e` · lecture seule · aucune connexion DB.**

## Principe fondamental (rappel)
> Le **World Skills Protocol** (les OCR) est la **CIBLE NORMATIVE** ; le code est une implémentation **VERSIONNÉE**. Le grounding **MESURE** l'écart, il ne rabaisse **jamais** le protocole au code. Un concept peut être **Normative ET non encore implémenté** (**Backlog Code**).

## Grille G0–G4 · Règle d'or
G0 conforme · **G1 impl. en retard → BACKLOG** · G2 tech debt · G3 doc ambiguë → OCR-REV *(rare)* · G4 gouvernance. **Un G1 ne devient jamais OCR-REV.**

---

# PARTIE A — TRUST (105 / 106)

## A1 — Existe-t-il un moteur de calcul du Trust ?
**NON.** Aucun code de calcul, aucune table `wsp_trust`, `trust_events`, `trust_history`, `trust_policy`, `trust_credits`. Le seul « trust » en base = `trust_index` (Sprint-1 : `score NULL`, `state 'establishing'`, `computed_at NULL`) — **placeholder d'UI jamais alimenté**.
→ **G1 — BACKLOG PROTOCOL IMPLEMENTATION** (pas une erreur documentaire).

**Point de cohérence (souligné)** : le garde-fou **W1** de l'ingestion **INTERDIT** tout champ `trust|confidence|certif|score|index` dans l'Evidence (`wsp_has_forbidden_field`, 000005 étape 4). Donc la séparation fondatrice « **Evidence ne porte pas de trust ; Evidence est l'input, Trust est l'output** » est **CODÉE et CORRECTE (G0)**. Le protocole est respecté ; **seul le calcul manque**. C'est un socle sain pour construire le moteur.

- **Entrées attendues** (105) : faits immuables liés à un Opus ID (`wsp_evidence` par `subject_id` — **existe, G0**) + version de Framework applicable (`wsp_framework_versions`/`wsp_skill_levels` — **existe, G0**).
- **Sorties attendues** : Trust Status (valeur dérivée) — **absente** (le libellé Sprint-1 `trust_index.state` existe mais n'est **pas calculé**).
- **Maturité réelle** : **0** (aucune fonction de calcul). Inputs **prêts**, moteur **à écrire**.

## A2 — Carte des dépendances / ordre de construction (LIVRABLE CLÉ)
Trust est le **sommet de la pyramide** : ses inputs de base sont G0, mais sa computation est en aval de plusieurs G1.

```
   [G1]  Trust Status (106)  ← [G1] Trust computation (105, moteur)
                                     ▲
            ┌────────────────────────┼───────────────────────────┐
   [G1] Verification path (107/108/109)   [G1] Competency/Capability (117/118)
            ▲                                      ▲
   [G1] Framework Registry mapping (119, criterion→coordinate)
            ▲
   ─────────────── BASE DÉJÀ RÉELLE (G0) ───────────────
   [G0] Evidence / Immutable Fact (110/114, append-only + digest)
   [G0] Framework version + niveaux (115, wsp_skill_levels)
   [G0] Opus ID + binding des faits (104, wsp_evidence.subject_id)
   [G0] Intégrité (113, JCS + recompute + constant-time)
   [G0] Séparation Evidence≠Trust (W1)
```
**Ordre de construction recommandé** : (1) Registry mapping (119) → (2) Verification path (107-109) → (3) Trust computation (105) → (4) Trust Status (106) → surfacé par Passport/Identity (101/102, F5) & reflété par Response (109, F4). Competency/Capability (117/118) selon la décision entité-vs-concept.

## A3 — Sous-concepts : EXISTE (code) / DÉCRIT (OCR) / ABSENT
| Sous-concept | Statut |
|---|---|
| **Trust** (computation) | **DÉCRIT** (105) · **ABSENT** du code → G1 |
| **Trust Status** (valeur) | **DÉCRIT** (106) · libellé Sprint-1 `trust_index.state` **existe mais non calculé** → G1 |
| **Trust Engine** (fonction) | **DÉCRIT** (105/106, 001 le réserve en couche 200s) · **ABSENT** du code → G1 |
| **Trust History** | **NI décrit distinctement** (implicite via recomputation) **NI codé** → **VISION GAP** |
| **Trust Credits** | **NI décrit NI codé** → **VISION GAP** |
| **Trust Policies** | **effleuré** (105 gouvernance : « recomputation = governed policy ») · pas un concept distinct · non codé → à préciser (VISION GAP) |
| **Trust Events** | **NI décrit NI codé** → **VISION GAP** |

## Consolidation Trust (rattachements déjà signalés — non recomptés)
Trust = **la couche aval commune manquante**, déjà rattachée en **F2-03** (standing Capability), **F4** (reflet dans la Response), **F5** (surfacé par l'identité). Traité **une seule fois** : **G1 BACKLOG PROTOCOL IMPLEMENTATION**. **0 BLOCKER** (l'absence de moteur n'est pas une faille ; la séparation Evidence≠Trust est tenue).

**Verdicts** : **OCR-105 Trust = G1 BACKLOG PROTOCOL** · **OCR-106 Trust Status = G1 BACKLOG PROTOCOL** (badge « planifié » au rendu ; OCR inchangés — ils décrivent correctement la cible).

---

# PARTIE B — REGISTRY (124 + 000-005) : PROCESS vs RUNTIME

**Distinction fondamentale.** Une gouvernance **non codée EXISTE quand même** → **G0-en-process**. On ne classe **pas** G1 une réalité de process.

| OCR | Nature | Grounding |
|---|---|---|
| **124 Canonical Registry** | le corpus-standard (32 OCR, 1 concept/OCR, versionné 1.0.0, tous Draft, layered 000-005/100s, Markdown autoritaire + dérivés) | **G0-en-process** — le corpus EXISTE (committé, `_manifest.json`, générateur). Le **runtime** (registre/graphe interrogeable) = **WEB-003C** (futur, PAS un G1-défaut). La règle « Normative ⟺ implémentation » est **respectée** : tous Draft (le grounding montre des G1/G3 → aucun promu prématurément). |
| **000 Canonical Knowledge Governance** | la **constitution** : autorité Opus X, status model, **règle de grounding** | **G0-en-process** — **OCR-GROUND-001 EST 000 en action**. La grille G0-G4 raffine « corriger ce qui est faux » : G1 (code incomplet → backlog, OCR intact) vs G3 (OCR faux → OCR-REV). **Cohérent, non contradictoire.** |
| **001 Registry Structure** | numérotation/couches, 1 concept/OCR, structure, **formats de sortie** | **G0-en-process** — le corpus conforme (100s + 000-005 méta, sections canoniques, Markdown autoritaire + 7 dérivés). Le **générateur §9** matérialise la règle des formats. **Cross-check** : 001 réserve le **« trust engine » en 200s** (mécanismes) et l'**« evidence graph » en 200s** → cohérent avec Trust G1 et graphe = WEB-003C. |
| **002 Editorial Rules** | register RFC/W3C, keywords RFC 2119, no-marketing, Counter Examples/Anti Patterns, ids synthétiques | **G0-en-process** — les 32 OCR conformes (register formel, MUST/SHOULD, `ev_01K…` synthétiques, Counter Examples + Anti Patterns présents). |
| **003 Terminology Governance** | 1 définition autoritaire/terme, synonymes / **anti-synonymes**, pas de redéfinition | **G0-en-process** — chaque OCR porte Canonical Vocabulary + Synonyms + **Anti Synonyms** (ex. *reputation* ≠ Trust, *credential* ≠ Evidence). Cohérent avec le lexique verrouillé (CLAUDE.md). |
| **004 Entity Relationships** | vocabulaire de prédicats + **invariants de graphe** (séparations directionnelles, cohérence bidirectionnelle, pas de cycles, immutabilité réflexive) | **G0-as-spec** — **cohérente** (prédicats + invariants clairs), **applicable** (chaque OCR a Relationships + KG Relationships), **consistante** (les invariants MATCHENT mes findings : Trust `consumes` Evidence, Issuer `produces`, identité jamais `owned_by` Issuer). **Runtime = WEB-003C.** |
| **005 Versioning Rules** | semver, transitions de statut, **no-silent-edits**, journal des changements | **G0-en-process** — tous à 1.0.0, Version History présent, **on n'édite jamais un OCR** (grounding read-only), corrections = OCR-REV (nouvelle version). Discipline strictement suivie. |

## Observation SPEC sur OCR-004 (input WEB-003C, pas un défaut)
Le vocabulaire **normatif** de 004 = **9 prédicats de base** (`is_a, part_of, depends_on, produces, consumes, references, extends, supersedes, related_to`). Or les OCR de concept utilisent **~30+ prédicats de domaine** (`bound_to, surfaces, anchors, computed_for, attributes_to, clusters, composes, produces_when_issuer, holds`, …). 004 prévoit « … » + extension par gouvernance → **anticipé, non énuméré**. → **Prérequis WEB-003C** : figer le **registre complet de prédicats** avant de construire le graphe. **Pas un G3** (004 permet l'extension).

**Verdicts Registry** : **124/000/001/002/003/005 = G0-en-process** · **004 = G0-as-spec** (avec l'input WEB-003C ci-dessus). **Le Registry est une réalité G0 au niveau process ; seul son runtime (graphe) est futur (WEB-003C).**

---

## OCR-100 — World Skills Protocol (l'ombrelle, groundé au niveau synthèse)
Non couvert par une passe de famille dédiée (31/32 en familles). Grounding agrégé : *« Evidence Is Produced » = **G0*** (fact store append-only, ingestion) · *« Trust Is Verified » = **G1*** (Trust/Verification absents) · **séparation des pouvoirs = G0** (RLS ownership, append-only, W1 no-trust-in-evidence, W7 neutralité Issuer). → **OCR-100 = mixte : socle produce/identité/séparation G0 ; moitié verify/trust G1.**

## Posture
- Aucune modif **code / OCR / Drive** ; **aucune connexion DB** ; les 9 Records **inchangés** ; **aucun commit** avant validation.
- **STOP** : `MANIFEST-OCR.json` **non produit** (étape d'après).
