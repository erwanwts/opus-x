# OCR-GROUND-001 — Grounding et durcissement du registre existant

| Field | Value |
|---|---|
| **Mandate ID** | OCR-GROUND-001 |
| **Version** | 1.0.0 |
| **Status** | Draft — awaiting human validation |
| **Owner** | Opus X — Canonical Registry |
| **Kind** | Mandate — Grounding & Hardening |
| **Last Update** | 2026-07-16 |
| **Depends on** | OCR-000 (grounding rule, status model), OCR-005 (versioning), OCR-001 (structure) |

> **Règle absolue (gouvernante).** Le code courant ne devient **jamais** automatiquement la vérité normative. Le grounding confronte **trois couches distinctes** — (1) documents gelés et décisions verrouillées, (2) OCR, (3) implémentation réelle. En cas de conflit entre ces couches, on **signale**, on ne réaligne **rien** silencieusement. Aucune modification de code, d'OCR ou de Drive pendant ce mandat.

---

## 1. Périmètre exact

**Dans le périmètre.**
- Les **32 OCR** du registre gelé : gouvernance/méta **OCR-000 → OCR-005** (6) et concepts **OCR-100 → OCR-125** (26).
- L'objet du grounding : les **sections à portée normative et machine** de chaque OCR — Canonical Definition, Protocol Rules (MUST/SHALL/SHOULD/MAY), State Machine, Machine Interpretation, JSON-LD Mapping, Examples, et toute affirmation factuelle sur le comportement du protocole.
- La **spécification** (non l'exécution finale de masse) du générateur des 8 artefacts, **validée sur 2 pilotes** : OCR-110 et OCR-101.
- Le **manifeste** des 32 OCR et le **plan de migration/rollback** Drive (préparation seule, pas d'exécution).

**Hors périmètre (STOP si demandé).**
- Toute modification du **code**.
- Toute modification des **OCR** (y compris « petits » correctifs) pendant le diff.
- Tout **remplacement dans Drive**.
- Tout **OCR-200+** (couche mécanismes/implémentation) — reportée (Décision 5).
- Tout **code de publication** du site.

---

## 2. Sources nécessaires (à fournir par Claude Code)

Le diff se fait contre des **fichiers réels et leurs commits**, jamais contre une reconstruction de mémoire. Claude Code doit fournir, pour chaque entrée : **chemin exact**, **commit hash**, et les **symboles** listés. La colonne « attendu (hypothèse mémoire) » ci-dessous n'est **pas** une référence normative : c'est ce que le grounding doit **vérifier ou réfuter**.

### 2.1 Checklist des fichiers & symboles

| # | Domaine (OCR) | Fichiers / artefacts à extraire | Symboles / constantes à vérifier | Attendu (hypothèse mémoire — à confirmer) |
|---|---|---|---|---|
| S1 | Evidence 110 · Integrity 113 · Lifecycle 112 · Source 111 | types & builders Evidence (`evidence-payload.ts`), ingestion/validation, util canonicalisation, util HMAC, comparaison temps constant, idempotence, tests non-ASCII | forme du payload, discriminateur, `criterion_levels`, canonicalisation, MAC, compare fn, id format | `type:"evidence"` **sibling** du body ; `criterion_levels` **objet** `{crit:level}` ; JCS/RFC 8785 ; HMAC ; compare **constant-time** ; id `ev_` + ULID ; émission idempotente ; test non-ASCII présent |
| S2 | Framework 115 · Registry 119 · Skill/Competency/Capability 116/117/118 | Framework discovery/client (`framework-client.ts`), seed du mapping, schéma mapping | id framework, parse structure imbriquée, `version`, `levels`, table mapping, lignes seed | framework id `wtf` ; niveaux **dans le Framework** (pas dans l'Evidence) ; `wsp_skill_mappings` seed = **4 lignes** `S03.C08 · S08.C06 · S05.C08 · S02.C12 → wtf:212` ; **aucun niveau** dans le mapping |
| S3 | Issuer 120 · Certified Issuer 121 · consentement | modèle Issuer, état d'autorisation/certification, gate de certification à l'ingestion, modèles de consentement Issuer | check `certified` avant acceptation, états, consent | acceptation **gated** sur état Certified à l'ingestion ; états `Applicant→Certified→Suspended/Revoked` ; effet **forward-only** (révocation n'efface pas les faits) |
| S4 | Verification 107 · Request 108 · Response 109 | types Request/Response, chemin de vérification, scoping de divulgation | recompute intégrité, borne consentement, statut reflété | vérification **recompute** (jamais digest fourni) ; **issuer-independent** ; Request borné par consentement ; Response **point-in-time**, non-credential |
| S5 | Identity 125 · Professional Identity 102 · Professional 103 · Passport 101 · Profile 123 · Opus ID 104 · Organization 122 | modèles Identity/Passport/Profile, mapping sujet `opus_id`, table de liaison Passport, FKs sources | `subject.opus_id`, `passport_update_id`, contraintes | `subject.opus_id` référencé ; **`UNIQUE(passport_update_id)`** (1 update/Evidence) ; **`ON DELETE RESTRICT`** vers `mission_order_evidence` & `mission_results` ; identité **owned by professional**, held by Opus X |
| S6 | Trust 105 · Trust Status 106 | chemin de calcul de trust, application de la version de Framework, recomputation | fonction de calcul, inputs, version, statut | trust **computé** (jamais affirmé) sur faits immuables ; interprété sous version de Framework explicite ; recomputable ; reflète supersession/révocation |
| S7 | Registry 124 · méta 000-005 · invariants communs | constantes & statuts verrouillés, `schema_migrations`, tests d'invariants (append-only, no UPDATE/DELETE) | valeurs verrouillées, garde append-only, migrations | mapping verrouillé ; **`schema_migrations` vide → `db push` interdit en prod** (DETTE-PROMOTION-01) ; invariants append-only imposés en base |

### 2.2 Documents gelés / décisions verrouillées (couche 1)

Claude Code (ou le détenteur du corpus) doit aussi fournir la **liste horodatée des décisions verrouillées** applicables (par ex. mapping scellé `→ wtf:212`, invariants d'immutabilité, séparation produce/verify, niveaux appartenant au Framework, dettes ouvertes DETTE-*). Cette couche **prime** sur le code en cas de conflit : un écart code↔décision est un **Écart d'implémentation**, jamais une raison de réécrire l'OCR.

---

## 3. Méthode de comparaison

Pour chaque OCR, dans l'ordre §5, en **lecture seule** :

1. **Extraire** les affirmations à portée normative/machine (chaque MUST/SHALL/SHOULD/MAY, chaque littéral des sections Machine Interpretation / JSON-LD / Examples).
2. **Rattacher** chaque affirmation à sa **source normative applicable** (couche 1 : décision gelée) et à sa **source de code applicable** (couche 3 : fichier + commit).
3. **Confronter les trois couches** :
   - OCR ↔ décision gelée ;
   - OCR ↔ code réel ;
   - décision gelée ↔ code réel.
4. **Classer** le résultat (Conforme / Écart d'implémentation / Écart documentaire) et, s'il y a conflit entre couches, produire un enregistrement **CONFLIT** distinct (ne pas trancher).
5. **Ne rien modifier.** Le diff produit un rapport, pas un patch.

Contraintes : diff contre **fichiers réels + commit hash** uniquement ; interdiction de grounder contre la mémoire ; si une source manque, l'affirmation est marquée **Ungroundable — source manquante** (voir STOP §7).

### 3.1 Les trois résultats

- **Conforme** — l'OCR décrit correctement l'implémentation **et** le corpus normatif.
- **Écart d'implémentation** — le code ne respecte pas (encore) la règle gouvernante ; l'OCR/la décision est la référence.
- **Écart documentaire** — l'OCR affirme quelque chose que les sources normatives ou le code réel ne permettent pas d'affirmer.

---

## 4. Format du rapport d'écart

Un enregistrement par écart (ou conflit), avec **exactement** ces champs :

```
GAP-<seq>
  ocr:               OCR-XXX <nom>
  section:           <section exacte>
  affirmation:       "<citation exacte de l'OCR>"
  source_normative:  <décision gelée applicable | "aucune">
  source_code:       <fichier:symbole @commit | "absente">
  classification:    Conforme | Écart d'implémentation | Écart documentaire | CONFLIT
  criticité:         BLOCKER | MAJOR | MINOR | INFO
  recommandation:    <action proposée, sans l'exécuter>
  décision_humaine:  requise | non
```

En complément, un **verdict par OCR** : `Conforme` global, ou `Écarts (n BLOCKER / n MAJOR / …)`, plus un **registre CONFLIT** consolidé (couche vs couche) présenté séparément pour arbitrage humain.

---

## 5. Ordre de traitement

1. **Evidence** (110 ; + 113, 112, 111 rattachés).
2. **Framework** (115 ; + 119, 116, 117, 118).
3. **Issuer et consentement** (120, 121).
4. **Verification** (107, 108, 109).
5. **Identity et Passport** (125, 102, 103, 101, 123, 104, 122).
6. **Trust et interprétations** (105, 106).
7. **Registry et métadonnées communes** (124 ; 000-005).

---

## 6. Critères de criticité

- **BLOCKER** — viole un invariant de sécurité ou d'immutabilité, ou une séparation gouvernante : ex. chemin de mutation/suppression d'un fait accepté ; comparaison de digest **non** temps-constant ; **niveaux présents dans le mapping** ; **absence** de gate de certification à l'ingestion ; digest fourni accepté sans recompute ; `UNIQUE(passport_update_id)` ou `ON DELETE RESTRICT` absent. **Bloque la promotion en Normative.**
- **MAJOR** — règle normative non imposée mais sans risque de sécurité immédiat (ex. version de Framework non épinglée dans un chemin, statut non reflété). **Bloque la promotion** de l'OCR concerné.
- **MINOR** — écart cosmétique, nommage, formulation, exemple imprécis sans impact normatif. **Ne bloque pas**, à corriger au prochain patch.
- **INFO** — observation, dette déjà tracée (DETTE-*), amélioration future. **Ne bloque pas.**

Un **CONFLIT** entre couches est traité **au minimum** comme MAJOR et **toujours** `décision_humaine: requise`.

---

## 7. Règles STOP

Arrêter et escalader (sans rien modifier) dès que :

1. **Conflit couche 1 ↔ OCR** — une décision gelée contredit un OCR. → enregistrement CONFLIT, décision humaine.
2. **Conflit couche 1 ↔ code** — le code contredit une décision gelée. → **Écart d'implémentation** signalé ; **ne jamais** réaligner l'OCR sur le code.
3. **Source manquante** — fichier/commit/symbole indisponible pour une affirmation. → `Ungroundable — source manquante`, ne pas deviner.
4. **Demande hors périmètre** — toute sollicitation de modifier code/OCR/Drive ou de lancer OCR-200. → refus, rappel du présent mandat.
5. **Pression à faire du code la vérité** — toute instruction impliquant un réalignement automatique de l'OCR sur le code. → STOP, application de la règle absolue.
6. **BLOCKER d'immutabilité/sécurité** découvert — consigner, poursuivre le diff, mais marquer l'OCR **non promouvable** jusqu'à décision humaine.

---

## 8. Pilotes

- **Grounding** : le pilote est **OCR-110 Evidence** (premier de l'ordre §5). Le diff de 110 valide la méthode (§3), le format (§4) et la criticité (§6) avant de dérouler les 31 autres.
- **Générateur des 8 artefacts** (§9) : pilotes **OCR-110** et **OCR-101 Professional Passport**. Le générateur n'est étendu aux 32 qu'après validation humaine sur ces deux-là.

---

## 9. Spécification du générateur des 8 artefacts

**Source unique gouvernée :** `OCR-XXX.md` (Markdown validé). Les 7 autres sorties sont **dérivées, automatiques et reproductibles**.

**Sorties :**

| Artefact | Fichier | Rôle | Dérivé de (section du .md) |
|---|---|---|---|
| Markdown | `OCR-XXX.md` | **source gouvernée** | — |
| PDF | `OCR-XXX.pdf` | artefact **humain** officiel | rendu intégral du .md |
| JSON-LD | `OCR-XXX.json` | pipeline site | section *JSON-LD Mapping* (+ header) |
| FAQ | `OCR-XXX-faq.md` | pipeline site | section *FAQ* |
| SEO | `OCR-XXX-seo.json` | pipeline site | *SEO Summary* + *Search Keywords* |
| GEO | `OCR-XXX-geo.md` | pipeline site | section *GEO Summary* |
| LLM | `OCR-XXX-llm.md` | pipeline site | section *LLM Summary* |
| Keywords | `OCR-XXX-keywords.json` | pipeline site | section *Search Keywords* |

**Règles (Décision 3) :**
- Aucun artefact dérivé ne **redéfinit** le concept.
- Aucune **modification manuelle durable** dans un artefact dérivé.
- Toute régénération **part du Markdown validé**.
- Chaque artefact porte le **même Document ID, Canonical ID, version, et checksum source** (`sha256` du `.md`).
- Toute **divergence** artefact ↔ source (checksum ne correspondant pas) **fait échouer** la génération.

**Contrat d'extraction :** chaque section source doit être présente et non vide dans le `.md` ; une section manquante fait échouer la génération de l'artefact concerné (pas d'invention). Le générateur est **idempotent** : régénérer depuis un `.md` inchangé produit des octets stables (hors PDF, dont seule l'égalité de contenu est requise).

**Definition of Done du générateur :** produit les 8 sorties pour 110 et 101, chaque sortie portant le checksum source correct, la régénération est reproductible, et l'injection d'une divergence provoque bien l'échec attendu.

---

## 10. Manifeste attendu (préparation Drive — Décision 4)

Un manifeste `MANIFEST-OCR.json` (préparé, **non appliqué**) contenant :
- les **32 OCR** : Document ID, Canonical ID, **version**, statut, **checksum source** (`sha256` du `.md`) ;
- pour chaque OCR : la **liste des artefacts** produits et leurs checksums ;
- la **liste des anciens fichiers Drive** à remplacer (les PDF actuels du dossier OCR-100 et les md/pdf du dossier OCR) ;
- la **liste des nouveaux artefacts** à déposer ;
- un **plan de migration** (ordre de dépôt, correspondance ancien→nouveau) et un **plan de rollback** (restauration des anciens en cas d'échec).

Le remplacement Drive reste une **action distincte**, exécutée seulement après validation humaine du grounding et du générateur.

---

## 11. Definition of Done (OCR-GROUND-001)

Le mandat est « fait » quand :

1. Le **rapport de grounding** couvre les **32 OCR**, dans l'ordre §5.
2. Chaque écart porte les **9 champs** (§4) ; chaque OCR a un **verdict** ; le **registre CONFLIT** est consolidé.
3. **Aucun** code, OCR ou fichier Drive n'a été modifié.
4. Le **générateur** produit les **8 artefacts** pour **110** et **101**, checksums source concordants, reproductible, échec-sur-divergence prouvé.
5. Le **manifeste** + plans migration/rollback sont produits (non appliqués).
6. Tous les items **STOP** et **décision_humaine: requise** sont escaladés dans une liste unique d'arbitrage.
7. **OCR-200 reste reporté**, conformément à la Décision 5.

**Ne franchissent jamais ce mandat sans validation humaine :** extension OCR-200, modification des Records, remplacement Drive, code de publication.

---

## Version History

- **1.0.0** (2026-07-16) — Mandat initial de grounding et durcissement du registre existant (32 OCR). En attente de validation humaine avant exécution.
