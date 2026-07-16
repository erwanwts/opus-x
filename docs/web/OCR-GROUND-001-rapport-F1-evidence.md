# OCR-GROUND-001 — Rapport de grounding · PASSE F1 (famille Evidence)

**Records : OCR-111 · OCR-112 · OCR-113 · OCR-114 · Sources @`b3aec9e` · 3 couches · lecture seule · aucune connexion DB.**
Récurrences des GAP du pilote **référencées, non recomptées**. **Aucun BLOCKER** (invariants durs d'immutabilité/sécurité tenus par le code).

## Nouveaux écarts F1 (format §4)

```
GAP-F1-01   (OCR-112 State Machine · OCR-114 State Machine/Status)
  ocr:               OCR-112 Evidence Lifecycle ; OCR-114 Immutable Fact
  section:           State Machine / Protocol Rules / Conceptual Model
  affirmation:       "Active → Superseded" ; status ∈ {active, superseded, revoked} ; "A correction MUST be expressed as a superseding fact"
  source_normative:  aucune décision gelée fournie sur la supersession
  source_code:       ABSENTE — aucun mécanisme de supersession dans supabase/migrations/** (ni colonne status/superseded_by sur wsp_evidence, ni table de supersession). Seule la RÉVOCATION existe (wsp_fact_revocations, fact_store l.230). @b3aec9e
  classification:    Écart (nature NON tranchée — voir décision_humaine)
  criticité:         MAJOR
  recommandation:    Constater : révocation implémentée, supersession NON. NE PAS trancher la nature (Écart d'implémentation « à coder » vs Ungroundable « couche absente ») — remontée comme QUESTION. Ne rien modifier.
  décision_humaine:  PRISE
  → DÉCISION CONSIGNÉE: Écart d'implémentation. La supersession est À CODER (chantier code séparé, hors WEB-003). OCR-112/114 INCHANGÉS. Contrainte gravée : tant que non codée, 112/114 NON-promouvables en Normative. → BACKLOG CODE (pas OCR-REV).
```
```
GAP-F1-02   (OCR-111 Protocol Rules · OCR-114 Protocol Rules/Machine Interpretation)
  ocr:               OCR-111 Evidence Source ; OCR-114 Immutable Fact
  section:           Protocol Rules / Machine Interpretation
  affirmation:       "Source references MUST be referentially intact; deletion of a depended-upon source MUST be refused (ON DELETE RESTRICT)" ; sources: ["mission_order_evidence:<id>","mission_results:<id>"]
  source_normative:  hypothèse mémoire §2 S5 (ON DELETE RESTRICT → mission_order_evidence/mission_results) — RÉFUTÉE (comme au pilote)
  source_code:       ABSENTE — 0 occurrence de mission_order_evidence/mission_results/ON DELETE RESTRICT ; la provenance réelle = wsp_evidence.provenance_kind/provenance_id (TEXT, NOT NULL, W4, fact_store l.95-97) + ingestion étape 5 (missing_provenance) — texte, PAS de FK ni de garde ON DELETE RESTRICT. @b3aec9e
  classification:    Écart documentaire (Ungroundable — tables/FK source manquantes)
  criticité:         MAJOR
  recommandation:    L'attribution EST obligatoire (provenance NOT NULL, Issuer FK) → cette partie est Conforme ; mais l'intégrité référentielle « source non supprimable » (ON DELETE RESTRICT vers mission_*) N'EXISTE PAS. Jumeau source de GAP-3. Décider : implémenter, ou reformuler l'OCR. Ne rien modifier.
  décision_humaine:  PRISE
  → DÉCISION CONSIGNÉE: Écart d'implémentation. ON DELETE RESTRICT vers mission_* est À CODER (même couche mission que GAP-3 pilote). OCR-111/114 INCHANGÉS. → BACKLOG CODE.
```
```
GAP-F1-03   (OCR-113 Machine Interpretation / Protocol Rules / Governance)
  ocr:               OCR-113 Evidence Integrity
  section:           Protocol Rules / Machine Interpretation / Conceptual Model
  affirmation:       "keyed HMAC authentication … over the canonical bytes" ; "digest": "<hmac-over-jcs-canonical-bytes>" ; "Authentication MUST bind content to the Issuer via keyed HMAC"
  source_normative:  aucune
  source_code:       lib/wsp/canonical.ts:84 (canonical_hash = createHash('sha256') sur JCS — NON keyé) ; le HMAC réel = lib/issuer/hmac.ts:24 (createHmac sur `${timestamp}.${payload}` — authentification de TRANSPORT du corps brut, pas de la forme canonique) ; ingestion étape 1 HMAC (transport) + étape 7 compare le SHA-256 recalculé. @b3aec9e
  classification:    Écart documentaire
  criticité:         MAJOR
  recommandation:    Corriger la caractérisation : l'INTÉGRITÉ de contenu = SHA-256 (non keyé) sur JCS, recalculé + comparé temps-constant ; le HMAC authentifie le TRANSPORT (timestamp.body), il ne « keye » pas le digest canonique. Ne rien modifier (action différée à une REV d'OCR-113).
  décision_humaine:  PRISE
  → DÉCISION CONSIGNÉE: Écart documentaire. Reformuler OCR-113 pour distinguer INTÉGRITÉ (SHA-256 sur JCS, recompute+constant-time) et AUTHENTIFICATION TRANSPORT (HMAC sur timestamp.body). Action différée → OCR-REV. OCR-113 non modifié ici. → BACKLOG OCR-REV.
```

## Récurrences des GAP du pilote (référencées, NON recomptées)

- **cohérent avec GAP-1** (exemple JSON à aligner sur le schéma réel) : blocs *Machine Interpretation*/*JSON-LD* de 111 (`sources`, `referential_integrity`), 112 (`stages`/`immutability_boundary` — conceptuel), 113 (`hmac-over-jcs…`), 114 (`passport_update_id`, `constraints`).
- **cohérent avec GAP-3** (lien Passport 1:1 non imposé) : 112 (« exactly one linked Passport update », étape 7 *Linking*) et 114 (« UNIQUE(passport_update_id) », « each fact links to exactly one Passport update »). Aucun `passport_update_id` dans le versionné.
- **cohérent avec GAP-4** (émetteur absent → Ungroundable/INFO) : états **pré-acceptation** — 111 `Captured`, 112 `Observed/Created/Authenticated/Submitted`, 113 `Unverified` — côté **Issuer**, hors de ce repo. Le repo grounde la **réception** (`Submitted→Accepted/Rejected`). **INFO**, pas MAJOR.

## Affirmations CONFORMES (couche 3 ⊨ couche 2) — points forts par Record

- **111** : provenance obligatoire + attribution Issuer + facts jamais anonymes → `wsp_evidence.issuer_id` (FK), `attested_by_*`, `provenance_kind/_id` NOT NULL, ingestion étape 5. Provenance préservée/non mutée → append-only. **Conforme** (hors GAP-F1-02).
- **112** : verification MUST precede acceptance ; unverified MUST NOT be accepted ; rejection terminale sans fait ; ordre §8 non réordonnable → `wsp_ingest_evidence` (ordre étapes 1→10, `raise` avant insert). **Conforme** (réception ; hors supersession/lien Passport).
- **113** : intégrité sur JCS/RFC 8785 + recompute + compare **temps-constant** → `canonical.ts` + `route.ts:66` + `wsp_ct_eq` (l.115/178) ; **stabilité Unicode prouvée** → `canonical.test.ts` (`é`, `€`, contrôle) ; **idempotence** → ingestion étape 9 + `wsp-ingestion.integration.test`. **Conforme** (hors GAP-F1-03).
- **114** : no UPDATE/DELETE imposé au **niveau stockage** (service_role inclus) → triggers `wsp_reject_mutation` (UPDATE/DELETE + TRUNCATE) ; révocation = fait neuf préservé → `wsp_fact_revocations`. **Conforme fort** (hors supersession, lien Passport, source-FK).

## Verdicts par OCR

| OCR | Verdict |
|---|---|
| **OCR-111 Evidence Source** | Écarts (0 BLOCKER · **1 MAJOR** = GAP-F1-02 · récurrences GAP-1/GAP-4 INFO). Attribution/provenance **Conforme** ; intégrité référentielle source **absente**. Non promouvable jusqu'à arbitrage. |
| **OCR-112 Evidence Lifecycle** | Écarts (0 BLOCKER · **1 MAJOR** = GAP-F1-01 supersession · récurrences GAP-3/GAP-1/GAP-4). Réception (ordre, verify-before-accept, rejet terminal) **Conforme**. |
| **OCR-113 Evidence Integrity** | Écarts (0 BLOCKER · **1 MAJOR** = GAP-F1-03 HMAC≠SHA-256 · récurrence GAP-1/GAP-4). Cœur intégrité (JCS+recompute+constant-time+Unicode+idempotence) **Conforme**. |
| **OCR-114 Immutable Fact** | Écarts (0 BLOCKER · **2 MAJOR** = GAP-F1-01 supersession + GAP-F1-02 source-FK · récurrences GAP-3/GAP-1). Immutabilité/append-only **Conforme fort**. |

## Registre CONFLIT (F1)

**Aucun nouveau CONFLIT couche-vs-couche.** (Le CONFLIT-1 du pilote — cardinalité criterion_levels — n'est pas re-déclenché par 111-114.) GAP-F1-01/02/03 sont des écarts OCR↔code (documentaire / nature à trancher), pas des contradictions entre décision gelée et OCR.

## Décisions F1 — PRISES (consignées) et réparties en backlogs

Les 3 GAP MAJOR de F1 sont **arbitrés** (décisions humaines prises). Répartition :

### → BACKLOG CODE (chantiers de code séparés, hors WEB-003 ; OCR INCHANGÉS)
- **GAP-F1-01 — Supersession** (112, 114) : Écart d'**implémentation**. La supersession est **à coder**. Contrainte gravée : tant que non codée, **OCR-112/114 non-promouvables en Normative** (décrivent un mécanisme non encore réel).
- **GAP-F1-02 — `ON DELETE RESTRICT` vers `mission_*`** (111, 114) : Écart d'**implémentation**. La contrainte référentielle source est **à coder** (même **couche mission** que le **GAP-3** du pilote).

### → BACKLOG OCR-REV (reformulation d'OCR ; différé, aucune modif ici)
- **GAP-F1-03 — keyed-HMAC** (113) : Écart **documentaire**. Reformuler OCR-113 pour distinguer **INTÉGRITÉ** (SHA-256 sur JCS, recompute + constant-time) et **AUTHENTIFICATION TRANSPORT** (HMAC sur `timestamp.body`).

*(Rappel — GAP du pilote, seulement référencés ici, déjà décidés : GAP-1 exemples JSON → **OCR-110-REV-01** [BACKLOG OCR-REV] ; GAP-3 lien Passport 1:1 « prévu, non imposé » → **BACKLOG CODE** [couche mission, jumeau de GAP-F1-02] ; GAP-4 émetteur Ungroundable/INFO.)*

## Posture

- Aucune modif **code / OCR / Drive** ; **aucune connexion DB** ; les 4 Records **inchangés**.
- **STOP F1** : F2-F6 **non déroulés** ; `MANIFEST-OCR.json` **non produit**.
