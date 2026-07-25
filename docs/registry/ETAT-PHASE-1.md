`docs/registry/ETAT-PHASE-1.md` · point de reprise · composé le 2026-07-25 *(hash de versement : voir commit)*

# État de la Phase 1 — point de reprise

> **Nature.** Synthèse de reprise, **composée le 2026-07-25** à partir des mesures inscrites dans
> [DECISIONS-LOG.md](DECISIONS-LOG.md) — *ce fichier n'existait pas avant ce tour.* Aucune conception,
> aucune règle nouvelle : il rassemble ce qui est **décidé, mesuré, et à faire**. La source de vérité
> décisionnelle reste `DECISIONS-LOG.md`.
>
> **Statut : Phase 1 ARRÊTÉE. Cadrage CLOS — aucune décision ouverte. Aucune étape lancée.**

## 1. Ce que la Phase 1 promeut

**29 Records** `Draft → Normative` (partition **29·3·1**, D-005) : Phase 1 = 29 · Phase 2 = {OCR-100,
OCR-114, OCR-123} · Phase 3 = {OCR-006}. Les 33 Records sont tous `Status: Draft` aujourd'hui.

## 2. La bascule du chantier

Deux renversements de prémisse, tous deux nés du même angle mort — **décider sans avoir lu le corpus
normatif** :

1. **D-014** — les 10 principes d'OCR-006 visent le **protocole** ; les Records `.md` sont documentaires.
2. **Correction majeure** — le corpus documentaire **n'est pas sans règle** : **OCR-000…005** (gouvernance,
   structure, éditorial, terminologie, relations, versioning) + **OCR-124** le gouvernent déjà. D-015 n'est
   donc **pas** l'écriture d'un Record neuf, mais la **consolidation d'un GAP étroit** + des amendements.

**Lecture close :** 12 Records lus intégralement (OCR-000…006, 110, 112, 113, 124, 111, 106). Les 21 concepts
restants = protocole pur, **risque de renversement nul** (majorant accepté). Le portail de promotion
(**grounding + approbation**) était **écrit depuis l'origine** (OCR-000:47-53) ; il se **rebranche**, il ne
se construit pas.

## 3. Décisions (D-001 → D-017) — cadrage clos

| Réf | Objet | État |
|---|---|---|
| D-001 | Artefact PROMO à côté du Record | rendue (conception, étape 6) |
| D-002 v2 | Modèle B″ projections | rendue, non appliquée (lot B″ en attente) |
| D-003 | Fonction d'agrégation | SANS OBJET |
| D-004 | Série `PROMO` hors plages + garde | rendue + appliquée (`702c2d7`) |
| D-005 | OCR-123 → Phase 2, partition 29·3·1 | rendue + appliquée (`733646f`) |
| D-006 / D-007 | Régime `[GRAVÉ]` / seau B = orphelins | rendues + appliquées (`528e303`) |
| D-008 / D-009 | Critère contenu retiré / « modif. substantielle » retirée | rendues + appliquées |
| D-010 | **Grain de l'artefact PROMO** | **SUSPENDUE — rouvre à l'étape 6** |
| D-011 | P9 vise le statut protocole, pas le documentaire | rendue + appliquée (`8a8b61d`) |
| D-012 | « le champ gouverne » | **RETIRÉE** par D-013 |
| D-013 | Q3 : statut dérivé (résolveur), révocation = 2ᵉ fait | rendue ; sous-question (sort du champ) REPORTÉE |
| D-014 | Les 10 principes visent le protocole | rendue + appliquée (`c447935`) |
| D-015 | Régime documentaire (consolidation du GAP), avant clôture | rendue (`357d924`) |
| D-016 | L'artefact PROMO **EST** l'approbation Opus X (`authority`) | rendue |
| D-017 | Le Record porte son **verdict de grounding** avant promotion | rendue |

**Propositions du registre des règles :** sept, à normaliser. **Série d'échec** de l'angle mort « décider
sans lire » : deux occurrences majeures (champ Status ; OCR-000…005).

## 4. Le GAP réel — trois déficits (le reste est gouverné)

**6/8 domaines gouvernés** par OCR-000/001/002/005/006-P10 + OCR-124. **Trois déficits** que le régime doit
combler :

1. **Intégrité documentaire** — le sceau sha256 des `.md` (manifeste) n'a **aucun Record** (OCR-113 =
   payloads Evidence, objet protocole).
2. **Transmission** — la discipline **chemin + hash** est une convention de session, **hors Record**
   (OCR-111 = provenance protocole, objet distinct).
3. **Forme de l'approbation Opus X** — requise (`OCR-000:47`) et tracée (`OCR-005:55`), mais l'**acte** (qui
   signe, quel artefact) n'est **défini nulle part** — comblé par **D-016** (PROMO = l'approbation).

## 5. Grounding — la boucle est ouverte, pas vide

Le dispositif **`OCR-GROUND-001`** existe et **a tourné** (rapports F1/F2/F3, verdicts « Conforme »), en
**manuel** (diff doc↔code versionné). Charge = **15 machine-facing** de Phase 1 (`OCR-000:51` conditionnel —
les 14 éditoriaux hors diff) : **9 groundés** (105,110,111,112,113,115,119,120,121), **6 à faire**
(**101,104,106,107,108,109**). **Raccord absent** : aucun Record ne cite son verdict, aucun test ne lit les
rapports, `Review Status` est inerte. **D-017** ferme la boucle.

## 6. Ordre de promotion (D-016 × D-013 × D-017) — unique

```
grounding (Conforme) → verdict écrit DANS le Record (D-017) → PROMO émis = approbation (D-016) → « Normative » DÉRIVÉ (D-013)
```
PROMO **présuppose** le grounding (tracé au Record), ne le **porte** pas. Tout autre ordre viole
`OCR-000:47`, D-017, ou P9.

## 7. Séquence d'exécution — huit étapes gravées, aucune lancée

1. **Amender OCR-006** v2.0.0 (MAJOR ; C/E/G normatifs) — D-014/D-011
2. **MINOR OCR-001** (plage méta + réparation OCR-006) — D-015
3. **Loger les 3 règles** (intégrité, transmission, approbation) — D-015/D-016
4. **Fermer la boucle grounding** (champ verdict + test) — D-017
5. **Grounder les 6** (101,104,106,107,108,109) — D-017
6. **Concevoir l'artefact PROMO** (rouvre **D-010**) — D-001/D-010/D-016
7. **Normaliser les 36** par amendements (pas de Record neuf) — D-015/P10
8. **Promouvoir les 29** `Draft → Normative` — D-016/OCR-000:47

**Point de reprise = étape 1, sur feu vert. D-010 reste suspendue jusqu'à l'étape 6.**
