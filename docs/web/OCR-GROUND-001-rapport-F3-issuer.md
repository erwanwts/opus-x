# OCR-GROUND-001 — Rapport de grounding · PASSE F3 (Issuer & consentement)

**Records : OCR-120 · OCR-121 · Sources @`b3aec9e` · 3 couches · lecture seule · aucune connexion DB.**

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

## Vérification des hypothèses (S3) contre le code

| Hypothèse | Verdict | G-code |
|---|---|---|
| Acceptation **gated sur « Certified »** | Le **nom/modèle** « Certified » n'existe pas ; la gate réelle = `wsp_issuers.status='active'` **+ secret HMAC** (ingestion étape 1). **L'invariant « seuls les Issuers autorisés sont acceptés » EST tenu.** | invariant **G0** · modèle **G1** |
| États **Applicant → Certified → Suspended/Revoked** | **Réfutée** — code = `status ∈ {active, suspended}` **et** `wsp_issuers` **append-only** (fact_store l.255-256) → status **non transitionnable**, **aucune** table d'événements de statut. Le cycle n'est pas opérable. | **G1** |
| **Forward-only** (suspendre/révoquer n'efface pas les faits) | **Confirmée** — `wsp_evidence` append-only ; la gate `status='active'` borne l'**émission** ; les faits passés demeurent, attribuables. | **G0** |
| **Modèle de consentement** | **CODÉ** — `wsp_consent_events` (event-sourced, append-only, **sujet→Issuer**) + `wsp_consent_active` vérifié à l'ingestion étape 2. | **G0** |

## Points G0 — actés clairement (bonnes nouvelles)

- **Consentement CODÉ** (`wsp_consent_events`, event-sourced append-only, sujet→Issuer, vérifié à l'ingestion). **G0.**
- **Forward-only** (suspendre n'efface pas les faits ; append-only). **G0.**
- **Gate d'autorisation (active + HMAC)** tient l'invariant « seuls Issuers autorisés acceptés ». **G0.**
- **Entité Issuer réelle**, **neutre (W7)**, **redevable** (`accountable_contact`), **bornée** (aucune table d'identité/trust/niveaux côté Issuer), **attribuable** (`wsp_evidence.issuer_id` FK), **auto-certification impossible** (RLS + append-only + registration via migration), **check à l'ingestion avant acceptance**. **G0.**

## 0 BLOCKER — vérifié et acté explicitement

La gate `active + HMAC` **respecte l'invariant de sécurité** (« seuls les Issuers autorisés sont acceptés », check à l'ingestion, pas d'auto-grant, immutabilité des faits) **même si** le modèle « Certified » n'est pas là. L'écart est un **enrichissement de modèle (G1)**, **pas un trou de sécurité**. → **0 BLOCKER**.

## Écart F3 (format §4)

```
GAP-F3-01   (OCR-121 cœur · OCR-120 référence)
  ocr:               OCR-121 Certified Issuer (+ OCR-120 State Machine/Governance)
  section:           State Machine / Lifecycle / Governance / Machine Interpretation
  affirmation:       "Applicant → Certified → (Suspended ↔ Certified) → Revoked" ; certification = état révocable ; reinstatement ; gate sur l'état Certified
  source_code:       Implémentation V1 SIMPLIFIÉE — wsp_issuers.status ∈ {active, suspended} (fact_store l.51-52), posé à l'INSERT et IMMUABLE (append-only, l.255-256) ; AUCUNE table d'événements de statut (contraste avec wsp_consent_events) ; gate ingestion = active + HMAC (000005 étape 1). Pas d'Applicant/Certified/Revoked, pas de transitions gouvernées. @b3aec9e
  classification:    G1 — Implémentation en retard (modèle d'états de certification = cible ; V1 = active/suspended statique)
  action:            BACKLOG CODE — construire le cycle de certification gouverné (Applicant/Certified/Suspended/Revoked + transitions + probablement une table d'événements type wsp_consent_events).
  note:              L'invariant de sécurité (gate, no self-grant, forward-only, check-at-ingestion) est DÉJÀ tenu (G0). Le manque = enrichissement de modèle, PAS une faille. Record 121 = Normative, non encore implémenté → badge « planifié » au rendu. NE PAS corriger l'OCR.
  décision:          PRISE (G1)
```

## Récurrences (référencées, non recomptées)

- **cohérent avec GAP-1** : Machine Interpretation de 120/121 (`authorization:"certified"` vs réel `active` ; `references_framework:"wtf:212"`). Réexamen sous la grille au lot OCR-REV côté exemples (parts « cible canonique » G1 / imprécisions G3). Non recompté.
- **Ne pas confondre** : « révocation d'**Issuer** » (F3, état — non implémenté, G1) ≠ « révocation d'**Evidence** » (F1, `wsp_fact_revocations` — implémenté, G0).

## Verdicts par OCR

| OCR | Verdict |
|---|---|
| **OCR-120 Issuer** | **G0 dominant** — entité Issuer réelle, neutre (W7), redevable, bornée, append-only, forward-only, gate active+HMAC tenant l'invariant. **0 BLOCKER.** Les références au cycle de certification (Applicant/Certified/Revoked) relèvent de 121 (**G1**) — **non contaminé** ici. |
| **OCR-121 Certified Issuer** | **G1 BACKLOG CODE** — le cycle « Certified » (Applicant/Certified/Suspended/Revoked + révocabilité + réinstatement) **n'est pas implémenté** ; V1 simplifiée = `active|suspended` statique. **G0** sur l'invariant protégé (gate, no self-grant, forward-only, check-at-ingestion). **0 BLOCKER** — enrichissement de modèle. Record Normative non implémenté → badge « planifié ». |

## Registre CONFLIT (F3)

**Aucun.** L'écart Certified↔active est une **implémentation en retard (G1)**, pas un conflit couche-vs-couche ni un défaut d'OCR.

## Répartition sous la grille

### → G0 CONFORME (aucune action)
Entité Issuer (120), bornes W7/redevabilité/attribution, **consentement** (`wsp_consent_events`), **forward-only**, **gate d'autorisation** (active+HMAC), no self-grant, check-at-ingestion.

### → BACKLOG CODE (G1 ; OCR INCHANGÉS)
- **GAP-F3-01** — cycle de certification gouverné (états + transitions + table d'événements) à construire ; V1 = `active/suspended` statique.

### → OCR-REV (G3)
- **Aucun** item F3. *(Exemples 120/121 : réexamen sous la grille au moment d'OCR-REV, comme GAP-1.)*

## Liste consolidée `décision_humaine`

- **GAP-F3-01** : décision **PRISE** (G1 BACKLOG CODE). Aucune question ouverte spécifique à F3. *(Rappels transverses hors F3 : F1-03 keyed-HMAC = G3 à confirmer au lot OCR-REV ; GAP-2 = G3 net.)*

## Contrainte de publication (gravée)

**OCR-121** (et les points G1 de **OCR-120**) porteront au rendu un badge **« planifié / non encore implémenté »** pour le cycle de certification. Jamais présenter « Certified Issuer » comme une capacité actuelle au-delà du gate `active`+HMAC réellement en place.

## Posture

- Aucune modif **code / OCR / Drive** ; **aucune connexion DB** ; les 2 Records **inchangés**.
- **STOP F3** : F4 **non lancée** ; `MANIFEST-OCR.json` **non produit**.
