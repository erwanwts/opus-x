# OCR-GROUND-001 — Rapport de grounding · PASSE F5 (Identity & Passport)

**Records : OCR-104 · OCR-103 · OCR-125 · OCR-102 · OCR-101 · OCR-123 · OCR-122 · Sources @`b3aec9e` · 3 couches · lecture seule · aucune connexion DB.**

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

## Points G0 — le cœur de la thèse produit (acté fort)

- **Opus ID réel + référencé par les faits** : `profiles.opus_id` (`opx_`+ULID, **unique**) ; **`wsp_evidence.subject_id → profiles.opus_id`** (FK, fact_store l.80) → **les faits immuables se lient à l'Opus ID**. **G0.**
- **Professional** (`profiles`, 1:1 `auth.users`) & **Passport émis** (`passports.issued_at`, handle, visibility, lifecycle) + surface de lecture (`passports/[handle]`, `me/passport`, `/p/[handle]`). **G0.**
- **OWNERSHIP / CUSTODY MATÉRIALISÉ** (2ᵉ principe fondateur) : **RLS `auth.uid()`** (le professionnel **possède** profile/passport, 11 policies) **+** `opus_id` **émis et détenu par Opus X** (custody). → « **owned by professional, held by Opus X** » est **CODÉ, pas aspirationnel**. **G0.**
- **Non-fabrication / non-suppression des faits** : append-only `wsp_evidence` + RLS → le professionnel contrôle la **divulgation**, jamais l'**existence**. **G0.**

## Dualité Sprint-1 / Sprint-2 (nommée)

- **Display Sprint-1** (`profiles`/`passports`/`evidence`/`skills` = UI) **EXISTE** → **G0**.
- **Fact store Sprint-2** (`wsp_evidence` = protocole immuable) **EXISTE** → **G0**.
- **MAIS non reliés** : le Passport **ne projette pas encore** les faits immuables (les tables `evidence`/`skills` Sprint-1 sont des stubs séparés du fact store). = **GAP-3** (déjà backlog) → **G1 BACKLOG CODE**, **référencé, non recompté**.

## Écarts F5 (format §4)

```
GAP-F5-01   (OCR-101 · OCR-102 · OCR-104 — projection Passport des faits)
  ocr:               OCR-101 Professional Passport (+ 102 surfacing, 104 anchoring)
  section:           Machine Interpretation / Protocol Rules / Conceptual Model
  affirmation:       "one Passport update per accepted Evidence (passport_update_id UNIQUE)" ; Passport = accumulation append-only projetant les faits immuables
  source_code:       Le binding fait→opus_id EXISTE (wsp_evidence.subject_id, G0) ; mais AUCUN passport_update_id / Evidence Link, et le Passport (Sprint-1) est une LIGNE mutable d'affichage, pas une accumulation append-only d'updates. Dualité Sprint-1/Sprint-2 non reliée. @b3aec9e
  classification:    G1 — Implémentation en retard (= GAP-3, référencé)
  action:            BACKLOG CODE — modèle Passport-update 1:1 + projection des faits immuables (relier fact store ↔ surface).
  décision:          PRISE (G1, = GAP-3)
```
```
GAP-F5-02   (OCR-123 Professional Profile — couche de projection)
  ocr:               OCR-123 Professional Profile
  section:           Canonical Definition / Protocol Rules / Machine Interpretation
  affirmation:       vue dérivée du Passport, disclosure-limited, audience-specific, présentant faits divulgués + Trust computé
  source_code:       ABSENTE — aucune couche de projection/vue dérivée (la lecture passports/[handle] = whitelist grossière Sprint-1, 404 par défaut). Dépend de GAP-3 (projection des faits) + Trust (F6) + modèle de divulgation par item. @b3aec9e
  classification:    G1 — Implémentation en retard (couche de projection non construite)
  action:            BACKLOG CODE — couche Profile (vue dérivée bornée par consentement), après projection Passport (GAP-3) et Trust (F6).
  note:              Le Profile est une VUE (pas une table) : c'est bien une capacité code à construire, pas un défaut d'OCR.
  décision:          PRISE (G1)
```
```
GAP-F5-03   (OCR-122 Organization — entité & rôles)
  ocr:               OCR-122 Organization
  section:           Conceptual Model / State Machine / Protocol Rules
  affirmation:       entité non-humaine tenant plusieurs RÔLES (Issuer/verifier/governing body), rôle = état tenu, jamais propriétaire de l'identité pro
  source_code:       Pas de table `organizations` ni de modèle entité-tenant-des-rôles. Seul `wsp_issuers` (= le RÔLE Issuer) existe. Pas de rôle verifier (F4 non construit), pas de governing-body, pas de multi-rôle. « Ne possède jamais l'identité pro » EST structurellement tenu (RLS, aucun chemin org→profiles). @b3aec9e
  classification:    G1 — Implémentation en retard (entité Organization + modèle de rôles non matérialisés) ; « never owns identity » = G0
  action:            BACKLOG CODE — QUESTION à remonter : entité Organization (avec modèle de rôles) à CODER, OU concept documentaire assumé (les rôles suffisent) ? (comme Competency/Capability en F2). Ne pas trancher.
  décision:          décision_humaine requise (entité vs concept)
```

## Dépendance Trust (rattachement F6)

« Trust computed for / surfaced by » l'identité (OCR-104/102/101/123) dépend de **Trust (105/106)** — **non construite** (F2-03). → **G1 rattaché à F6**. Signalé, non recompté.

## Récurrences (référencées, non recomptées)

- **GAP-3** (lien Passport 1:1) : déjà BACKLOG CODE → référencé (GAP-F5-01).
- **cohérent avec GAP-1** : exemples JSON (`passport_update_id`, `framework wtf@1.0.0`, `opus_id`). Réexamen au lot OCR-REV.
- **Lifecycle d'identité** (Active/Suspended/Retired sur 104/102/103/125) non modélisé sur `profiles` → **INFO/G1** (opérations d'identité), non recompté.

## Verdicts par OCR

### Bloc Identity core
| OCR | Verdict |
|---|---|
| **OCR-104 Opus ID** | **G0** — réel (`profiles.opus_id`), **référencé par les faits** (subject_id FK), owned/held, non-réassignable (unique). Trust-pour-lui → F6. **0 BLOCKER.** |
| **OCR-103 Professional** | **G0 fort** — `profiles` (humain), possède (RLS), gouverne la divulgation (consent/visibility), sujet des faits, **ne peut ni fabriquer ni supprimer** (append-only). Keystone humain matérialisé. |
| **OCR-125 Identity** | **G0** sur les invariants (durable/owned/verifiable/custody-separable) **matérialisés pour le professionnel** · **G1** sur l'instanciation « identité organisationnelle » (122 non construite). Concept abstrait. |
| **OCR-102 Professional Identity** | **G0 dominant** — **ownership/custody CODÉ** (RLS + émission Opus X), identité réelle, **faits liés** (subject_id) · **G1** sur la projection Passport (GAP-3) + Trust (F6). |

### Bloc Surface
| OCR | Verdict |
|---|---|
| **OCR-101 Professional Passport** | **G0** sur le Passport **émis** + ownership (RLS) + surface de lecture + contrôle `visibility` · **G1** sur le modèle d'**updates** (passport_update 1:1 = GAP-3), la projection des faits, le Trust surfacé (F6), la divulgation par item. |
| **OCR-123 Professional Profile** | **G1 BACKLOG CODE** — couche de **projection/vue dérivée** non construite (dépend GAP-3 + Trust). Vue (pas table). |
| **OCR-122 Organization** | **G1** — entité + modèle de rôles non matérialisés (seul le rôle Issuer = `wsp_issuers`) · **G0** sur « ne possède jamais l'identité pro ». **QUESTION** : entité à coder vs concept. |

## Registre CONFLIT (F5)

**Aucun.** Tous les écarts = implémentation en retard (G1) ou conforme (G0) ; aucun défaut d'OCR, aucun conflit couche-vs-couche. Les 7 Records décrivent correctement la cible.

## Répartition sous la grille

### → G0 CONFORME
Opus ID (référencé par les faits), Professional, Passport émis + surface, **ownership/custody (RLS + émission Opus X)**, non-fabrication/non-suppression (append-only), invariants d'identité (cas professionnel), « org ne possède pas l'identité ».

### → BACKLOG CODE (G1 ; OCR INCHANGÉS)
- **GAP-F5-01** — projection Passport des faits (= **GAP-3**, relier Sprint-1/Sprint-2).
- **GAP-F5-02** — couche Professional Profile (vue dérivée).
- **GAP-F5-03** — entité Organization + rôles *(sous réserve de la décision entité vs concept)*.
- **Dépendance Trust** rattachée **F6** (Trust surfacé/calculé pour l'identité).

### → OCR-REV (G3)
- **Aucun** item F5.

## Liste consolidée `décision_humaine`

- **GAP-F5-03 (Organization)** : **QUESTION** — entité Organization (modèle de rôles) à **coder**, ou **concept documentaire** assumé (les rôles suffisent) ? *(à grouper avec Competency/Capability F2 à la synthèse — non tranché.)*
- GAP-F5-01 / GAP-F5-02 : **PRISES** (G1 BACKLOG CODE). *(Rappels transverses : Trust — F6 ; F1-03 keyed-HMAC = G3 à confirmer ; GAP-2 = G3 net.)*

## Contrainte de publication (gravée)

Points **G1** (projection Passport/updates, Professional Profile, Organization-entité, Trust surfacé) → badge **« planifié »** au rendu. On présentera les **G0 réels** (Opus ID, Professional, Passport émis, **ownership/custody**) comme capacités actuelles ; **jamais** la projection des faits/Trust/Profile comme déjà en place.

## Posture

- Aucune modif **code / OCR / Drive** ; **aucune connexion DB** ; les 7 Records **inchangés**.
- **STOP F5** : F6 **non lancée** ; `MANIFEST-OCR.json` **non produit**.
