# WEB-003 — Liste d'autorité (Registry Import Control)

**Rôle.** Référence de contrôle établie par le superviseur (depuis l'inventaire Drive réel).
Claude Code télécharge les `.md` depuis le Drive **sans intermédiaire**, puis **croise** ses
checksums et son inventaire avec cette liste. Aucune divergence tolérée sans STOP.

**Source.** Dossier Drive `OCR-100` (couche Foundational + gouvernance), compte propriétaire
`erwan@worldtradingskool.com`. Les `.md` sont la **source éditoriale** ; les `.pdf` homonymes
sont des artefacts de publication (présence signalée, jamais parsés).

**Plages attendues (disjointes) :** `OCR-000..005,OCR-100..125`
Le trou `006–099` est **normal** (deux plages distinctes) — jamais une anomalie.

## Records attendus (32)

### Gouvernance — `OCR-00x` (6)
| document_id | canonical_id | fichier .md attendu |
|---|---|---|
| OCR-000 | canonical-knowledge-governance | OCR-000_Canonical_Knowledge_Governance.md |
| OCR-001 | canonical-registry-structure | OCR-001_Canonical_Registry_Structure.md |
| OCR-002 | editorial-rules | OCR-002_Editorial_Rules.md |
| OCR-003 | terminology-governance | OCR-003_Terminology_Governance.md |
| OCR-004 | entity-relationships | OCR-004_Entity_Relationships.md |
| OCR-005 | versioning-rules | OCR-005_Versioning_Rules.md |

### Foundational Concepts — `OCR-1xx` (26)
| document_id | canonical_id | fichier .md attendu |
|---|---|---|
| OCR-100 | world-skills-protocol | OCR-100_World_Skills_Protocol.md |
| OCR-101 | professional-passport | OCR-101_Professional_Passport.md |
| OCR-102 | professional-identity | OCR-102_Professional_Identity.md |
| OCR-103 | professional | OCR-103_Professional.md |
| OCR-104 | opus-id | OCR-104_Opus_ID.md |
| OCR-105 | trust | OCR-105_Trust.md |
| OCR-106 | trust-status | OCR-106_Trust_Status.md |
| OCR-107 | verification | OCR-107_Verification.md |
| OCR-108 | verification-request | OCR-108_Verification_Request.md |
| OCR-109 | verification-response | OCR-109_Verification_Response.md |
| OCR-110 | evidence | OCR-110_Evidence.md |
| OCR-111 | evidence-source | OCR-111_Evidence_Source.md |
| OCR-112 | evidence-lifecycle | OCR-112_Evidence_Lifecycle.md |
| OCR-113 | evidence-integrity | OCR-113_Evidence_Integrity.md |
| OCR-114 | immutable-fact | OCR-114_Immutable_Fact.md |
| OCR-115 | framework | OCR-115_Framework.md |
| OCR-116 | skill | OCR-116_Skill.md |
| OCR-117 | competency | OCR-117_Competency.md |
| OCR-118 | capability | OCR-118_Capability.md |
| OCR-119 | framework-registry | OCR-119_Framework_Registry.md |
| OCR-120 | issuer | OCR-120_Issuer.md |
| OCR-121 | certified-issuer | OCR-121_Certified_Issuer.md |
| OCR-122 | organization | OCR-122_Organization.md |
| OCR-123 | professional-profile | OCR-123_Professional_Profile.md |
| OCR-124 | canonical-registry | OCR-124_Canonical_Registry.md |
| OCR-125 | identity | OCR-125_Identity.md |

## Faits de contrôle certifiés par le superviseur (lecture Drive réelle)

Ces cinq Records ont été **lus intégralement** ; leurs métadonnées de tête sont certifiées :

| document_id | canonical_id | Version | Status | Format d'en-tête | Layer/Kind |
|---|---|---|---|---|---|
| OCR-100 | world-skills-protocol | 1.0.0 | Draft | table `\| Field \| Value \|` | Layer OCR-100 |
| OCR-101 | professional-passport | 1.0.0 | Draft | table `\| Field \| Value \|` | Layer OCR-100 |
| OCR-102 | professional-identity | 1.0.0 | Draft | table `\| Field \| Value \|` | Layer OCR-100 |
| OCR-125 | identity | 1.0.0 | Draft | table `\| Field \| Value \|` | Layer OCR-100 |
| OCR-004 | entity-relationships | 1.0.0 | Draft | table `\| Field \| Value \|` | Meta — Governance |

**Conséquences pour le manifeste CC :**
- Le **format d'en-tête réel = table markdown `\| Field \| Value \|`** → l'hypothèse n°2 du parseur doit matcher. Tout Record ressortant en `header_unparsed` est une **anomalie réelle à me remonter** (STOP).
- Tous les Records lus sont **`Status: Draft`** → selon la règle d'indexation (WEB-D), **aucun n'est indexable** en l'état. Le pilote de rendu (B.2) doit donc produire du `noindex` — c'est attendu, pas un bug.
- Champ de métadonnées présent partout : `Document ID, Canonical ID, Canonical Name, Version, Status, Owner, Review Status, Normative / Informative, Last Update, Layer` (ou `Kind` pour la gouvernance). **`classification` n'apparaît PAS** dans les en-têtes lus → le manifeste la marquera `metadata_missing` sur ces Records : **c'est un vrai trou à combler** (décision humaine : quelle classification P0–P4 par Record), pas une erreur du script.

## Règles de croisement (CC ↔ liste d'autorité)

1. **Complétude** : les 32 `document_id` ci-dessus doivent être présents. Tout manquant/en trop → STOP.
2. **Nom ↔ ID** : le `document_id` extrait de l'en-tête doit correspondre au préfixe du nom de fichier. Mismatch → `id_filename_mismatch`, STOP.
3. **Doublons** : la série `OCR-00x` existe potentiellement en **deux versions** (longue ~8–9 Ko dans le dossier OCR-100 ; courte ~2 Ko dans le dossier `OCR`). **N'importer que la version longue.** Si les deux sont dans le zip → `duplicate_document_id`, STOP, on tranche (la longue fait foi).
4. **PDF** : présence homonyme signalée, jamais parsée.
5. **Checksums** : CC publie ses SHA-256 ; ils deviennent la référence committée (`_manifest.json`). Le superviseur n'a pas pris de SHA-256 (lecture via outil, pas fichier brut) — le croisement porte sur **`document_id`, `canonical_id`, nom de fichier, version, statut**, pas sur le hash.

## Note d'honnêteté

Je n'ai lu que 5 Records sur 32 ; les `canonical_id` des 27 autres sont **déduits du nom de fichier**
(convention `snake→kebab`, ex. `Trust_Status` → `trust-status`) et **doivent être confirmés** contre
l'en-tête réel de chaque `.md` au moment du manifeste. Toute divergence entre le `canonical_id` d'en-tête
et celui déduit ici → à me remonter (ce n'est pas au script de trancher).
