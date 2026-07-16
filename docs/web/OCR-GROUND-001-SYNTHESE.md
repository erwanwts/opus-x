# OCR-GROUND-001 — SYNTHÈSE (clôture du grounding des 32 Records)

**Sources @`b3aec9e` · grille G0–G4 · lecture seule · aucune modification de code/OCR/Drive.**

> **Principe fondamental.** Le World Skills Protocol (les OCR) est la **CIBLE NORMATIVE** ; le code est une implémentation **VERSIONNÉE**. Le grounding **mesure** l'écart, il ne rabaisse jamais le protocole au code. Un concept peut être **Normative ET non encore implémenté** (Backlog). **Règle d'or : un G1 ne devient jamais OCR-REV.**

**Grille** : G0 conforme · G1 impl. en retard (BACKLOG) · G2 tech debt · G3 doc ambiguë (OCR-REV, rare) · G4 gouvernance.

---

## 1. État global des 32 Records

| OCR | Concept | Passe | Verdict dominant | Détail |
|---|---|---|---|---|
| 000 | Canonical Knowledge Governance | F6 | **G0-en-process** | la règle de grounding elle-même |
| 001 | Canonical Registry Structure | F6 | **G0-en-process** | couches/formats ; §9 générateur matérialise |
| 002 | Editorial Rules | F6 | **G0-en-process** | register/keywords/anti-marketing suivis |
| 003 | Terminology Governance | F6 | **G0-en-process** | anti-synonymes ; lexique verrouillé |
| 004 | Entity Relationships | F6 | **G0-as-spec** | graphe cohérent ; runtime = WEB-003C |
| 005 | Versioning Rules | F6 | **G0-en-process** | semver ; no-silent-edit strictement tenu |
| 100 | World Skills Protocol | synthèse | **Mixte G0/G1** | produce/identité/séparation G0 ; verify/trust G1 |
| 101 | Professional Passport | F5 | **G0 + G1** | émis/ownership G0 ; update-model/projection G1 (GAP-3) |
| 102 | Professional Identity | F5 | **G0 + G1** | ownership/custody CODÉ G0 ; projection/trust G1 |
| 103 | Professional | F5 | **G0** | keystone humain matérialisé |
| 104 | Opus ID | F5 | **G0** | réel + référencé par les faits |
| 105 | Trust | F6 | **G1 BACKLOG PROTOCOL** | moteur absent ; séparation Evidence≠Trust G0 |
| 106 | Trust Status | F6 | **G1 BACKLOG PROTOCOL** | libellé Sprint-1 non calculé |
| 107 | Verification | F4 | **G1 + G0** | chemin absent ; garanties réelles G0 |
| 108 | Verification Request | F4 | **G1** | aucun objet/endpoint |
| 109 | Verification Response | F4 | **G1** | aucun objet ; Trust rattaché F6 |
| 110 | Evidence | pilote | **G0-core + G3/G1** | invariants durs G0 ; GAP-2 (G3), GAP-3 (G1) |
| 111 | Evidence Source | F1 | **G0 + G1** | provenance G0 ; ON DELETE RESTRICT mission_* G1 |
| 112 | Evidence Lifecycle | F1 | **G0 + G1** | réception G0 ; supersession G1 |
| 113 | Evidence Integrity | F1 | **G0 + G3-cand.** | JCS/recompute/constant-time/Unicode/idempotence G0 ; keyed-HMAC G3-à-confirmer |
| 114 | Immutable Fact | F1 | **G0 + G1** | append-only G0 ; supersession/passport-link/source-FK G1 |
| 115 | Framework | F2 | **G0 + G1** | niveaux-dans-Framework/versioning G0 ; registry G1 |
| 116 | Skill | F2 | **G0 + G1** | défini-par-Framework G0 ; tier/taxonomie G1 |
| 117 | Competency | F2 | **G1** | aucune entité code (question entité-vs-concept) |
| 118 | Capability | F2 | **G1** | aucune entité + standing/Trust G1 |
| 119 | Framework Registry | F2 | **G1** | mapping `wsp_skill_mappings` absent |
| 120 | Issuer | F3 | **G0** | entité réelle, neutre W7, redevable |
| 121 | Certified Issuer | F3 | **G1 + G0** | cycle Certified absent (G1) ; gate active+HMAC tient l'invariant (G0) |
| 122 | Organization | F5 | **G1 + G0** | entité/rôles non matérialisés ; « never owns identity » G0 (question) |
| 123 | Professional Profile | F5 | **G1** | couche de projection/vue dérivée absente |
| 124 | Canonical Registry | F6 | **G0-en-process** | corpus réel ; runtime = WEB-003C |
| 125 | Identity | F5 | **G0 + G1** | invariants (pro) G0 ; instanciation org G1 |

## 2. Répartition G0/G1/G2/G3/G4

- **G0 pleinement conforme (10)** : 000, 001, 002, 003, 004, 005, 120, 104, 103, + (124 G0-en-process). *(socle identité + gouvernance + Issuer)*
- **G0-substantiel avec gap partiel (10)** : 110, 111, 112, 113, 114, 115, 116, 125, 102, 101. *(le concept est réel dans son cœur ; une portion est G1/G3)*
- **G1 dominant — Normative non implémenté (11)** : 105, 106, 107, 108, 109, 117, 118, 119, 121, 122, 123.
- **Mixte (1)** : 100 (ombrelle).
- **G2 (tech debt)** : **aucun item net** *(la dualité display Sprint-1 ↔ fact store Sprint-2 est un G1 « à relier », pas une dette de code conforme)*.
- **G3 (OCR-REV, rare)** : **GAP-2** (cardinalité 1 critère — 110, net) · **imprécisions d'exemples** (GAP-1, plusieurs OCR) · **F1-03 keyed-HMAC** (113, **à confirmer**).
- **G4 (gouvernance)** : entité-vs-concept (117/118/122) · classification **P0–P4** par Record · complétion du vocabulaire de prédicats OCR-004 (WEB-003C).
- **BLOCKER** : **0** sur les 32. Les invariants durs de sécurité/immutabilité sont **tenus par le code** partout où ils s'appliquent.

## 3. Listes consolidées

### → BACKLOG PROTOCOL (implémenter la couche protocolaire en code ; OCR INCHANGÉS)
1. **Trust computation + Trust Status** (105/106) — le moteur (couche 200s « trust engine »).
2. **Verification path** (107/108/109) — endpoint Request→recompute-au-read→scope→Response.
3. **Framework Registry mapping** (119) — table criterion→coordinate (`wsp_skill_mappings`).
4. **Competency / Capability** (117/118) — taxonomie 3-tiers *(si décision = coder)*.
5. **Certification lifecycle** (121) — états Applicant/Certified/Suspended/Revoked + transitions.
6. **Supersession** (112/114) — mécanisme de fait superseding.
7. **Intégrité référentielle source** (111/114) — `ON DELETE RESTRICT` vers les tables source.
8. **Passport-update 1:1** (101 / **GAP-3**) — Evidence Link `passport_update_id UNIQUE` + projection des faits (relier Sprint-1 ↔ Sprint-2).
9. **Professional Profile** (123) — couche de vue dérivée bornée par consentement.
10. **Organization entité + rôles** (122) *(si décision = coder)*.

### → BACKLOG PRODUCT (décisions produit avant code)
- **Entité vs concept** : Competency (117), Capability (118), Organization (122).
- **Classification P0–P4** par Record (absente depuis l'import B.0).

### → TECH DEBT (G2)
- Aucun item net. *(À surveiller : `trust_index` Sprint-1 vestigial ; réconciliation display Sprint-1 ↔ fact store Sprint-2 — classée G1, non G2.)*

### → OCR-REV (G3 — UNIQUEMENT si l'OCR a un défaut)
- **GAP-2** (110) : « MAY reference multiple criteria » + exemple à 4, or le code impose **exactement 1** → corriger OCR-110.
- **GAP-1** : réaligner les **exemples JSON** (id `framework:wtf`, version `0.1`, `wtf:212`=Skill, pas de mapping fictif) — 110/115/116/117/119 + 107/108/109 + 120/121.
- **F1-03** (113) : keyed-HMAC — **G3 à CONFIRMER** (relire 113 : conflate-t-il vraiment intégrité SHA-256 vs auth-transport HMAC ? si oui G3 ; sinon G1).

### → ARCH DECISIONS (G4)
- Entité-vs-concept (117/118/122) *(recouvre BACKLOG PRODUCT)*.
- Classification P0–P4.
- Vocabulaire complet de prédicats OCR-004 pour WEB-003C.
- (Reporté, hors périmètre) OCR-200/300 : mécanismes & guides d'implémentation à écrire.

## 4. Décisions humaines encore ouvertes
1. **Entité vs concept** — Competency / Capability / Organization : entités à coder, ou concepts documentaires assumés ?
2. **Classification P0–P4** par Record (WEB-D / indexation) — jamais tranchée depuis B.0.
3. **F1-03 keyed-HMAC (113)** — confirmer **G3** (OCR-REV) vs **G1** (backlog code) au lot OCR-REV.
4. **Vocabulaire de prédicats (004)** — figer le registre complet avant WEB-003C.
5. *(rappel)* Les corrections OCR-REV (GAP-2, GAP-1) sont des **actions différées**, pas exécutées ici.

## 5. Definition of Done (§11) — état HONNÊTE
1. **Rapport de grounding sur les 32 OCR, ordre §5** — ✅ **31/32 en passes de famille** (pilote 110, F1-F6) **+ OCR-100 au niveau synthèse**. Signalé explicitement.
2. **9 champs par écart + verdict par OCR + registre CONFLIT consolidé** — ✅ (CONFLIT-1 pilote = cardinalité, seul couche-vs-couche ; F2-F6 = aucun nouveau).
3. **Aucun code / OCR / fichier Drive modifié** — ✅ (lecture seule ; seuls les rapports committés).
4. **Générateur : 8 artefacts pour 110 ET 101** — ⚠️ **110 FAIT** (golden 6/6 octet + échec-sur-divergence prouvé) ; **101 RESTE À FAIRE** (item ouvert, **pas un acquis**).
5. **Manifeste `MANIFEST-OCR.json` + plans migration/rollback (préparés, non appliqués)** — ⚠️ **NON PRODUIT** (étape d'après, explicitement différée).
6. **Items STOP / décision_humaine escaladés en liste unique** — ✅ (§3-§4 ci-dessus).
7. **OCR-200 reste reporté** — ✅.

**Conclusion DoD** : grounding **substantiellement complet et honnête** ; **deux items ouverts** avant clôture formelle : (a) 2ᵉ pilote générateur **OCR-101** ; (b) **MANIFEST-OCR.json**.

## 6. Recommandation — sprint suivant

**Séquence gravée** : `grounding (fait) → [finir pilote générateur 101 + MANIFEST-OCR.json] → WEB-003C (Canonical Knowledge Graph) → rendu B.1 → dévoilement`.

- **WEB-003C — Canonical Knowledge Graph** : matérialiser OCR-004 (prédicats, invariants, cohérence bidirectionnelle) à partir des OCR **groundés**. Le graphe **porte les G-codes** : **arêtes réelles → concepts G0** ; **arêtes cibles → concepts G1** (badge « **planifié / non encore implémenté** » au rendu, jamais présenté comme capacité actuelle).
- **Prérequis WEB-003C** : figer le **vocabulaire complet de prédicats** (au-delà des 9 de base d'OCR-004).
- **Grounding = processus permanent** : re-grounder chaque G1 à mesure que le BACKLOG PROTOCOL est implémenté, pour vérifier le passage **G1 → G0**.

---

**Bilan** : le protocole est **solide et cohérent** ; le **socle produce/identité/gouvernance est réel (G0)** — y compris le 2ᵉ principe fondateur « owned by professional, held by Opus X » ; la **moitié verify/trust + les couches de projection sont G1 (à construire)** ; **0 BLOCKER, 0 défaut d'OCR majeur** (quelques G3 mineurs à REV). La cible est claire, le code la rattrape par le BACKLOG PROTOCOL.
