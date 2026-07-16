# OCR-GROUND-001 — Rapport de grounding · PASSE F2 (famille Framework)

**Records : OCR-115 · OCR-119 · OCR-116 · OCR-117 · OCR-118 · Sources @`b3aec9e` · 3 couches · lecture seule · aucune connexion DB.**

## Principe fondamental (rappel en tête de chaque rapport)

> Le **World Skills Protocol** (les OCR / Canonical Registry) est la **CIBLE NORMATIVE** du système. Le code en est une implémentation **VERSIONNÉE**. Le grounding **MESURE** l'écart, il ne rabaisse **jamais** le protocole au niveau du code. Un concept peut être **Normative ET non encore implémenté**, à condition que ce soit explicitement indiqué et classé **Backlog Code**.

## Grille de classification G0–G4 (décision d'architecte — remplace la classification précédente)

| Code | Signification | Action |
|---|---|---|
| **G0** | Conforme | aucune action |
| **G1** | **Implémentation en retard** (protocole = cible, code incomplet) | **BACKLOG CODE** |
| **G2** | Dette technique (code conforme au protocole mais à améliorer) | TECH DEBT |
| **G3** | Dette documentaire (le protocole lui-même est ambigu/incohérent) | OCR-REV *(rare)* |
| **G4** | Décision de gouvernance (le protocole ne tranche pas encore) | ARCH DECISION |

**RÈGLE D'OR** : ne **jamais** transformer un G1 en OCR-REV. On ne corrige un OCR **que** si l'OCR a un défaut (G3).

**CONTRAINTE DE PUBLICATION** : tout Record classé **G1** (Normative non implémenté) devra, au rendu du site, porter une **mention explicite** de son statut d'implémentation (badge « planifié / non encore implémenté »). **Ne jamais présenter un concept non codé comme une capacité actuelle.**

---

## Hypothèses du mandat — vérifiées contre le code

| Hypothèse §2 S2 | Verdict |
|---|---|
| **Niveaux DANS le Framework** (pas Evidence/mapping/Issuer) | **G0 CONFORME** — `wsp_skill_levels` (4 niveaux + bandes d'observation), versionnés, publiés par Opus X ; ingestion impose `claimed_level ∈ niveaux publiés` (FK `wsp_skill_levels`). **Invariant conceptuel majeur validé.** |
| framework id = `wtf` | **Nuance** — id canonique = `framework:wtf` ; `wtf` = slug ; `wtf:212` = entrée `wsp_skills` (V1). |
| `wsp_skill_mappings` seed = 4 lignes S03.C08… → wtf:212 | **Non implémenté** — table absente (voir GAP-F2-01, G1). |
| Aucun niveau dans le mapping | Sans objet (pas de table) ; le **principe** (niveaux dans le Framework) est tenu par `wsp_skill_levels`. |

## Affirmations CONFORMES (G0) — points forts de la famille

- **Niveaux définis par le Framework, publiés par Opus X, jamais dans l'Evidence ni par l'Issuer** (115/116/117/118) → `wsp_skill_levels` + FK ingestion + `wsp_evidence_demonstrates_skill`. **G0.**
- **Framework versionné, append-only, pas de mutation en place, deprecation, seul Opus X publie** (115) → `wsp_frameworks`/`wsp_framework_versions` + triggers `wsp_reject_mutation` + `status ∈ {published,deprecated}` + RLS. **G0.**
- **Skill/coordonnée référencée, jamais embarquée ; l'Issuer référence, ne définit pas** → ingestion impose le niveau réclamé ∈ niveaux publiés ; W-rules. **G0.**

## Écarts F2 — classés sous la grille (format §4)

> Cadrage : les Records ci-dessous sont **Normative (cible)** ; le code est une **implémentation V1 simplifiée**. Les écarts sont des **G1 (implémentation en retard)** → **BACKLOG CODE**. **Aucun** n'est un défaut d'OCR ; **aucun** ne devient OCR-REV.

```
GAP-F2-01   (OCR-119 cœur · référencé par 115/116/117)
  ocr:               OCR-119 Framework Registry
  section:           Canonical Definition / Machine Interpretation
  affirmation:       couche de résolution criterion→coordinate ; mapping wsp_skill_mappings (4 lignes S03.C08·S08.C06·S05.C08·S02.C12 → wtf:212)
  source_code:       ABSENTE — 0 table wsp_skill_mappings (seul un commentaire en 20260713000001_wsp_framework.sql l.30). Résolution réelle = FK directe wsp_skills ; observation.criteria = chaînes libres non résolues. @b3aec9e
  classification:    G1 — Implémentation en retard (couche registry/mapping non encore construite)
  action:            BACKLOG CODE — construire la table/couche de résolution criterion→coordinate.
  note:              Racine commune avec GAP-1/GAP-2 du pilote : les critères S03.C08… n'existent qu'en exemple OCR. L'alignement du CODE vers la cible canonique est prévu ; l'OCR N'EST PAS corrigé.
  décision:          PRISE (G1)
```
```
GAP-F2-02   (OCR-116 Skill · OCR-117 Competency · OCR-118 Capability — taxonomie 3-tiers)
  ocr:               OCR-116/117/118
  section:           Canonical Definition / Conceptual Model / Machine Interpretation
  affirmation:       taxonomie Skill (S03.C08) → Competency (wtf:212) → Capability, entités distinctes
  source_code:       Implémentation V1 SIMPLIFIÉE — un seul tier `wsp_skills` (seedé `wtf:212`) + `wsp_skill_levels` ; pas de tables Competency/Capability ; pas d'entités Skill-critère S03.C08. @b3aec9e
  classification:    G1 — Implémentation en retard (protocole = cible 3-tiers ; code = V1 tier unique)
  action:            BACKLOG CODE — alignement vers la taxonomie canonique (Skill/Competency/Capability) prévu.
  note:              Records 115/116/117/118 = Normative, non encore implémentés en l'état. NE PAS corriger les OCR. Le décalage « wtf:212 = Skill en code vs Competency en OCR » est un artefact de la V1 simplifiée, pas un défaut d'OCR.
  décision:          PRISE (G1)
```
```
GAP-F2-03   (OCR-118 Capability — standing via Trust)
  ocr:               OCR-118 Capability
  section:           Protocol Rules / Machine Interpretation / State Machine
  affirmation:       "A Capability's standing MUST be computed from underlying attested facts … via Trust (OCR-105)"
  source_code:       ABSENTE — couche de calcul de Trust (O3/O4) non construite ; « le Registry enregistre, il ne calcule jamais ». @b3aec9e
  classification:    G1 — Implémentation en retard (couche Trust non encore construite)
  action:            BACKLOG CODE — couche Trust (grounding fin = famille F5, OCR-105/106).
  décision:          PRISE (G1)
```

## Récurrences (référencées, non recomptées)

- **GAP-1** (exemples JSON de 110/115/116/117/119 : `framework.id:"wtf"` vs `framework:wtf`, `version:"1.0.0"` vs `0.1`, critères S03.C08 fictifs, « skills = criteria »). **À réviser sous la grille au moment d'OCR-REV** : les parties décrivant la **cible canonique** (mapping, coordonnée, taxonomie) sont **G1** (le code s'aligne) ; seules d'éventuelles **imprécisions propres à l'exemple** (ex. numéro de version documentaire injecté dans un champ de version de Framework) relèveraient de **G3**. Ne pas préjuger ; ne pas corriger d'OCR ici.
- **Supersession de version** (State Machines 115/116/117/118 : `… → Superseded`) : le code n'a que `status ∈ {published, deprecated}`. **G1** (aligné à la décision F1-01 : supersession à coder). Noté, non recompté.

## Verdicts par OCR (sous la grille)

| OCR | Verdict |
|---|---|
| **OCR-115 Framework** | **G0** sur l'invariant majeur (niveaux dans le Framework, versioning/append-only, Opus X publie) · **G1** sur la résolution registry (GAP-F2-01) et la supersession de version. Record Normative ; implémentation V1 sur ces points. |
| **OCR-119 Framework Registry** | **G1** — Record Normative décrivant la couche de résolution/mapping **non encore construite** (GAP-F2-01). Alignement code prévu ; OCR inchangé. |
| **OCR-116 Skill** | **G0** (« Skill défini par Framework, niveaux dans le Framework ») · **G1** sur le tier/entité (V1 = `wsp_skills` seedé `wtf:212` ; taxonomie canonique à venir). |
| **OCR-117 Competency** | **G1** — entité Competency Normative, non encore implémentée (V1 tier unique). BACKLOG CODE. |
| **OCR-118 Capability** | **G1** — entité Capability + standing via Trust, non encore implémentées (GAP-F2-02, GAP-F2-03). BACKLOG CODE. |

## Registre CONFLIT (F2)

**Aucun CONFLIT sous la grille.** Le décalage taxonomie/registry OCR↔code n'est **pas** un conflit couche-vs-couche à arbitrer : c'est une **implémentation en retard (G1)** — le protocole est la cible, le code s'aligne. (Le protocole n'est jamais rabaissé au niveau du code.)

## Répartition sous la grille

### → BACKLOG CODE (G1 — implémentation en retard ; OCR INCHANGÉS)
- **GAP-F2-01** — couche de résolution `wsp_skill_mappings` (criterion→coordinate) à construire.
- **GAP-F2-02** — taxonomie canonique Skill/Competency/Capability (3 tiers) à implémenter ; V1 = tier unique.
- **GAP-F2-03** — couche Trust (standing des Capabilities) à construire (F5).
- **Supersession de version** (rappel F1-01) — à coder.

### → OCR-REV (G3 — rare ; UNIQUEMENT si l'OCR est réellement défectueux)
- **Aucun** nouvel item F2. *(Rappel : la nature de **F1-03** [keyed-HMAC] sera **révisée sous la grille au moment d'OCR-REV** — G3 seulement si l'OCR-113 est réellement ambigu ; sinon G1. GAP-1 : idem, réexamen au moment d'OCR-REV.)*

## Contrainte de publication (gravée)

Tout Record F2 classé **G1** — **OCR-115, OCR-116, OCR-117, OCR-118, OCR-119** sur les points non implémentés — devra, au rendu du site, porter une **mention explicite de statut d'implémentation** (badge « planifié / non encore implémenté »). Un concept non codé **n'est jamais** présenté comme une capacité actuelle.

## Posture

- Aucune modif **code / OCR / Drive** ; **aucune connexion DB** ; les 5 Records **inchangés**.
- **STOP F2** : F3 **non lancée** ; `MANIFEST-OCR.json` **non produit**.
