# OCR-GROUND-001 — Rapport de grounding PILOTE · OCR-110 Evidence — **CLOS**

**Sources @`b3aec9e` · méthode 3 couches (§3) · lecture seule · aucune connexion DB (grounding contre migrations versionnées uniquement, addendum §B).**
Décisions humaines **consignées** ; actions différées à `OCR-110-REV-01` (aucune modification d'OCR ni d'artefact dans ce mandat).

## Verdict OCR-110

**Écarts (0 BLOCKER · 3 MAJOR · 1 INFO) — toutes décisions PRISES.**
Invariants durs de sécurité/immutabilité **tenus par le code** (append-only, `criterion_levels` objet, `type:"evidence"` sibling, recompute + compare temps-constant, no-trust-field, ULID). **Non promouvable en Normative** tant qu'`OCR-110-REV-01` (corrections d'OCR décidées) n'est pas appliqué. **Pilote méthodologique validé** (méthode 3 couches + format 9 champs + criticité + générateur/golden).

## Carte des sources (§2) — `fichier:symbole @b3aec9e`

| Domaine | Source réelle |
|---|---|
| Canonicalisation JCS/RFC 8785 + SHA-256 | `lib/wsp/canonical.ts:canonicalHash` (`CANONICALIZATION_ALGORITHM='RFC8785'`, `HASH_ALGORITHM='SHA-256'`) |
| Objet couvert / `criterion_levels` objet | `lib/wsp/evidenceCovered.ts:buildCoveredObject` |
| HMAC (signature de référence) | `lib/issuer/hmac.ts:signIssuerRequest` |
| Ingestion (ordre §8, validations) | `app/issuers/evidence/route.ts:POST` + `supabase/migrations/20260713000005_wsp_ingestion.sql:wsp_ingest_evidence` |
| Fact store (append-only, id `ev_`, CHECK) | `supabase/migrations/20260713000002_wsp_fact_store.sql` |
| Émetteur `evidence-payload.ts` | **ABSENT** (voir GAP-4) |

## Affirmations CONFORMES (couche 3 ⊨ couche 2)

- **Append-only / MUST NOT UPDATE·DELETE** → triggers `wsp_reject_mutation` (UPDATE/DELETE l.260-273 + TRUNCATE l.316-329), *service_role inclus*.
- **`criterion_levels` objet, jamais array** → CHECK `wsp_evidence_observation_shape` (l.124-127) + ingestion l.136.
- **`type:"evidence"` sibling MUST be present** → ingestion l.127.
- **Intégrité sur JCS + recompute + compare temps-constant** → `canonical.ts` + recompute `route.ts:66` + `wsp_ct_eq` (l.115, l.178).
- **Evidence MUST NOT carry trust score/ranking/interpretation** → W1 `wsp_has_forbidden_field` (l.150).
- **Id = ULID préfixé `ev_`** → `wsp_evidence.id default 'ev_'||generate_ulid()` (l.72-73), assigné par Opus X (exclu du hash, §6.2).
- **Correction = supersession ; retrait = révocation, fait préservé** → `wsp_fact_revocations` (fait neuf `rev_`, l.230).
- **Origine Issuer autorisé + Professional existant + Framework résoluble + consentement** → ingestion étapes 1/6/2. (L'état « Certified » relève d'OCR-120/121, à grounder à leur tour.)

## Écarts (format §4) — décisions consignées

```
GAP-1
  ocr:               OCR-110 Evidence
  section:           Machine Interpretation (bloc JSON)
  affirmation:       "{ type:evidence, id:ev_…, protocol_version:1.0.0, framework:{id:wtf,reference:wtf:212}, body:{criterion_levels:{…}}, integrity:{canonicalization:JCS,digest} }"
  source_normative:  aucune décision gelée sur la forme sur le fil
  source_code:       supabase/migrations/20260713000005_wsp_ingestion.sql:wsp_ingest_evidence (étape 3, l.126-145) @b3aec9e
  classification:    Écart documentaire
  criticité:         MAJOR
  recommandation:    Aligner l'exemple sur le schéma d'ingestion réel (schema_version:"1.0" ; champs de tête canonicalization_algorithm/hash_algorithm/canonical_hash ; framework:{id,version}+demonstrates:{skill_id,claimed_level} ; observation.criterion_levels ; id assigné à l'ingestion).
  décision_humaine:  PRISE
  → DÉCISION CONSIGNÉE: corriger l'exemple OCR pour l'aligner sur le schéma réel. Action différée → OCR-110-REV-01.
```
```
GAP-2  (= CONFLIT-1)
  ocr:               OCR-110 Evidence
  section:           Protocol Rules / FAQ #22 / Machine Interpretation
  affirmation:       "An Evidence record MAY reference multiple criteria within a single Framework coordinate." (+ exemple à 4 criterion_levels)
  source_normative:  aucune
  source_code:       supabase/migrations/20260713000005_wsp_ingestion.sql (étape 8, l.184-188 : v_crit_count <> 1 → observation_invalid) @b3aec9e
  classification:    CONFLIT (OCR ↔ code)  →  résolu en Écart documentaire
  criticité:         MAJOR
  recommandation:    Le code (exactement 1 critère) fait foi ; corriger l'OCR.
  décision_humaine:  PRISE
  → DÉCISION CONSIGNÉE (produit, gravée): 1 critère / Evidence. L'OCR sur-promet. Corriger OCR-110 en "exactement un critère par Evidence", RETIRER l'exemple à 4, l'affirmation "MAY reference multiple criteria" et la FAQ #22. Action différée → OCR-110-REV-01.
```
```
GAP-3
  ocr:               OCR-110 Evidence
  section:           Protocol Rules / Security Considerations
  affirmation:       "Every accepted Evidence SHALL be linked to exactly one Passport update; the Evidence Link SHALL enforce this uniqueness."
  source_normative:  hypothèse mémoire §2 S5 (UNIQUE(passport_update_id), ON DELETE RESTRICT → mission_*) — RÉFUTÉE
  source_code:       absente (0 occurrence passport_update_id / lien Passport 1:1) ; unicité réelle = unique(issuer_id, issuer_evidence_id) (fact_store l.117) @b3aec9e
  classification:    Écart documentaire (Ungroundable — lien Passport manquant)
  criticité:         MAJOR
  recommandation:    Reformuler l'OCR.
  décision_humaine:  PRISE
  → DÉCISION CONSIGNÉE: reformuler en "lien Passport 1:1 PRÉVU, non encore imposé (couche Passport-update non construite)" ; noter l'unicité réelle existante (issuer_id, issuer_evidence_id). Action différée → OCR-110-REV-01.
```
```
GAP-4
  ocr:               OCR-110 Evidence
  section:           Grounding note / Machine Interpretation (émetteur)
  affirmation:       littéraux propres à l'ÉMETTEUR (forme émise, id soumis)
  source_normative:  aucune
  source_code:       evidence-payload.ts — INTROUVABLE (ce dépôt = Opus X/ingestion ; émetteur côté Issuer) @b3aec9e
  classification:    Ungroundable — source manquante
  criticité:         INFO
  recommandation:    Grounder côté Issuer plus tard ; ne pas valider contre un fichier inexistant, ne pas réaligner l'OCR.
  décision_humaine:  PRISE (INFO)
  → DÉCISION CONSIGNÉE: reste tel quel, à grounder côté Issuer ultérieurement.
```

## Registre CONFLIT

- **CONFLIT-1 (= GAP-2)** : OCR (multi-criteria) ↔ code (exactement 1). **Résolu** → le code fait foi ; OCR à corriger (`OCR-110-REV-01`).

## Générateur §9 — validé sur le pilote

- `scripts/registry/generate.mjs` (Node pur, `node:fs`+`node:crypto`). Source unique = `OCR-110_Evidence.md`. Chaque dérivé porte `sourceChecksum: sha256:384b6dec3c01d4177354424eb4bfc8ed5540e3b48a3bd90dd2ab6d9aedab0276`.
- **Golden test : 6/6 dérivés texte OCTET-pour-octet** vs `docs/web/OCR-110-golden/` (`OCR-110.json`, `-faq.md`, `-geo.md`, `-llm.md`, `-seo.json`, `-keywords.json`).
- **Échec-sur-divergence prouvé** : source altérée d'1 octet → 6/6 DIFF, exit 1.
- **Section manquante → génération échoue** (FAQ retirée → `Error: section « FAQ » absente`, pas d'invention).
- **PDF** : `OCR-110_Evidence.pdf` présent en golden → **INFO, égalité de CONTENU seulement** (jamais octet — un PDF régénéré diffère toujours en métadonnées). Rendu PDF non exécuté (moteur requis). *DoD du générateur notée ainsi.*

## Actions différées → `OCR-110-REV-01` (hors ce mandat lecture seule)

Corriger OCR-110 : (1) exemple JSON aligné sur le schéma réel ; (2) cardinalité « exactement 1 critère » + retrait exemple 4 / FAQ #22 / « MAY multiple » ; (3) reformulation lien Passport « prévu, non imposé ». **Non exécuté ici.**

## Posture

- Aucune modif **code / OCR / Drive** ; **aucune connexion DB** ; OCR-110 **inchangé** (`sha256 384b6dec…`).
- **Pilote OCR-110 : CLOS.** Les 31 autres OCR **non déroulés** ; `MANIFEST-OCR.json` **non produit**.
