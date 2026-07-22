# DOSSIER DE SESSION — pour l'Architecte

**Ouvert le** 2026-07-22. **Objet** : consigner les décisions rendues, les mesures qui les
fondent, les verrous restants, et l'instrument des nombres. Ce dossier **ne fait pas
autorité** : il rassemble. Les décisions gravées vivent dans le corpus et les décisions
verrouillées ; les règles non normalisées, dans `REGLES-DECOUVERTES.md`.

---

## 1 · Décisions rendues

| Réf | Décision | Motif retenu par l'Architecte |
|---|---|---|
| **D-001** | **Option 1a** — l'artefact de promotion est un **artefact documentaire à côté du Record** | il entre dans l'enveloppe d'intégrité (le manifeste) |
| **D-002 v2** | **Modèle B″** — les projections **ne sont pas gouvernées** : leur `robots` reste hors chaîne, à sa valeur actuelle ; elles **affichent les statuts des Records projetés** et rendent visible l'hétérogénéité, **sans statut propre** | option de la main de l'Architecte (voir §4) |

**Chemin critique de D-001** : l'enveloppe d'intégrité (le manifeste) n'était **attestée par
aucun test** et avait divergé **≈ 24 h 40 min** sans être vue (§3). L'attestation est
désormais conçue et posée (§6, Voie B).

---

## 2 · Les verrous restants chez l'Architecte

Trois décisions **non rendues**. Tant qu'elles ne le sont pas, elles ne sont pas invocables
(RD-006 : *une source plausible n'est pas une source vérifiée*).

1. **Permanence anglaise des artefacts canoniques.** Aucune source normative ne la rend. Le
   seul énoncé (§16.1 du document d'architecture) **se déclare non normatif** ; le spec gelé
   **WEB-001B** planifie l'inverse (WEB-007 multilingue, type `translation`). La lacune
   `localized-to-canonical-link` reste **ouverte** pour cette raison ; son motif a été ramené
   au tracé (« non localisée **aujourd'hui**, par fallback strict, `CLAUDE.md:55` »).
2. **Substrat du fait de promotion.** Non tranché. Ce dossier ne le conçoit pas.
3. **Série d'identifiants de l'artefact de promotion.** Non tranchée — et **critique** : le
   générateur est **silencieux** sur un id hors `expected_ranges` (§3, mesure M2). Sans
   décision, l'id n'est gardé par rien.

---

## 3 · Mesures de la session

Toutes rejouées depuis leur source ; les nombres structurants sont réunis en §5.

**Fuite du portail — ce que chaque page dérivée rend des Records en Draft** (composant) :

| Type (n) | Ce qui sort | Source |
|---|---|---|
| Prédicat (37) | identifiant + section seuls (`sourceRef`, ex. `OCR-007 §4`) | `registryEntityPage.ts:97` |
| Famille (15) | **rien des Records** — prédicats seulement | `registryEntityPage.ts:116-149` |
| Type (6) | `type/record` : jusqu'à **6 titres** de Records (échantillon) ; 5 autres : aucun | `registryEntityPage.ts:166` |
| Index (1) | identifiant + titre + **statut** des 33 Records | `registryEntityPage.ts:200-202` |

Le maximum qui sort d'un Record : **identifiant, titre, statut**. Jamais résumé, extrait ni
corps.

**Divergence des deux projections** — 59 pages dérivées déclarent `robots: index,follow`
(`registryEntityPage.ts:59`) et sont absentes de `indexPlan()` (`sitemapPlans.ts:87`).
Inscrite en dette ; **arbitrée par D-002 v2** (§4).

**Fan-in.** Prédicat 1–26 Records · famille 3–26 (transitif) · type `record` 26 · index 33.
**22 des 59** pages référencent ≥ 1 des 3 Records restant en Draft (**11 prédicats + 9
familles + 1 type + 1 index**).

**Les 7 Records absents du graphe** = **OCR-000 à 006** (ils se citent en prose mais n'ont
pas de section machine → aucun nœud). Critère « cité ≥ 1 » appliqué :

| Record | Phase (30·2·1) | Cité par | « cité ≥ 1 » |
|---|---|---:|---|
| OCR-000…005 | **Phase 1** | 6 chacun | **PASSE** |
| OCR-006 | Phase 3 | 0 | échoue (attendu en Phase 3) |

**Aucun Record de Phase 1 n'échoue le critère dérivable. La Phase 1 peut s'exécuter sur la
partition actuelle.** *(Note : une première mesure, boguée — regex `\b` sur des id à trait
d'union — donnait 0 citations et concluait l'inverse ; corrigée par `.includes`, contrôle
croisé au grep. Le fait est consigné.)*

**Anomalie de plage (M2), rejouée sur le générateur réel** — artefact hors
`expected_ranges` (OCR-000..006 / OCR-100..125) : **SILENCE**. `missing_in_sequence` reste
vide ; l'artefact est **silencieusement absorbé** (file_count 33→35, entrée + checksum
créés). Le générateur ne signale ni erreur ni avertissement sur un id hors plage — il ne
vérifie que les trous *dans* chaque plage. *(Le générateur écrit en dur dans
`content/registry/_manifest.json` : le rejeu a été fait sur copie, manifeste réel restauré et
vérifié identique à HEAD.)*

**Substrat du build.** Le build **ne lit rien hors du dépôt** (aucun `fetch`/`supabase`/`http`
dans le chemin statique). **34 pages** consomment le statut au build (33 Records + l'index) ;
les 58 dérivées ne le consomment pas.

**Option 1a — effet d'un ajout au corpus (mesuré, non déduit)** : **aucun des 33 checksums ne
change** (sha256 par fichier). Le manifeste change **si l'artefact est un `.md`** (file_count
+1, entrée, anomalie de métadonnées) ; un artefact **non-`.md`** est **invisible** au
manifeste (il ne lit que les `.md`). Conséquence pour D-001 : un artefact `.md` **entre** dans
l'enveloppe d'intégrité — ce que l'Architecte a retenu.

---

## 4 · D-002 v2 — Modèle B″ (rendue par l'Architecte)

> **Modèle B″.** Les projections ne sont pas gouvernées ; leur `robots` reste hors chaîne à
> sa valeur actuelle. Elles affichent les statuts des Records projetés et rendent visible
> l'hétérogénéité, sans statut propre.

**La dette d'incohérence passe d'incohérence CONSTATÉE à CONTRADICTION DÉCIDÉE.** Les 59 pages
en `index,follow` absentes d'`indexPlan()` ne sont plus un accident entre deux sorties : B″
**fixe le `robots`** (il reste `index,follow`, hors chaîne) et **ne dit rien du plan
d'indexation**. La contradiction est donc **assumée par décision** d'un côté (robots) et
**laissée à l'arbitrage** de l'autre (plan). **Arbitrage restant** : le plan d'indexation
doit-il inclure ces 59 pages, ou leur `robots` doit-il être ramené à `noindex` ? B″ ne le
trance pas.

**Chiffrage du lot B″ (périmètre + faisabilité, sans conception d'affichage).** Les 58 pages
n'affichant aujourd'hui aucun statut :

| Type (n) | Projette des Records ? | Source du statut | B″ demande |
|---|---|---|---|
| Prédicat (37) | oui — 1–26 Records (graphe, `provenance.record`) **comptés, non listés** aujourd'hui | `buildRecordPage().status` par Record projeté | **applicable** — implique de surfacer les Records projetés (aujourd'hui seul le compte est rendu) |
| Famille (15) | **non** — le rendu est **prédicats seulement** ; les Records sont à deux sauts (famille→prédicat→Records) | — | **rien** : aucune page famille n'affiche de Record |
| Type (6) | `record` : oui (26, dont 6 affichés) ; **5 autres : non** | `buildRecordPage().status` | applicable à **1** (record) ; 5 hors périmètre |
| Index (1) | oui (33) | déjà affiché | **déjà satisfait** |

**Périmètre réel de B″ : 38 pages** (37 prédicats + le type `record`). **20 pages** (15
familles + 5 types) ne projettent aucun Record affiché — B″ ne leur demande rien, comme
anticipé. Faisabilité : les Records projetés sont dérivables (graphe), la fonction de statut
existe (`buildRecordPage`) ; le seul ajout est de **lister** les Records projetés là où
aujourd'hui seul leur compte apparaît.

---

## 5 · L'instrument — nombres rejoués depuis les fonctions

**Ces nombres ne sont pas recopiés du relevé.** Ils sont produits à l'instant par un script
qui **appelle chaque fonction source** ; la colonne de droite nomme l'appel. Réexécuter le
script reproduit la table. Un nombre faux dans un relevé serait ici **redérivé** et démenti —
c'est arrivé cette session (citations OCR-000..005 : relevé bogué 0 → rejeu 6).

| Nombre | Valeur | Fonction source (rejouée) |
|---|---|---|
| Records du corpus | **33** | `readdirSync(corpus)` |
| Records qualifiés (status !== Draft) | **0** | `buildRecordPage().status` |
| Nœuds record du graphe | **26** | `wsp-graph.json node_type==record` |
| Records absents du graphe | **7** | `33 − 26` |
| Nœuds / arêtes du graphe | **80 / 222** | `wsp-graph.json` |
| Prédicats | **37** | `allPredicates()` |
| Familles | **15** | `allFamilies()` |
| Types | **6** | `allTypes()` |
| Pages canoniques (registre) | **92** | `registryPaths()` |
| Pages dérivées (92 − 33) | **59** | `registryPaths() − Records` |
| Records indexables (robots) | **0** | `recordPlanEntries().indexable` |
| Plan d'indexation | **11** | `indexPlan()` |
| Plan de découverte | **103** | `discoveryPlan()` |
| Manifeste : file_count | **33** | `_manifest.json` |
| Manifeste : checksums en dérive | **0** | `sha256(disque) vs stocké` |

La dernière ligne est l'attestation en action : **0 dérive** aujourd'hui. Le jour où elle
cesse d'être 0, le build casse (§6).

---

## 6 · Chantiers ouverts

- **Voie B — attestation du manifeste : POSÉE.** `lib/registry/manifest.attestation.test.ts`
  (3 tests) rejoue le sha256 de chaque Record et le compare au checksum stocké, à chaque
  `npm test` (donc chaque build). Prouvée : elle attrape une dérive d'un octet et **nomme** le
  Record. La divergence de 24 h 40 min ne peut plus dormir. *(Aucun statut, aucune promotion —
  intégrité du manifeste uniquement.)* Reste ouvert : elle n'atteste **pas** la conformité de
  plage d'un id (M2, verrou §2.3).
- **Lot B″ (D-002 v2) : chiffré, non exécuté** (§4). 38 pages dans le périmètre.
- **Cycle 1 de promotion** : la Phase 1 (30 Records) est exécutable — aucun de ses Records
  n'échoue un critère dérivable mesuré. Verrou : le substrat du fait de promotion (§2.2).
- **Dette d'incohérence** : devenue contradiction décidée (§4) ; arbitrage du plan restant.
- **Deux `alias_self_loop`**, énumération hétérogène d'OCR-100, permanence anglaise : inchangés.
